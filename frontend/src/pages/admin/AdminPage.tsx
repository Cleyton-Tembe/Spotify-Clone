import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/react";
import { Album, Loader, Music, ShieldAlert } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import StatsCards from "./components/StatsCard";
import SongsTab from "./components/SongsTab";
import AlbumsTab from "./components/AlbumsTab";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAdminStore } from "../../stores/useAdminStore";

type Tab = "songs" | "albums";

const tabs: { id: Tab; label: string; icon: typeof Music }[] = [
  { id: "songs", label: "Songs", icon: Music },
  { id: "albums", label: "Albums", icon: Album },
];

const AdminPage = () => {
  const { isSignedIn } = useAuth();
  const adminStatus = useAuthStore((s) => s.adminStatus);
  const { stats, isLoading, error, fetchAll } = useAdminStore();
  const [tab, setTab] = useState<Tab>("songs");

  useEffect(() => {
    if (adminStatus === "admin") fetchAll();
  }, [adminStatus, fetchAll]);

  if (isSignedIn && (adminStatus === "unknown" || adminStatus === "checking")) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (adminStatus !== "admin") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-black text-center p-6">
        <ShieldAlert className="size-12 text-red-400" />
        <h1 className="text-2xl font-bold">Admins only</h1>
        <p className="text-zinc-400">
          You don't have permission to see this page.
        </p>
        <Link to="/" className="text-emerald-400 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen bg-linear-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="rounded-lg" aria-label="Back to the app">
              <img src="/spotify.png" alt="" className="size-10" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Music Manager</h1>
              <p className="text-sm text-zinc-400">Manage your music catalog</p>
            </div>
          </div>
          <UserButton />
        </header>

        {error && (
          <p className="mb-6 rounded-md bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <StatsCards stats={stats} />

        {/* Tabs */}
        <div
          role="tablist"
          className="inline-flex gap-1 rounded-lg bg-zinc-800/50 p-1 mb-6"
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader className="size-8 text-emerald-500 animate-spin" />
          </div>
        ) : tab === "songs" ? (
          <SongsTab />
        ) : (
          <AlbumsTab />
        )}
      </div>
    </ScrollArea>
  );
};

export default AdminPage;
