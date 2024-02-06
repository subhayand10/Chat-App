import { Router } from "express";
import { createMessage, getMessages,getReceiver } from "../controllers/messages.controllers";

const router = Router();

router.post("/messages", createMessage);
router.get("/messages/:conversationId", getMessages);
router.get("/users/:receiverId", getReceiver);

export default router;
