import { configDotenv } from "dotenv";
import express from "express";
import { createServer } from "http";
import { connectDB } from "./database/index";
import { Redis } from "ioredis";
import cookieParser from "cookie-parser";
import {
  boardRouter,
  cardRouter,
  listRouter,
  userRouter,
  workSpaceRouter,
} from "./routes";
import cors from "cors";
import { initSocket } from "./socket";
configDotenv();
connectDB();

const app = express();
const server = createServer(app);
const io = initSocket(server);
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.3:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
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
app.use("/api/board/", boardRouter);
app.use("/api/list/", listRouter);
app.use("/api/card/", cardRouter);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
