import express from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import {getTicketsForSidebar, getMessages, sendMessage, getUnreadCounts, getLatestMessages, deleteAllMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/tickets", protectRoute, getTicketsForSidebar)
router.get("/unread-counts", protectRoute, getUnreadCounts)
router.get("/latest-messages", protectRoute, getLatestMessages)
router.delete("/delete-all", protectRoute, deleteAllMessages)

router.get("/:ticketId", protectRoute, getMessages)
router.post("/send/:ticketId", protectRoute, sendMessage)

export default router;