import { Router } from "express";
import {
  createConversation,
  getConversation,
} from "../controllers/conversations.controllers";

const router = Router();

router.post("/conversations", createConversation);
router.get("/conversations/:conversationId", getConversation);

export default router;
