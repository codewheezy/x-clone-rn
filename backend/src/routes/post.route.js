import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getPosts, getPost, getUserPosts, createPost, likePost, deletePost } from "../controllers/post.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

//public routes
router.get("/", getPosts)
router.get("/:postId", getPost);
router.get("/user/:username", getUserPosts)

// protected routes 
router.use(protectRoute);
router.post("/", upload.single("image"), createPost);
router.post("/:postId/like", likePost);
router.delete("/:postId", deletePost);

export default router;