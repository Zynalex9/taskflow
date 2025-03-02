import { configDotenv } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "../database/index";
import cors from "cors";
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
app.use(express.json());
app.use(cors());

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
});
app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
