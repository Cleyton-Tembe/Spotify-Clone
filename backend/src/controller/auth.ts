import type { Request, Response } from "express";
import { User } from "../model/user.ts";

const authCallBack = async (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    if (!id && !firstName && !lastName && !imageUrl) {
      return res.status(400).json({ message: "you must fill all the fields" });
    }

    const dbUser = await User.findOne({ clerkId: id });

    if (!dbUser) {
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`.trim(),
        imageUrl: imageUrl,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Register Controller: ", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default authCallBack;
