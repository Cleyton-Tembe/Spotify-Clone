import type { Request, Response } from "express";
import { User } from "../model/user.ts";
import { Message } from "../model/message.ts";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.auth.userId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const myId = req.auth.userId;
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};
