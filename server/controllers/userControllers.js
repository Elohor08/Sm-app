const HttpError = require("../models/errorModel");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const cloudinary = require("../utils/cloudinary");

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || !confirmPassword) {
      return next(new HttpError("Please fill all the fields", 422));
    }
    //Make the email lowercase
    const lowerCaseEmail = email.toLowerCase();

    //Check if the email is already registered
    const emailExist = await UserModel.findOne({ email: lowerCaseEmail });
    if (emailExist) {
      return next(new HttpError("Email already registered", 422));
    }

    //Check if the password and confirm password are same
    if (password !== confirmPassword) {
      return next(
        new HttpError("Password and Confirm Password are not same", 422)
      );
    }

    //check password length

    if (password.length < 6) {
      return next(new HttpError("Password must be at least 6 characters", 422));
    }

    //hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //add user to the database

    const user = await UserModel.create({
      fullName,
      email: lowerCaseEmail,
      password: hashedPassword,
    });
    res.json(user).status(201);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("Please fill all the fields", 422));
    }

    //Make the email lowercase
    const lowerCaseEmail = email.toLowerCase();
    //fetch the user from the database
    const user = await UserModel.findOne({ email: lowerCaseEmail });
    if (!user) {
      return next(new HttpError("Invalid Credentials", 422));
    }

    //const {uPassword, ...userInfo} = user;

    //compare the password
    const comparedPass = await bcrypt.compare(password, user?.password);
    if (!comparedPass) {
      return next(new HttpError("Invalid Credentials", 422));
    }

    const token = await jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, id: user?._id }).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return next(new HttpError("User not found", 422));
    }
    res.json(user).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

async function getUsers(req, res, next) {
  try {
    const users = await UserModel.find().limit(10).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    return next(new HttpError(error));
  }
}

const editUser = async (req, res, next) => {
  try {
    const { fullName, bio } = req.body;
    const editedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        bio,
      },
      { new: true }
    );
    res.json(editedUser).status(200);
  } catch (error) {
    return next(new HttpError(error));
  }
};

const followUnfollowUser = async (req, res, next) => {
  try {
    const { id: userToFollowId } = req.params;
    const currentUserId = req.user.id;

    if (currentUserId === userToFollowId) {
      return next(new HttpError("You cannot follow yourself", 422));
    }

    const currentUser = await UserModel.findById(currentUserId);

    // Ensure both are strings to avoid ObjectId comparison issues
    const isFollowing =
      Array.isArray(currentUser?.following) &&
      currentUser.following
        .map((id) => id.toString())
        .includes(userToFollowId.toString());

    if (!isFollowing) {
      // FOLLOW
      await UserModel.findByIdAndUpdate(userToFollowId, {
        $addToSet: { followers: currentUserId }, // addToSet prevents duplicates
      });

      await UserModel.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: userToFollowId },
      });
    } else {
      // UNFOLLOW
      await UserModel.findByIdAndUpdate(userToFollowId, {
        $pull: { followers: currentUserId },
      });

      await UserModel.findByIdAndUpdate(currentUserId, {
        $pull: { following: userToFollowId },
      });
    }

    // Optionally return the updated current user
    const updatedCurrentUser = await UserModel.findById(currentUserId).populate("following");

    res.json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      user: updatedCurrentUser,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Something went wrong", 500));
  }
};


const changeUserAvatar = async (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      return next(new HttpError("Please choose an image", 422));
    }

    const { avatar } = req.files;

    //check file size

    if (avatar.size > 500000) {
      return next(
        new HttpError("profile picture too big. should be less than 500kb")
      );
    }

    let fileName;
    fileName = avatar.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      uuid() +
      "." +
      splittedFileName[splittedFileName.length - 1];
    avatar.mv(path.join(__dirname, "..", "uploads", newFileName)),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        //store image in cloudinary

        const result = await cloudinary.uploader.upload(
          path.join(__dirname, "..", "uploads", newFileName),
          { resource_type: "image" }
        );
        if (!result.secure_url) {
          return next(
            new HttpError("Couldn't upload image to cloudinary", 422)
          );
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.user.id,
          { profilePhotos: result?.secure_url },
          { new: true }
        );
        res.json(updatedUser).status(200);
      };
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
};
