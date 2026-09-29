import type { Request, Response } from "express";
import { Album } from "../model/album.ts";

export const getAllAlbums = async (req: Request, res: Response) => {
  try {
    const albums = await Album.find();
    return res.status(200).json(albums);
  } catch (error) {
    console.log("Error in getAllAlbums", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getAlbumById = async (req: Request, res: Response) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId).populate("songs");

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    return res.status(200).json(album);
  } catch (error) {
    console.log("Error in getAlbumById", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};
