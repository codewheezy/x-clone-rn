import express from "express"
import { protectRoute } from "../middleware/auth.middleware";
import { getPosts, getPost, getUserPosts, createPost, likePost, deletePost } from "../controllers/post.controller";
import upload from "../middleware/upload.middleware";

const router = express.Router();

//public routes
router.get("/", getPosts)
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts)

// protected routes 
router.post("/", protectRoute, upload.single("image"), createPost);
router.post("/:postId/like", protectRoute, likePost);
router.delete("/:postId", protectRoute, deletePost);

export default router;