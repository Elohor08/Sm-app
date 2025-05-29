const HttpError = require("../models/errorModel");
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");

const { v4: uuid } = require("uuid");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");

//===================== CREATE POST =====================//
const createPost = async (req, res, next) => {
  try {
    const { body } = req.body;

    if (!body) {
      return next(new HttpError("Fill in text field", 422));
    }

    let imageUrl = null;

    if (req.files && req.files.image) {
      const { image } = req.files;

      if (image.size > 1000000) {
        return next(
          new HttpError("Image too big. Should be less than 1MB", 422)
        );
      }

      let fileName = image.name.split(".");
      fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];

      const uploadPath = path.join(__dirname, "..", "uploads", fileName);

      await image.mv(uploadPath);

      const result = await cloudinary.uploader.upload(uploadPath, {
        resource_type: "image",
      });

      if (!result.secure_url) {
        return next(new HttpError("Image not uploaded", 400));
      }

      imageUrl = result.secure_url;
    }

    const newPost = await PostModel.create({
      creator: req.user.id,
      body,
      image: imageUrl, // this will be null if no image was uploaded
    });

    await UserModel.findByIdAndUpdate(
      newPost.creator,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    res.json(newPost);
  } catch (error) {
    return next(new HttpError(error.message || "Something went wrong", 500));
  }
};


//===================== GET POST =====================//
const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await PostModel.findById(id)
      .populate("creator")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
      });
    res.json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================== GET POSTS =====================//
const getPosts = async (req, res, next) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================== UPDATE POST =====================//
const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { body } = req.body;
    //get post from db
    const post = await PostModel.findById(postId);
    // check if creator of post is the same as logged in user
    if (post?.creator != req.user.id) {
      return next(
        new HttpError("You are not authorized to update this post", 403)
      );
    }
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { body },
      { new: true }
    );
    res.json(updatedPost).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================== DELETE POST =====================//
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    //get post from db
    const post = await PostModel.findById(postId);
    // check if creator of post is the same as logged in user
    if (post?.creator != req.user.id) {
      return next(
        new HttpError("You are not authorized to update this post", 403)
      );
    }

    const deletedPost = await PostModel.findByIdAndDelete(postId);
    await UserModel.findByIdAndUpdate(
      post?.creator,
      { $pull: { posts: post?._Id } },
      { new: true }
    );
    res.json(deletedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================== GET FOLLOWINGS POST =====================//
const getFollowingPost = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    const posts = await PostModel.find({ creator: { $in: user?.following } });
    res.json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================== LIKE/DISLIKE POST =====================//
const likeDislikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);
    //check if user has already liked the post
    let updatedPost;
    if (post?.likes.includes(req.user.id)) {
      //remove like
      updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $pull: { likes: req.user.id } },
        { new: true }
      );
    } else {
      //add like
      updatedPost = await PostModel.findByIdAndUpdate(
        id,
        { $push: { likes: req.user.id } },
        { new: true }
      );
    }
    res.json(updatedPost);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================== GET USER POST =====================//
const getUserPost = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const posts = await UserModel.findById(userId).populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
    });
    res.json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================== CREATE BOOKMARK =====================//
const createBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    // get user and check if user has already bookmarked the post
    const user = await UserModel.findById(req.user.id);
    const postIsBookmarked = user?.bookmarks.includes(id);
    if (postIsBookmarked) {
      //remove bookmark
      const userBookmarks = await UserModel.findByIdAndUpdate(
        req.user.id,
        { $pull: { bookmarks: id } },
        { new: true }
      );
      res.json(userBookmarks);
    } else {
      const userBookmarks = await UserModel.findByIdAndUpdate(
        req.user.id,
        { $push: { bookmarks: id } },
        { new: true }
      );
      res.json(userBookmarks);
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===================== GET BOOKMARK =====================//
const getUserBookmarks = async (req, res, next) => {
  try {
    const userBookmarks = await UserModel.findById(req.user.id).populate({
      path: "bookmarks",
      options: { sort: { createdAt: -1 } },
    });
    res.json(userBookmarks);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getFollowingPost,
  likeDislikePost,
  getUserPost,
  createBookmark,
  getUserBookmarks,
};
