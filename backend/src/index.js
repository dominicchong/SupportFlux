import express from 'express';
import dotenv from "dotenv"; 
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';

import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import chatbotRoutes from './routes/chatbot.route.js';
import knowledgeRoutes from './routes/knowledgebase.route.js';
import chatragRoutes from './routes/chatrag.route.js';
import { app, server } from './lib/socket.js';

dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser()); 

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/knowledge-base", knowledgeRoutes);
app.use("/api/chatrag", chatragRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log('Server is running on PORT:' + PORT);
  connectDB();
});
