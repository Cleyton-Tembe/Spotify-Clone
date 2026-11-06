import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { House, Library, MessageCircle } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import axiosInstance from "../../lib/axiosInstance";
import type { Album } from "../../types";

const navLink =
  "flex items-center gap-3 w-full rounded-md px-3 py-2 font-medium text-white hover:bg-zinc-800 transition-colors";

const LeftSidebar = () => {
  const { isSignedIn } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    axiosInstance
      .get<Album[]>("/albums")
      .then((res) => !ignore && setAlbums(res.data))
      .catch((err) => console.log("Error fetching albums", err))
      .finally(() => !ignore && setIsLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Navigation */}
      <div className="rounded-lg bg-zinc-900 p-4 shrink-0">
        <nav className="space-y-2">
          <Link to="/" className={navLink}>
            <House className="size-5 shrink-0" />
            <span className="hidden md:inline">Home</span>
          </Link>
          {isSignedIn && (
            <Link to="/chat" className={navLink}>
              <MessageCircle className="size-5 shrink-0" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          )}
        </nav>
      </div>

      <div className="flex-1 min-h-0 flex flex-col rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center gap-2 text-white px-2 mb-4 shrink-0">
          <Library className="size-5 shrink-0" />
          <span className="hidden md:inline">Playlists</span>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-2 pr-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 animate-pulse"
                  >
                    <div className="size-12 rounded-md bg-zinc-800 shrink-0" />
                    <div className="flex-1 space-y-2 hidden md:block">
                      <div className="h-4 bg-zinc-800 rounded w-3/4" />
                      <div className="h-3 bg-zinc-800 rounded w-1/2" />
                    </div>
                  </div>
                ))
              : albums.map((album) => (
                  <Link
                    key={album._id}
                    to={`/albums/${album._id}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 transition-colors"
                  >
                    <img
                      src={album.imageUrl}
                      alt={album.title}
                      className="size-12 rounded-md object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">{album.title}</p>
                      <p className="text-sm text-zinc-400 truncate">
                        Album • {album.artist}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;
