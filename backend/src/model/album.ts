import mongoose, { Model } from "mongoose";
import type { IAlbum } from "../interface/Imodel.ts";

const albumSchema = new mongoose.Schema<IAlbum>(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    imageUrl: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true },
); //  createdAt, updatedAt

export const Album: Model<IAlbum> =
  mongoose.models.Album || mongoose.model<IAlbum>("Album", albumSchema);
