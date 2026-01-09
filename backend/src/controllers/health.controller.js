import mongoose from "mongoose";

export const checkHealth = async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  
  const healthStatus = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    database: dbStatus,
  };

  try {
    if (dbStatus !== "connected") {
      throw new Error("Database not connected");
    }
    res.status(200).json(healthStatus);
  } catch (error) {
    healthStatus.message = error.message;
    res.status(503).json(healthStatus);
  }
}