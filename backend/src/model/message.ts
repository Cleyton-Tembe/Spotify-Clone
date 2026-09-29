import mongoose, { Model } from "mongoose";
import type { IMessage } from "../interface/Imodel.ts";

const messageSchema = new mongoose.Schema<IMessage>(
  {
    senderId: { type: String, required: true }, // Clerk user ID
    receiverId: { type: String, required: true }, // Clerk user ID
    content: { type: String, required: true },
  },
  { timestamps: true },
);

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
