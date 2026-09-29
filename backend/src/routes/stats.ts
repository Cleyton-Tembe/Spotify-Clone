import { Router } from "express";
import { getStats } from "../controller/stats.ts";
import { protectRoute, requireAdmin } from "../middleware/auth.ts";

const statsRouter = Router();

statsRouter.get("/", protectRoute, requireAdmin, getStats);

export default statsRouter;
