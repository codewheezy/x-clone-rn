import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotifications, deleteNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.use(protectRoute);
router.get("/", getNotifications);
router.delete("/:notificationId", deleteNotification);

export default router;