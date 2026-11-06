import { useEffect, useRef } from "react";
import { audioRef, usePlayerStore } from "../../stores/usePlayerStore";
import { useChatStore } from "../../stores/useChatStore";

const AudioPlayer = () => {
  const loadedUrl = useRef<string | null>(null);
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playNext = usePlayerStore((s) => s.playNext);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const updateActivity = useChatStore((s) => s.updateActivity);

  // Load a new song when it changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (loadedUrl.current !== currentSong.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
      loadedUrl.current = currentSong.audioUrl;
    }
  }, [currentSong]);

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.log("Couldn't play audio", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = repeatMode === "one";
  }, [repeatMode]);

  // Tell friends what I'm listening to (null = idle)
  useEffect(() => {
    updateActivity(
      isPlaying && currentSong
        ? { title: currentSong.title, artist: currentSong.artist }
        : null,
    );
  }, [isPlaying, currentSong, updateActivity]);

  return <audio ref={audioRef} onEnded={playNext} />;
};

export default AudioPlayer;
