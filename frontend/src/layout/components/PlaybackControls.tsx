import { useEffect, useState } from "react";
import {
  LaptopMinimal,
  ListMusic,
  MicVocal,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { audioRef, usePlayerStore } from "../../stores/usePlayerStore";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const iconButton =
  "flex items-center justify-center size-8 rounded-full text-zinc-400 hover:text-white transition-colors disabled:opacity-40 disabled:hover:text-zinc-400";

const toggleButton = (active: boolean) =>
  "relative flex items-center justify-center size-8 rounded-full transition-colors " +
  (active
    ? "text-green-500 hover:text-green-400 after:absolute after:-bottom-0.5 after:size-1 after:rounded-full after:bg-green-500"
    : "text-zinc-400 hover:text-white");

const PlaybackControls = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    isShuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeat,
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const handleSeek = (value: number) => {
    if (audioRef.current) audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const hasSong = !!currentSong;

  return (
    <footer className="h-20 sm:h-24 shrink-0 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="h-full max-w-[1800px] mx-auto grid grid-cols-[1fr_auto] sm:grid-cols-3 items-center gap-4">
        {/* Current song */}
        <div className="hidden sm:flex items-center gap-4 min-w-0">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="size-14 object-cover rounded-md shrink-0"
              />
              <div className="min-w-0">
                <p className="font-medium truncate">{currentSong.title}</p>
                <p className="text-sm text-zinc-400 truncate">
                  {currentSong.artist}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Controls + progress */}
        <div className="flex flex-col items-center gap-2 w-full max-w-[45vw] sm:max-w-none justify-self-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              className={`${toggleButton(isShuffle)} hidden sm:flex`}
              onClick={toggleShuffle}
              aria-label="Shuffle"
              aria-pressed={isShuffle}
              title={isShuffle ? "Disable shuffle" : "Enable shuffle"}
            >
              <Shuffle className="size-4" />
            </button>
            <button
              className={iconButton}
              onClick={playPrevious}
              disabled={!hasSong}
              aria-label="Previous"
            >
              <SkipBack className="size-4" />
            </button>
            <button
              onClick={togglePlay}
              disabled={!hasSong}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex items-center justify-center size-8 rounded-full bg-white text-black hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
            >
              {isPlaying ? (
                <Pause className="size-5" fill="currentColor" />
              ) : (
                <Play className="size-5" fill="currentColor" />
              )}
            </button>
            <button
              className={iconButton}
              onClick={playNext}
              disabled={!hasSong}
              aria-label="Next"
            >
              <SkipForward className="size-4" />
            </button>
            <button
              className={`${toggleButton(repeatMode !== "off")} hidden sm:flex`}
              onClick={cycleRepeat}
              aria-label="Repeat"
              aria-pressed={repeatMode !== "off"}
              title={
                repeatMode === "off"
                  ? "Enable repeat"
                  : repeatMode === "all"
                    ? "Enable repeat one"
                    : "Disable repeat"
              }
            >
              {repeatMode === "one" ? (
                <Repeat1 className="size-4" />
              ) : (
                <Repeat className="size-4" />
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full">
            <span className="text-xs text-zinc-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              disabled={!hasSong}
              aria-label="Seek"
              className="flex-1 h-1 accent-green-500 cursor-pointer disabled:cursor-default"
            />
            <span className="text-xs text-zinc-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume + extras */}
        <div className="hidden sm:flex items-center gap-4 justify-end">
          <MicVocal className="size-4 text-zinc-400" />
          <ListMusic className="size-4 text-zinc-400" />
          <LaptopMinimal className="size-4 text-zinc-400" />
          <div className="flex items-center gap-2">
            <button
              className={iconButton}
              onClick={() => setVolume((v) => (v === 0 ? 75 : 0))}
              aria-label="Mute"
            >
              <VolumeIcon className="size-4" />
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-24 h-1 accent-green-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlaybackControls;
