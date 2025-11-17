import express from 'express';
import dotenv from "dotenv"; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import {connectDB} from './lib/db.js';
import { app, server } from './lib/socket.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import chatbotRoutes from './routes/chatbot.route.js';
import knowledgeRoutes from './routes/knowledgebase.route.js';
import chatragRoutes from './routes/chatrag.route.js';
import ticketRoutes from './routes/ticket.route.js';

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); 

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/knowledge-base", knowledgeRoutes);
app.use("/api/chatrag", chatragRoutes);
app.use("/api/ticket", ticketRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log('Server is running on PORT:' + PORT);
  connectDB();
});
