import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

const BookmarksPost = ({ post }) => {
  const [user, setUser] = useState({});
  const [postBookMarked, setPostBookmarked] = useState(false);

  const token = useSelector((state) => state?.user?.currentUser?.token);
  const userId = useSelector((state) => state?.user?.currentUser?.Id);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = response.data;
      setUser(userData);

      if (response?.data?.bookmarks?.includes(post?._id)) {
        setPostBookmarked(true);
      } else {
        setPostBookmarked(false);
      }
      setPostBookmarked(userData?.bookmarks?.includes(post?._id));
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (userId && token) {
      getUser();
    }
  }, [userId, token]);

  // FUNCTION TO CREATE/REMOVE BOOKMARK
  const createBookmark = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedBookmarks = response?.data?.bookmarks;
      setPostBookmarked(updatedBookmarks?.includes(post?._id));
    } catch (error) {
      console.log("Error toggling bookmark:", error);
    }
  };

  return (
    <button className="feed__footer-bookmark" onClick={createBookmark}>
      {postBookMarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default BookmarksPost;
