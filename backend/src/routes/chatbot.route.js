import { Router } from "express";
import { generateChatbotResponse } from "../controllers/chatbot.controller.js";

const router = Router();
router.post("/generate-response", generateChatbotResponse);

export default router;
