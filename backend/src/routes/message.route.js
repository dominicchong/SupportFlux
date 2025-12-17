import express from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import {getMessages, sendMessage, getUnreadCounts, getLatestMessages, deleteAllMessages, getAllMessages } from "../controllers/message.controller.js";
import { requireAccess } from '../middleware/requireAccess.middleware.js';

const router = express.Router();

router.get("/all-messages", protectRoute, getAllMessages)
router.get("/unread-counts", protectRoute, getUnreadCounts)
router.get("/latest-messages", protectRoute, getLatestMessages)
router.delete("/delete-all", protectRoute, requireAccess, deleteAllMessages)

router.get("/:ticketId", protectRoute, getMessages)
router.post("/:ticketId/send", protectRoute, sendMessage)

export default router;