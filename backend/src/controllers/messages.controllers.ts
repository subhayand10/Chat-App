import Messages from "../models/messages.model";
import Conversations from "../models/conversations.model";
import Users from "../models/users.model";
import { Request, Response } from "express";


const createMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    console.log(conversationId)
    if (!senderId || !message)
      return res.status(400).send("Please fill all required fields");
    if (conversationId === "new" && receiverId) {
      const newCoversation = new Conversations({
        members: [senderId, receiverId],
      });
      await newCoversation.save();
      const newMessage = new Messages({
        conversationId: newCoversation._id,
        senderId,
        message,
      } );
      await newMessage.save();
      return res.status(200).send("Message sent successfully");
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("Please fill all required fields");
    }
    console.log(conversationId);
    const newMessage = new Messages({ conversationId, senderId, message });
    console.log(newMessage)
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log(error, "Error");
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const checkMessages = async (conversationId:string) => {
      console.log(conversationId, "conversationIdsss");
      const messages = await Messages.find({ conversationId });
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          const user = await Users.findById(message.senderId);
          return {
            user: { id: user?._id, email: user?.email, fullName: user?.fullName,conversationId },
            message: message.message,
          };
        })
      );
      res.status(200).json(await messageUserData);
    };
    const conversationId = req.params.conversationId;
    if (conversationId === "new") {
      const checkConversation = await Conversations.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        console.log("TEST")
        console.log(checkConversation[0]._id.toString());
        checkMessages(checkConversation[0]._id.toString());
      } else {
        //return res.status(200).json([]);
        return res.status(200).json([{user:{conversationId: "new"}}]);
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log("Error", error);
  }
};

const getReceiver = async (req: Request, res: Response) => {
  try {
    const receiverId = req.params.receiverId;
    const users = await Users.find({ _id: { $ne: receiverId } });
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullName: user.fullName,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    console.log("Error", error);
  }
};

const getAllUsers=async(req: Request,res: Response) => {
  try {
    const users = await Users.find();
    const usersData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullName: user.fullName,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(await usersData);
  } catch (error) {
    console.log("Error", error);
  }
}




export { createMessage, getMessages,getReceiver,getAllUsers };
