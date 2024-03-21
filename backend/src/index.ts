import express, { Request, Response } from "express";
import userRoutes from "./routes/auth.routes";
import conversationRoutes from "./routes/conversations.routes";
import messagesRoutes from "./routes/messages.routes";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import {Server} from "socket.io";
import http from "http";
import Users from "./models/users.model";


const uri = `mongodb+srv://subhayansd10:${process.env.password}@cluster0.9pu5syg.mongodb.net/ChatApp?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(conversationRoutes);
app.use(messagesRoutes);
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io=new Server(server,{
  cors:{
    origin:"*",
  }
});

//const users: { userId: string; socketId: string }[] = [];

let users: { userId: string; socketId: string }[] = [];
io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await Users.findById(senderId);
      console.log("sender :>> ", sender, receiver);
      if (receiver) {
        io.to(receiver.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email },
          });
      } else {
        io.to(sender.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId,
          receiverId,
          user: { id: user._id, fullName: user.fullName, email: user.email },
        });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
  // io.emit('getUsers', socket.userId);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Chat App");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  async function run() {
    try {
      await mongoose.connect(uri);
      console.log("Connected to DB");
    } catch (error) {
      console.log(error);
    }
  }
  run();
});

export default server;