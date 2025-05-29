import React from "react";
import ProfileImage from "./ProfileImage";
import { useSelector } from "react-redux";
import { SlPicture } from "react-icons/sl";

const CreatePost = ({ onCreatePost, error }) => {
  const [body, setBody] = React.useState("");
  const [image, setImage] = React.useState(null);
  const profilePhoto = useSelector(
    (state) => state?.user?.currentUser?.profilePhoto
  );

  // FUNCTION TO CREATE POST
  const createPost = (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set("body", body);
    if (image) {
      postData.set("image", image); // only add if selected
    }
    onCreatePost(postData);
    setBody("");
    setImage(null);
  };

  return (
    <form
      className="createPost"
      encType="multipart/form-data"
      onSubmit={createPost}
    >
      {error && <p className="createPost__error-message">{error}</p>}
      <div className="createPost__top">
        <ProfileImage image={profilePhoto} />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
        />
      </div>

      <div className="createPost__bottom">
        <span></span>
        <div className="createPost__actions">
          <label htmlFor="image">
            <SlPicture />
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ display: "none" }} // optional: hide input
          />
          <button type="submit">Post</button>
        </div>
      </div>
    </form>
  );
};

export default CreatePost;
