import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import type { Stats } from "../../../types";

const cards = [
  {
    key: "totalSongs",
    label: "Total Songs",
    icon: ListMusic,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    key: "totalAlbums",
    label: "Total Albums",
    icon: Library,
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    key: "totalArtists",
    label: "Total Artists",
    icon: Users2,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    key: "totalUsers",
    label: "Total Users",
    icon: PlayCircle,
    color: "bg-sky-500/10 text-sky-500",
  },
] as const;

const StatsCards = ({ stats }: { stats: Stats | null }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {cards.map(({ key, label, icon: Icon, color }) => (
      <div
        key={key}
        className="flex items-center gap-4 rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6 hover:bg-zinc-800/80 transition-colors"
      >
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className="text-2xl font-bold">
            {stats ? stats[key].toLocaleString() : "–"}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default StatsCards;
