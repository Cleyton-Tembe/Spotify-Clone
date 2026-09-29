import type { Request, Response } from "express";
import { Song } from "../model/song.ts";
import { Album } from "../model/album.ts";
import cloudinary from "../config/cloudinary.ts";
import type { UploadedFile } from "express-fileupload";

const uploadToCloudinary = async (file: UploadedFile | UploadedFile[]) => {
  try {
    if (!file) {
      return console.error("no file provided at uploadToCloudinary");
    }

    const uploadedFile = Array.isArray(file) ? file[0] : file;

    if (!uploadedFile) {
      return console.error("no file provided at uploadToCloudinary");
    }

    const result = await cloudinary.uploader.upload(uploadedFile.tempFilePath, {
      resource_type: "auto",
    });

    return result.secure_url;
  } catch (error) {
    console.error("uploadToCloudinary: ", error);
  }
};

export const createSong = async (req: Request, res: Response) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "You must upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;

    if (!title || !artist || !duration) {
      return res.status(400).json({
        message:
          "Well not only the files but the params of the song must be uploaded!",
      });
    }

    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    if (!audioFile && !imageFile) {
      return res
        .status(400)
        .json({ message: "image and audio file must be uploaded" });
    }

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    return res.status(201).json({ song: song });
  } catch (error) {
    console.error("createSong: ", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const deleteSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "no id provided fellow" });
    }

    const song = await Song.findById({ id: id });

    if (song && song.albumId) {
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
    const { imageFile } = req.files ?? {};

    if (!imageFile) {
      return res.status(400).json({ error: "upload a file" });
    }

    const file = Array.isArray(imageFile) ? imageFile[0] : imageFile;

    if (!file) {
      return res.status(400).json({ error: "File not valid" });
    }

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

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
