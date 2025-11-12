import express from 'express';
import {protectRoute} from "../middleware/auth.middleware.js";
import { getAllTickets, getStudentTickets, createTicket, markAsResolved, markAsInProgress } from "../controllers/ticket.controller.js";

const router = express.Router();

router.get("/all-tickets", protectRoute, getAllTickets)
router.get("/student-tickets", protectRoute, getStudentTickets)
router.get("/create", protectRoute, createTicket)

router.put("/:id/resolve", protectRoute, markAsResolved)
router.put("/:id/pending", protectRoute, markAsInProgress)

export default router;