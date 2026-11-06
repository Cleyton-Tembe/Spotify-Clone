import { Calendar, Music } from "lucide-react";
import AddSongDialog from "./AddSongDialog";
import DeleteButton from "./DeleteButton";
import { useAdminStore } from "../../../stores/useAdminStore";

const SongsTab = () => {
  const { songs, albums, deleteSong } = useAdminStore();
  const albumTitle = (id: string | null) =>
    albums.find((a) => a._id === id)?.title ?? "Single";

  return (
    <section className="rounded-xl border border-zinc-700/50 bg-zinc-800/50">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Music className="size-5 text-emerald-500" /> Songs Library
          </h2>
          <p className="text-sm text-zinc-400">Manage your music tracks</p>
        </div>
        <AddSongDialog />
      </div>

      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700/50 text-left text-zinc-400">
              <th className="py-3 pr-4 font-medium">Title</th>
              <th className="py-3 pr-4 font-medium">Artist</th>
              <th className="py-3 pr-4 font-medium hidden md:table-cell">
                Album
              </th>
              <th className="py-3 pr-4 font-medium hidden md:table-cell">
                Added
              </th>
              <th className="py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr
                key={song._id}
                className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={song.imageUrl}
                      alt=""
                      className="size-10 rounded object-cover shrink-0"
                    />
                    <span className="font-medium truncate">{song.title}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-zinc-300">{song.artist}</td>
                <td className="py-3 pr-4 text-zinc-400 hidden md:table-cell">
                  {albumTitle(song.albumId)}
                </td>
                <td className="py-3 pr-4 text-zinc-400 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-4" />{" "}
                    {song.createdAt?.split("T")[0]}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <DeleteButton
                    label={`song ${song.title}`}
                    confirmText={`Delete the song "${song.title}"? This can't be undone.`}
                    onDelete={() => deleteSong(song._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {songs.length === 0 && (
          <p className="py-8 text-center text-zinc-400">
            No songs yet. Add your first one.
          </p>
        )}
      </div>
    </section>
  );
};

export default SongsTab;
