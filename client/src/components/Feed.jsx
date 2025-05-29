import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import TimeAgo from "react-timeago";
import { FaRegCommentDots } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import LikeDislikePost from "./LikeDislikePost";
import TrimText from "../helpers/TrimText";
import BookmarksPost from "./BookmarksPost";
import { uiSliceActions } from "../store/ui-slide";
import {HiDotsHorizontal} from "react-icons/hi"

const Feed = ({ post, onDeletePost }) => {
  const [creator, setCreator] = useState({});
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.id);
  const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false);
  const dispatch = useDispatch();

  const location = useLocation();

  const getPostCreator = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/${post?.creator}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCreator(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPostCreator();
  }, []);

  const closeFeedHeaderMenu = () => {
    setShowFeedHeaderMenu(false);
  };

  const showEditPostModal = () => {
    dispatch(uiSliceActions?.openEditPostModal(post?._id));
    closeFeedHeaderMenu();
  };

  const deletePost = () => {
    onDeletePost(post?._id);
    closeFeedHeaderMenu();
  };
  return (
    <article className="feed">
      <header className="feed__header">
        <Link to={`/users/${post?.creator}`} className="feed__header-profile">
          <ProfileImage image={creator?.profilePhoto} />
          <div className="feed_header-details">
            <h4>{creator?.fullName}</h4>
            <small>
              {" "}
              <TimeAgo date={post?.createdAt} />{" "}
            </small>
          </div>
        </Link>

        {showFeedHeaderMenu &&
          userId == post?.creator &&
          location.pathname.includes("users") && (
            <menu className="feed__header-menu">
              <button onClick={showEditPostModal}>Edit</button>
              <button onClick={deletePost}>Delete</button>
            </menu>
          )}

          {userId == post?.creator && location.pathname.includes("users") && <button onClick={()=>setShowFeedHeaderMenu(!showFeedHeaderMenu)}> <HiDotsHorizontal/> </button>  }
      </header>
      <Link to={`posts/${post?._id}`} className="feed__body">
        <p>
          {" "}
          <TrimText item={post?.body} maxLength={160} />{" "}
        </p>
        <div className="feed__images">
          <img src={post?.image} alt="" />
        </div>
      </Link>

      <footer className="feed__footer">
        <div>
          <LikeDislikePost post={post} />
          <button className="feed__footer-comments">
            <Link to={`/posts/${post?._id}`}>
              {" "}
              <FaRegCommentDots />
            </Link>
            <small>{post?.comments?.length}</small>
          </button>
          <button className="feed_footer-share">
            <IoMdShare />
          </button>
        </div>

        <BookmarksPost post={post} />
      </footer>
    </article>
  );
};

export default Feed;
