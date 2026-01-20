import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import chatbotRoutes from './routes/chatbot.route.js';
import knowledgeRoutes from './routes/knowledgebase.route.js';
import chatragRoutes from './routes/chatrag.route.js';
import ticketRoutes from './routes/ticket.route.js';
import healthRoutes from './routes/health.route.js'
import categoryRoutes from './routes/category.route.js'

dotenv.config();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/knowledge-base", knowledgeRoutes);
app.use("/api/chatrag", chatragRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/category", categoryRoutes);

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../../frontend/dist");
  console.log("Checking build path:", buildPath);

  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
