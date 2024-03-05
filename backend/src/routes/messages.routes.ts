import { Router } from "express";
import { createMessage, getMessages,getReceiver,getAllUsers } from "../controllers/messages.controllers";

const router = Router();

router.post("/messages", createMessage);
router.get("/messages/:conversationId", getMessages);
router.get("/users/:receiverId", getReceiver);
router.get("/users",getAllUsers);

export default router;
