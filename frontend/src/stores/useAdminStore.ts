import axios from "axios";
import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";
import type { Album, Song, Stats } from "../types";

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    return data?.message ?? data?.error ?? fallback;
  }
  return fallback;
};

type OnProgress = (percent: number) => void;

const uploadConfig = (onProgress?: OnProgress) => ({
  timeout: 0,
  onUploadProgress: (e: { loaded: number; total?: number }) => {
    if (onProgress && e.total)
      onProgress(Math.round((e.loaded * 100) / e.total));
  },
});

interface AdminStore {
  stats: Stats | null;
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  createSong: (data: FormData, onProgress?: OnProgress) => Promise<void>;
  createAlbum: (data: FormData, onProgress?: OnProgress) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  stats: null,
  songs: [],
  albums: [],
  isLoading: true,
  error: null,

  fetchAll: async () => {
    try {
      const [stats, songs, albums] = await Promise.all([
        axiosInstance.get<Stats>("/stats"),
        axiosInstance.get<Song[]>("/songs"),
        axiosInstance.get<Album[]>("/albums"),
      ]);
      set({
        stats: stats.data,
        songs: songs.data,
        albums: albums.data,
        error: null,
      });
    } catch (error) {
      set({ error: getErrorMessage(error, "Couldn't load the dashboard") });
    } finally {
      set({ isLoading: false });
    }
  },

  createSong: async (data, onProgress) => {
    await axiosInstance.post("/admin/songs", data, uploadConfig(onProgress));
    await get().fetchAll();
  },

  createAlbum: async (data, onProgress) => {
    await axiosInstance.post("/admin/albums", data, uploadConfig(onProgress));
    await get().fetchAll();
  },

  deleteSong: async (id) => {
    await axiosInstance.delete(`/admin/songs/${id}`);
    await get().fetchAll();
  },

  deleteAlbum: async (id) => {
    await axiosInstance.delete(`/admin/albums/${id}`);
    await get().fetchAll();
  },
}));
