import { Router } from "express";
import { generateChatbotResponse, ragSearch } from "../controllers/chatbot.controller.js";

const router = Router();
router.post("/generate-response", generateChatbotResponse);
router.post("/rag", ragSearch);

export default router;
