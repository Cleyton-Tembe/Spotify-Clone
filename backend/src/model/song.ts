import mongoose, { Model } from "mongoose";
import type { ISong } from "../interface/Imodel.ts";

const songSchema = new mongoose.Schema<ISong>(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
  },
  { timestamps: true },
);

export const Song: Model<ISong> =
  mongoose.models.Song || mongoose.model<ISong>("Song", songSchema);
