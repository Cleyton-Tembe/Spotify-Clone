import { clerkClient } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in!" });
  }

  next();
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.auth.userId) {
      return res.status(401).json({
        message:
          "Unauthorized - you are not the king of the realm return to your filty world ",
      });
    }
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized - you must be worthy of the title!" });
    }

    next();
  } catch (error) {
    console.error("require Admin: ", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
