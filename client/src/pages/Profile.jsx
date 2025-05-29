import React, { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile";
import HeaderInfo from "../components/HeaderInfo";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import Feed from "../components/Feed";
import EditPostModal from "../components/EditPostModal";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userPost, setUserPost] = useState([]);
  const { id: userId } = useParams();
  const token = useSelector((state) => state?.user?.currentUser?.token);
  const EditPostModalOpen = useSelector(
    (state) => state?.ui?.EditPostModalOpen
  );
   const EditProfileModalOpen = useSelector(
    (state) => state?.ui?.EditProfileModalOpen
  );
  const getUserPost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/${userId}/posts`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response?.data);
      setUserPost(
        Array.isArray(response?.data?.posts)
          ? response.data.posts
          : response.data?.posts
          ? [response.data.posts]
          : []
      );
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    getUserPost();
  }, [userId]);

  console.log(userPost);
  console.log(user);
  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      setUserPost(userPost?.filter((p) => p?._id != postId));
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async (data, postId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        data,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.status === 200) {
        const updatedPost = response.data;
        setUserPost(
          userPost?.map((post) =>
            updatedPost._id.toString() === post._id.toString()
              ? { ...post, body: updatedPost.body }
              : post
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <UserProfile />
      <HeaderInfo text={`${user?.fullName}'s Post`} />
      <section className="profile__posts">
        {userPost?.length < 1 ? (
          <p className="center">No Posts by this user</p>
        ) : (
          userPost?.map((post) => (
            <Feed key={post?._id} post={post} onDeletePost={deletePost} />
          ))
        )}
      </section>
      {EditPostModalOpen && <EditPostModal onUpdatePost={updatePost} />}
      {EditProfileModalOpen && <EditProfileModal  />}
    </section>
  );
};

export default Profile;
