import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/index.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import userRouter from "./routes/user.routes.js"
import cors from "cors"

const app = express();
const httpServer = createServer(app);

app.use(express.json())

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*" // This might give CORS error for some origins due to credentials set to true
        : process.env.CORS_ORIGIN?.split(","), // For multiple cors origin for production. Refer https://github.com/hiteshchoudhary/apihub/blob/a846abd7a0795054f48c7eb3e71f3af36478fa96/.env.sample#L12C1-L12C12
    credentials: true,
  })
);


const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io); // Mounting the `io` instance on the app

// Chat App Routes
app.use("/api/v1/chat-app/chats", chatRouter);
app.use("/api/v1/chat-app/messages", messageRouter);
app.use("/api/v1/users", userRouter)

// Initialize Socket.IO
initializeSocketIO(io);

export { httpServer };