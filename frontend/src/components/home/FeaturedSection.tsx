import type { Song } from "../../types";
import FeaturedGridSkeleton from "../skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import { usePlayerStore } from "../../stores/usePlayerStore";

type FeaturedSectionProps = {
  songs: Song[];
  isLoading: boolean;
  error: string | null;
};

const FeaturedSection = ({ songs, isLoading, error }: FeaturedSectionProps) => {
  const { currentSong, isPlaying, playFromList } = usePlayerStore();

  if (isLoading) return <FeaturedGridSkeleton />;

  if (error) return <p className="text-red-500 mb-4 text-lg">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {songs.map((song, index) => {
        const isCurrent = currentSong?._id === song._id;
        return (
          <button
            type="button"
            key={song._id}
            onClick={() => playFromList(songs, index)}
            className="flex items-center text-left bg-zinc-800/50 rounded-md overflow-hidden
              hover:bg-zinc-700/50 transition-colors group cursor-pointer"
          >
            <img
              src={song.imageUrl}
              alt={song.title}
              className="w-16 sm:w-20 h-16 sm:h-20 object-cover shrink-0"
            />
            <div className="flex-1 min-w-0 p-4">
              <p
                className={`font-medium truncate ${isCurrent ? "text-green-500" : ""}`}
              >
                {song.title}
              </p>
              <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
            </div>
            <PlayButton
              isCurrent={isCurrent}
              isPlaying={isPlaying}
              className="mr-4 shrink-0"
            />
          </button>
        );
      })}
    </div>
  );
};

export default FeaturedSection;
