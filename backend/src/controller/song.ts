import type { Request, Response } from "express";
import { Song } from "../model/song.ts";

export const getAllSongs = async (req: Request, res: Response) => {
  try {
    // -1 = Descending => newest -> oldest
    // 1 = Ascending => oldest -> newest
    const songs = await Song.find().sort({ createdAt: -1 });
    return res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getAllsongs", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getFeaturedSongs = async (req: Request, res: Response) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    return res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getFeaturedSongs", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getMadeForYouSongs = async (req: Request, res: Response) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    return res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getMadeForYouSongs", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getTrendingSongs = async (req: Request, res: Response) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    return res.status(200).json(songs);
  } catch (error) {
    console.log("Error in getTrendingSongs", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};
