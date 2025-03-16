import { configDotenv } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./database/index";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter, workSpaceRouter } from "./routes";
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

app.use("/api/",userRouter)
app.use("/api/workspace/",workSpaceRouter)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
