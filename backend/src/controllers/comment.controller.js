import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Comment from "../models/comment.model.js";
import { getAuth } from "@clerk/express";
import { HttpStatus } from "../constant/http-status.js";


export const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture");

  res.status(HttpStatus.OK).json({ comments });
})

export const createComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim() === "") {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: "Comment content is required" })
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post) return res.status(HttpStatus.NOT_FOUND).json({ error: "User or post not found" });

  const comment = await Comment.create({
    user: user._id,
    post: postId,
    content,
  });

  // link the comment to the post
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  // create notification if not commenting on own post
  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }

  res.status(HttpStatus.CREATED).json({ comment })
})

export const deleteComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { commentId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    return res.status(HttpStatus.NOT_FOUND).json({ error: "User or comment not found" });
  }

  if (comment.user.toString() !== user._id.toString()) {
    return res.status(HttpStatus.FORBIDDEN).json({ error: "You can only delete your own comments" });
  }

  // remove comment from post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: commentId },
  });

  // delete the comment
  await Comment.findByIdAndDelete(commentId);

  res.status(HttpStatus.OK).json({ message: "Comment deleted successfully" });
})


// OK: 200,
// CREATED: 201,
// ACCEPTED: 202,
// BAD_REQUEST: 400,
// FORBIDDEN: 403,
// NOT_FOUND: 404,
// INTERNAL_SERVER_ERROR: 500,

