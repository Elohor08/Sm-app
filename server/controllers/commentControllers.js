const HttpError = require("../models/errorModel");
const CommentModel = require("../models/commentModel");
const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");

///==================CREATE COMMENT
    const createComment = async (req, res, next) => {
        try{
            const {postId} = req.params
            const {comment} = req.body
            if(!comment){
                return next(new HttpError("Comment is required", 400))
            }

            //get comment creator from db

            const commentCreator = await UserModel.findById(req.user.id)
            const newComment = await CommentModel.create({
                creator: {
                    creatorId: req.user.id,
                    creatorName: commentCreator?.fullName,
                    creatorPhoto: commentCreator?.profilePhoto,
                },
                postId,
                comment
            })

            await PostModel.findByIdAndUpdate(
                postId,
                { $push: { comments: newComment?._id } },
                { new: true }
            )

            res.json(newComment)
        }catch(error){
            return next(new HttpError(error))
        }
    }


     const getPostComment = async (req, res, next) => {
        try{
            const {postId} = req.params;
            const comments = await CommentModel.findById(postId)
            .populate({path: "comments", options: { sort: { createdAt: -1 } }})
            res.json(comments)
        }catch(error){
            return next(new HttpError(error))
        }
    }


     const deleteComment = async (req, res, next) => {
        try{
            const {commentId} = req.params
            const comment = await CommentModel.findById(commentId)
         const commentCreator = await UserModel.findById(comment?.creator?.creatorId)
            if(commentCreator?.id !== req.user.id){
                return next(new HttpError("You are not authorized to delete this comment", 403))
            }
           
            await PostModel.findByIdAndUpdate(
                comment?.postId,
                { $pull: { comments: commentId } },
                { new: true }
            )
           const deletedComment = await CommentModel.findByIdAndDelete(commentId);
            res.json(deletedComment) 
        }catch(error){
            return next(new HttpError(error))
        }
    }


    module.exports = {
        createComment,
        getPostComment,
        deleteComment
    }