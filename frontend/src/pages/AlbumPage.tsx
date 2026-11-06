import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Loader, Pause, Play } from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";
import axiosInstance from "../lib/axiosInstance";
import { usePlayerStore } from "../stores/usePlayerStore";
import type { Album } from "../types";

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

type FetchResult = { id: string; album: Album | null; error: string | null };

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [result, setResult] = useState<FetchResult | null>(null);
  const { currentSong, isPlaying, playFromList, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (!albumId) return;
    let ignore = false;

    axiosInstance
      .get<Album>(`/albums/${albumId}`)
      .then(
        (res) =>
          !ignore && setResult({ id: albumId, album: res.data, error: null }),
      )
      .catch((err) => {
        console.log("Error fetching album", err);
        if (!ignore) {
          const notFound = err?.response?.status === 404;
          setResult({
            id: albumId,
            album: null,
            error: notFound ? "Album not found" : "Couldn't load this album",
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [albumId]);

  const isLoading = result?.id !== albumId;

  if (!result || isLoading) {
    return (
      <div className="h-full flex items-center justify-center rounded-md bg-zinc-900">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const album = result.album;
  if (!album) {
    return (
      <div className="h-full flex items-center justify-center rounded-md bg-zinc-900 text-zinc-400">
        {result.error}
      </div>
    );
  }

  const isAlbumCurrent = album.songs.some((s) => s._id === currentSong?._id);

  const handlePlayAlbum = () => {
    if (isAlbumCurrent) togglePlay();
    else playFromList(album.songs, 0);
  };

  return (
    <main className="h-full rounded-md overflow-hidden">
      <ScrollArea className="h-full">
        <div className="relative min-h-full bg-linear-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 p-6 pb-8">
            <img
              src={album.imageUrl}
              alt={album.title}
              className="size-40 sm:size-60 shadow-xl rounded object-cover shrink-0"
            />
            <div className="flex flex-col justify-end min-w-0">
              <p className="text-sm font-medium">Album</p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold my-4 break-words">
                {album.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-100">
                <span className="font-medium text-white">{album.artist}</span>
                <span>• {album.songs.length} songs</span>
                <span>• {album.releaseYear}</span>
              </div>
            </div>
          </div>

          {/* Play button */}
          <div className="px-6 pb-4">
            <button
              type="button"
              onClick={handlePlayAlbum}
              disabled={album.songs.length === 0}
              aria-label={isAlbumCurrent && isPlaying ? "Pause" : "Play"}
              className="flex size-14 items-center justify-center rounded-full bg-green-500 text-black
                hover:bg-green-400 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isAlbumCurrent && isPlaying ? (
                <Pause className="size-7" fill="currentColor" />
              ) : (
                <Play className="size-7 ml-1" fill="currentColor" />
              )}
            </button>
          </div>

          {/* Song list */}
          <div className="bg-black/20 backdrop-blur-sm pb-6">
            <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
              <div>#</div>
              <div>Title</div>
              <div className="hidden md:block">Released</div>
              <div className="flex justify-end md:justify-start">
                <Clock className="size-4" />
              </div>
            </div>

            <div className="px-6 pt-2 space-y-1">
              {album.songs.length === 0 && (
                <p className="px-4 py-6 text-zinc-400">
                  This album has no songs yet.
                </p>
              )}

              {album.songs.map((song, index) => {
                const isCurrent = currentSong?._id === song._id;
                return (
                  <button
                    type="button"
                    key={song._id}
                    onClick={() => playFromList(album.songs, index)}
                    className="group grid w-full grid-cols-[16px_4fr_2fr_1fr] items-center gap-4 px-4 py-2 text-left
                      text-sm text-zinc-400 rounded-md hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center justify-center">
                      {isCurrent && isPlaying ? (
                        <span className="text-green-500">♫</span>
                      ) : (
                        <>
                          <span className="group-hover:hidden">
                            {index + 1}
                          </span>
                          <Play
                            className="size-4 hidden group-hover:block text-white"
                            fill="currentColor"
                          />
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="size-10 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p
                          className={`font-medium truncate ${isCurrent ? "text-green-500" : "text-white"}`}
                        >
                          {song.title}
                        </p>
                        <p className="truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      {song.createdAt?.split("T")[0]}
                    </div>
                    <div className="text-right md:text-left">
                      {formatDuration(song.duration)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default AlbumPage;
