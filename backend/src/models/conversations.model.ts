import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  members: {
    type: Array,
    required: true,
  },
});

const Conversations = mongoose.model("conversation", conversationSchema);

export default Conversations;
