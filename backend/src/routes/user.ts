import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import { getAllUsers, getMessages } from "../controller/user.ts";

const userRouter = Router();

userRouter.use(protectRoute);

userRouter.get("/", getAllUsers);
userRouter.get("/messages/:userId", getMessages);

export default userRouter;
