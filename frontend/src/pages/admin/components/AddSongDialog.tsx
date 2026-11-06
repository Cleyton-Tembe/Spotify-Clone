import { useState, type FormEvent } from "react";
import { Loader, Plus } from "lucide-react";
import Modal from "./Modal";
import FilePicker from "./FilePicker";
import { getErrorMessage, useAdminStore } from "../../../stores/useAdminStore";
import {
  inputClass,
  labelClass,
  primaryButton,
  secondaryButton,
} from "../../../helpers/formStyle";

const readDuration = (file: File) =>
  new Promise<number>((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(audio.duration) ? Math.round(audio.duration) : 0);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
    audio.src = url;
  });

const AddSongDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={primaryButton}
      >
        <Plus className="size-4" /> Add Song
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        locked={isSubmitting}
        title="Add new song"
        description="Upload a song to your music library"
      >
        <SongForm
          onDone={() => setOpen(false)}
          onSubmittingChange={setIsSubmitting}
        />
      </Modal>
    </>
  );
};

type SongFormProps = {
  onDone: () => void;
  onSubmittingChange: (busy: boolean) => void;
};

const SongForm = ({ onDone, onSubmittingChange }: SongFormProps) => {
  const { albums, createSong } = useAdminStore();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [duration, setDuration] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = progress !== null;

  const handleAudio = async (file: File | null) => {
    setAudioFile(file);
    if (file) {
      const seconds = await readDuration(file);
      if (seconds) setDuration(String(seconds));
      if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!audioFile || !imageFile)
      return setError("Please choose an audio file and an image.");

    const data = new FormData();
    data.append("title", title.trim());
    data.append("artist", artist.trim());
    data.append("duration", duration);
    if (albumId) data.append("albumId", albumId);
    data.append("audioFile", audioFile);
    data.append("imageFile", imageFile);

    setError(null);
    setProgress(0);
    onSubmittingChange(true);
    try {
      await createSong(data, setProgress);
      onDone();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't upload the song"));
    } finally {
      setProgress(null);
      onSubmittingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FilePicker
          label="Audio file"
          accept="audio/*"
          file={audioFile}
          onChange={handleAudio}
          disabled={isSubmitting}
        />
        <FilePicker
          label="Artwork"
          accept="image/*"
          file={imageFile}
          onChange={setImageFile}
          disabled={isSubmitting}
          preview
        />
      </div>

      <div>
        <label htmlFor="song-title" className={labelClass}>
          Title
        </label>
        <input
          id="song-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="song-artist" className={labelClass}>
          Artist
        </label>
        <input
          id="song-artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="song-duration" className={labelClass}>
            Duration (seconds)
          </label>
          <input
            id="song-duration"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="song-album" className={labelClass}>
            Album (optional)
          </label>
          <select
            id="song-album"
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            disabled={isSubmitting}
            className={inputClass}
          >
            <option value="">No album (single)</option>
            {albums.map((album) => (
              <option key={album._id} value={album._id}>
                {album.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {isSubmitting && (
        <div className="space-y-1">
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400">
            {progress! < 100
              ? `Uploading… ${progress}%`
              : "Saving to Cloudinary…"}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onDone}
          disabled={isSubmitting}
          className={secondaryButton}
        >
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className={primaryButton}>
          {isSubmitting && <Loader className="size-4 animate-spin" />}
          {isSubmitting ? "Uploading" : "Add Song"}
        </button>
      </div>
    </form>
  );
};

export default AddSongDialog;
