import express from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import { getAllTickets, getMyTickets, createTicket, updateStatus, deleteAllTickets, getByTicketId, updateStaffId } from "../controllers/ticket.controller.js";
import { requireAccess } from '../middleware/requireAccess.middleware.js';

const router = express.Router();

router.get("/all", protectRoute, requireAccess, getAllTickets)
router.get("/my-tickets", protectRoute, getMyTickets)
router.post("/create", protectRoute, createTicket)
router.put("/assign-staff", protectRoute, requireAccess, updateStaffId)
router.delete("/delete-all", protectRoute, requireAccess, deleteAllTickets)

router.get("/:ticketId", protectRoute, getByTicketId)
router.put("/:id/update-status", protectRoute, requireAccess, updateStatus)

export default router;