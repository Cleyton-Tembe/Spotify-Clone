import { Router } from "express";
import authCallBack from "../controller/auth.ts";

const authRouter = Router();

authRouter.post("/callback", authCallBack);

export default authRouter;
