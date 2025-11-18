import express from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import { getAllTickets, getStudentTickets, createTicket, updateStatus, deleteAllTickets } from "../controllers/ticket.controller.js";
import { requireAccess } from '../middleware/requireAccess.middleware.js';

const router = express.Router();

router.get("/all-tickets", protectRoute, requireAccess, getAllTickets)
router.get("/student-tickets", protectRoute, getStudentTickets)

router.post("/create", protectRoute, requireAccess, createTicket)
router.put("/:id/update-status", protectRoute, requireAccess, updateStatus)
router.delete("/delete-all", protectRoute, requireAccess, deleteAllTickets)

export default router;