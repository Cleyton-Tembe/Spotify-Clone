import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.ts";
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleAlbum,
  deleteSong,
} from "../controller/admin.ts";

const adminRouter = Router();

adminRouter.use(protectRoute, requireAdmin);

adminRouter.get("/check", checkAdmin);

adminRouter.post("/songs", createSong);
adminRouter.post("/albums", createAlbum);

adminRouter.delete("/songs/:id", deleteSong);
adminRouter.delete("/albums/:id", deleAlbum);

export default adminRouter;
