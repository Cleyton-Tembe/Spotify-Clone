import type { Request, Response } from "express";
import { unlink } from "node:fs/promises";
import { Song } from "../model/song.ts";
import { Album } from "../model/album.ts";
import cloudinary from "../config/cloudinary.ts";
import type { UploadedFile } from "express-fileupload";

const firstFile = (file: UploadedFile | UploadedFile[] | undefined) =>
  Array.isArray(file) ? file[0] : file;

const uploadToCloudinary = async (file: UploadedFile) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } finally {
    await unlink(file.tempFilePath).catch(() => {});
  }
};

export const createSong = async (req: Request, res: Response) => {
  try {
    const audioFile = firstFile(req.files?.audioFile);
    const imageFile = firstFile(req.files?.imageFile);

    if (!audioFile || !imageFile) {
      return res
        .status(400)
        .json({ message: "You must upload an audio file and an image" });
    }

    const { title, artist, albumId, duration } = req.body;

    if (!title || !artist || !duration) {
      return res
        .status(400)
        .json({ message: "Title, artist and duration are required" });
    }

    if (albumId && !(await Album.exists({ _id: albumId }))) {
      return res.status(400).json({ message: "That album doesn't exist" });
    }

    const [audioUrl, imageUrl] = await Promise.all([
      uploadToCloudinary(audioFile),
      uploadToCloudinary(imageFile),
    ]);

    const song = await Song.create({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration: Number(duration),
      albumId: albumId || null,
    });

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
    }

    return res.status(201).json({ song });
  } catch (error) {
    console.error("createSong: ", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "no id provided fellow" });
    }

    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);
    return res.status(200).json({ message: "song deleted successfully" });
  } catch (error) {
    console.error("deleteSong: ", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const imageFile = firstFile(req.files?.imageFile);

    if (!imageFile) {
      return res.status(400).json({ message: "Upload a cover image" });
    }

    if (!title || !artist || !releaseYear) {
      return res
        .status(400)
        .json({ message: "Title, artist and release year are required" });
    }

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = await Album.create({
      title,
      artist,
      imageUrl,
      releaseYear: Number(releaseYear),
    });

    return res.status(201).json(album);
  } catch (error) {
    console.error("Error in createAlbum", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const deleAlbum = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "please select an album!" });
    }
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    return res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const checkAdmin = (req: Request, res: Response) => {
  res.status(200).json({ admin: true });
};
