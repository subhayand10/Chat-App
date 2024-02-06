import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
  },
});

const Messages = mongoose.model("message", messageSchema);

export default Messages;
