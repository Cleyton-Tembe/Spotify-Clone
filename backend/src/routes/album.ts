import { Router } from "express";
import { getAlbumById, getAllAlbums } from "../controller/album.ts";

const albumRouter = Router();

albumRouter.get("/", getAllAlbums);
albumRouter.get("/:albumId", getAlbumById);

export default albumRouter;
