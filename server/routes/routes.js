const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  editUser,
  followUnfollowUser,
  changeUserAvatar,
} = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/postControllers");

const {
  createComment,
  getPostComment,
  deleteComment,
} = require("../controllers/commentControllers");

const {
    createMessage,
    getMessages,
    getConversation
} = require("../controllers/messageControllers");

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/users/bookmarks", authMiddleware, getUserBookmarks);
router.get("/user/:id", authMiddleware, getUser);
router.get("/users", authMiddleware, getUsers);
router.patch("/user/edit/:id", authMiddleware, editUser);
router.get("/user/:id/follow-unfollow", authMiddleware, followUnfollowUser);
router.post("/user/avatar/:id", authMiddleware, changeUserAvatar);
router.get("/user/:id/posts", getUserPost);

//POST ROUTES

router.post("/posts", authMiddleware, createPost);
router.get("/posts/following", authMiddleware, getFollowingPost);
router.get("/posts/:id", authMiddleware, getPost);
router.get("/posts", authMiddleware, getPosts);
router.patch("/posts/:id", authMiddleware, updatePost);
router.delete("/posts/:id", authMiddleware, deletePost);
router.get("/posts/:id/like", authMiddleware, likeDislikePost);
router.get("/posts/:id/bookmark", authMiddleware, createBookmark);

router.post("/comments/:postId", authMiddleware, createComment);
router.get("/comments/:postId", authMiddleware,  getPostComment);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

router.post('/messages/:receiverId',authMiddleware, createMessage);
router.get('/messages/:receiverId', authMiddleware, getMessages);
router.get('/conversation/', authMiddleware, getConversation);

module.exports = router;
