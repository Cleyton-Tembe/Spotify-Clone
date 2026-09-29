import type mongoose from "mongoose";

export interface IUser {
  fullName: string;
  imageUrl: string;
  clerkId: string;
}

export interface ISong {
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  albumId: mongoose.Types.ObjectId;
}

export interface IAlbum {
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Array<string>;
}

export interface IMessage {
  senderId: string;
  receiverId: string;
  content: string;
}
