import express, { Request, Response } from "express";
import userRoutes from "./routes/auth.routes"
import mongoose from "mongoose";
import 'dotenv/config'

const uri =
  `mongodb+srv://subhayansd10:${process.env.password}@cluster0.9pu5syg.mongodb.net/ChatApp?retryWrites=true&w=majority`;


const app = express();
app.use(express.json());
app.use(userRoutes)
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Chat App");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  async function run() {
    try {
      await mongoose.connect(uri);
      console.log("Connected to DB");
    } catch(error) {
      console.log(error)
    }
  }
  run()
});
