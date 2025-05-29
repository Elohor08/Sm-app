import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileImage from "../components/ProfileImage";
import { useSelector } from "react-redux";
import TimeAgo from "react-timeago";
import axios from "axios";
import LikeDislikePost from "../components/LikeDislikePost";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdSend, IoMdShare } from "react-icons/io";
import BookmarksPost from "../components/BookmarksPost";
import PostComment from "../components/PostComment";

const SinglePost = () => {
  let { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const token = useSelector((state) => state?.user?.currentUser?.token);

  // Get post from DB
  const getPost = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPost(response?.data);
      setComments(response?.data?.comments || []);
    } catch (err) {
      console.log(err);
    }
  };

 
  const deleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${commentId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(comments?.filter((c) => c?._id !== commentId));
    } catch (error) {
      console.log(error);
    }
  };

  const createComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${id}`,
        { comment },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newComment = response?.data;
      setComments([newComment, ...comments]);
      setComment(""); // Clear textarea
    } catch (error) {
      console.log(error);
    }
  };


   useEffect(() => {
    getPost();
  }, [deleteComment]);

  return (
    <section className="singlePost">
      <header className="feed__header">
        <ProfileImage image={post?.creator?.profilePhoto} />
        <div className="feed__header-details">
          <h4>{post?.creator?.fullName}</h4>
          <small>
            <TimeAgo date={post?.createdAt} />
          </small>
        </div>
      </header>

      <div className="feed__body">
        <p>{post?.body}</p>
        <div className="feed__images">
          <img src={post?.image} alt="Post content" />
        </div>
      </div>

      <footer className="feed__footer">
        <div className="">
          {post?.likes && <LikeDislikePost post={post} />}
          <button className="feed__footer-comments">
            <FaRegCommentDots />
          </button>
          <button className="feed__footer-share">
            <IoMdShare />
          </button>
        </div>
        <BookmarksPost post={post} />
      </footer>

      <ul className="singlePost__comment">
        <form
          className="singlePost__comment form"
          onSubmit={createComment}
        >
          <textarea
            placeholder="Enter your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="singlePost__comments-btn">
            <IoMdSend />
          </button>
        </form>

        {comments?.map((comment) => (
          <PostComment
            key={comment?._id}
            comment={comment}
            onDeleteComment={deleteComment}
          />
        ))}
      </ul>
    </section>
  );
};

export default SinglePost;
