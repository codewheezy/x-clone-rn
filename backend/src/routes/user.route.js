import express from "express";
import { getUserProfile, syncUser, updateProfile, getCurrentUser, followUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

// public route
router.get("/profile/:username", getUserProfile);

// protected routes 
router.use(protectRoute);
router.post("/sync", syncUser);
router.post("/me", getCurrentUser);
router.put("/profile", updateProfile);
router.post("/follow/:targetUserId", followUser);

export default router;