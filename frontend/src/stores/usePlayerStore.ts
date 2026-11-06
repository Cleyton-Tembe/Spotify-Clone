import { createRef } from "react";
import { create } from "zustand";
import type { Song } from "../types";

export const audioRef = createRef<HTMLAudioElement>();

export type RepeatMode = "off" | "all" | "one";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  order: number[];
  position: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;

  playFromList: (songs: Song[], index: number) => void;
  togglePlay: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const shuffledOrder = (length: number, first: number) => {
  const rest = range(length).filter((i) => i !== first);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
};

const restartCurrent = () => {
  const audio = audioRef.current;
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

export const usePlayerStore = create<PlayerStore>((set, get) => {
  const goTo = (position: number) => {
    const { queue, order, currentSong } = get();
    const song = queue[order[position]];
    if (!song) return;

    if (song._id === currentSong?._id) restartCurrent();

    set({ position, currentSong: song, isPlaying: true });
  };

  return {
    currentSong: null,
    isPlaying: false,
    queue: [],
    order: [],
    position: -1,
    isShuffle: false,
    repeatMode: "off",

    playFromList: (songs, index) => {
      const song = songs[index];
      if (!song) return;

      if (get().currentSong?._id === song._id) {
        set({ isPlaying: !get().isPlaying });
        return;
      }

      const { isShuffle } = get();
      set({
        queue: songs,
        order: isShuffle
          ? shuffledOrder(songs.length, index)
          : range(songs.length),
        position: isShuffle ? 0 : index,
        currentSong: song,
        isPlaying: true,
      });
    },

    togglePlay: () => {
      if (!get().currentSong) return;
      set({ isPlaying: !get().isPlaying });
    },

    setIsPlaying: (isPlaying) => set({ isPlaying }),

    playNext: () => {
      const { order, position, repeatMode } = get();
      if (order.length === 0) return;

      if (position + 1 < order.length) {
        goTo(position + 1);
      } else if (repeatMode !== "off") {
        goTo(0);
      } else {
        set({ isPlaying: false }); // end of the list
      }
    },

    playPrevious: () => {
      const { order, position, repeatMode } = get();
      const audio = audioRef.current;

      if (audio && audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }

      if (position - 1 >= 0) {
        goTo(position - 1);
      } else if (repeatMode !== "off" && order.length > 0) {
        goTo(order.length - 1);
      } else if (audio) {
        audio.currentTime = 0;
      }
    },

    toggleShuffle: () => {
      const { isShuffle, queue, order, position } = get();
      const currentIndex = order[position];

      if (queue.length === 0 || currentIndex === undefined) {
        set({ isShuffle: !isShuffle });
        return;
      }

      if (isShuffle) {
        // Back to the original order, continuing from the current song
        set({
          isShuffle: false,
          order: range(queue.length),
          position: currentIndex,
        });
      } else {
        // Shuffle everything else; the current song keeps playing
        set({
          isShuffle: true,
          order: shuffledOrder(queue.length, currentIndex),
          position: 0,
        });
      }
    },

    cycleRepeat: () => {
      const next: Record<RepeatMode, RepeatMode> = {
        off: "all",
        all: "one",
        one: "off",
      };
      set({ repeatMode: next[get().repeatMode] });
    },
  };
});
