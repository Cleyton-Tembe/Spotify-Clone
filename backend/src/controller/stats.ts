import type { Request, Response } from "express";
import { Song } from "../model/song.ts";
import { Album } from "../model/album.ts";
import { User } from "../model/user.ts";

export const getStats = async (req: Request, res: Response) => {
  try {
    const [totalSongs, totalAlbums, totalUsers, uniqueArtists] =
      await Promise.all([
        Song.countDocuments(),
        Album.countDocuments(),
        User.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    return res.status(200).json({
      totalAlbums,
      totalSongs,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    console.log("Error in getMessages", error);
    return res.status(500).json({ message: "something went wrong" });
  }
};
