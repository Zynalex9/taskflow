import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./database/index";
import { Redis } from "ioredis";
import cookieParser from "cookie-parser";
import { boardRouter, cardRouter, listRouter, userRouter, workSpaceRouter } from "./routes";
import { verifyJWT } from "./middleware/auth.middleware";
import ApiResponse from "./utils/ApiResponse";
import { asyncHandler } from "./utils/asyncHandler";
configDotenv();
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // this is for development
    methods: ["GET", "POST"],
  },
});
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
});
app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});
export const redisClient = new Redis({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: 14029,
});
redisClient.on("connect", () => {
  console.log("Connected to redis");
});
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});
app.use("/api/user/", userRouter);
app.use("/api/workspace/", workSpaceRouter);
app.use("/api/board/",boardRouter)
app.use("/api/list/",listRouter)
app.use("/api/card/", cardRouter);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
