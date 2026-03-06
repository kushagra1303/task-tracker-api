import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { connectRedis } from "./config/redis";
dotenv.config();

const app = express();  

app.use(express.json());

connectDB();
connectRedis();

app.get("/", (req, res) => {
  res.send("Task Tracker API running");
});

// register routes
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});