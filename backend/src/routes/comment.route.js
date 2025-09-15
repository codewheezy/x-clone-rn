import express from "express";
import { createComment, getComments, deleteComment } from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

// public routes 
router.get("/post/:postId", getComments);

// protected routes
router.use(protectRoute);
router.post("/post/:postId", createComment);
router.delete("/:commentId", deleteComment);

export default router;