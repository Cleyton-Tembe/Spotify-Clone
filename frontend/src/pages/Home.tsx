import { useEffect, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import NavBar from "../components/global/NavBar";
import FeaturedSection from "../components/home/FeaturedSection";
import SectionGrid from "../components/home/SectionGrid";
import axiosInstance from "../lib/axiosInstance";
import type { Song } from "../types";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Home = () => {
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [madeForYouSongs, setMadeForYouSongs] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false; // avoids setting state twice in React StrictMode

    const fetchSongs = async () => {
      try {
        const [featured, madeForYou, trending] = await Promise.all([
          axiosInstance.get<Song[]>("/songs/featured"),
          axiosInstance.get<Song[]>("/songs/made-for-you"),
          axiosInstance.get<Song[]>("/songs/trending"),
        ]);
        if (ignore) return;
        setFeaturedSongs(featured.data);
        setMadeForYouSongs(madeForYou.data);
        setTrendingSongs(trending.data);
      } catch (err) {
        console.log("Error fetching songs", err);
        if (!ignore) setError("Couldn't load songs. Is the backend running?");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchSongs();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="h-full flex flex-col rounded-md overflow-hidden bg-linear-to-b from-zinc-800 to-zinc-900">
      <NavBar />
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            {getGreeting()}
          </h1>

          <FeaturedSection
            songs={featuredSongs}
            isLoading={isLoading}
            error={error}
          />

          <div className="space-y-8">
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default Home;
