import { Calendar, Library, Music } from "lucide-react";
import AddAlbumDialog from "./AddAlbumDialog";
import DeleteButton from "./DeleteButton";
import { useAdminStore } from "../../../stores/useAdminStore";

const AlbumsTab = () => {
  const { albums, deleteAlbum } = useAdminStore();

  return (
    <section className="rounded-xl border border-zinc-700/50 bg-zinc-800/50">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Library className="size-5 text-violet-500" /> Albums Library
          </h2>
          <p className="text-sm text-zinc-400">Manage your album collection</p>
        </div>
        <AddAlbumDialog />
      </div>

      <div className="overflow-x-auto px-6 pb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700/50 text-left text-zinc-400">
              <th className="py-3 pr-4 font-medium">Title</th>
              <th className="py-3 pr-4 font-medium">Artist</th>
              <th className="py-3 pr-4 font-medium hidden md:table-cell">
                Release year
              </th>
              <th className="py-3 pr-4 font-medium hidden md:table-cell">
                Songs
              </th>
              <th className="py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => (
              <tr
                key={album._id}
                className="border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={album.imageUrl}
                      alt=""
                      className="size-10 rounded object-cover shrink-0"
                    />
                    <span className="font-medium truncate">{album.title}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-zinc-300">{album.artist}</td>
                <td className="py-3 pr-4 text-zinc-400 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-4" /> {album.releaseYear}
                  </span>
                </td>
                <td className="py-3 pr-4 text-zinc-400 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1">
                    <Music className="size-4" /> {album.songs.length} songs
                  </span>
                </td>
                <td className="py-3 text-right">
                  <DeleteButton
                    label={`album ${album.title}`}
                    confirmText={`Delete the album "${album.title}" and ALL its ${album.songs.length} songs? This can't be undone.`}
                    onDelete={() => deleteAlbum(album._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {albums.length === 0 && (
          <p className="py-8 text-center text-zinc-400">
            No albums yet. Add your first one.
          </p>
        )}
      </div>
    </section>
  );
};

export default AlbumsTab;
