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

const AddAlbumDialog = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={primaryButton}
      >
        <Plus className="size-4" /> Add Album
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        locked={isSubmitting}
        title="Add new album"
        description="Add a new album to your collection"
      >
        <AlbumForm
          onDone={() => setOpen(false)}
          onSubmittingChange={setIsSubmitting}
        />
      </Modal>
    </>
  );
};

type AlbumFormProps = {
  onDone: () => void;
  onSubmittingChange: (busy: boolean) => void;
};

const AlbumForm = ({ onDone, onSubmittingChange }: AlbumFormProps) => {
  const createAlbum = useAdminStore((s) => s.createAlbum);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [releaseYear, setReleaseYear] = useState(
    String(new Date().getFullYear()),
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile) return setError("Please choose a cover image.");

    const data = new FormData();
    data.append("title", title.trim());
    data.append("artist", artist.trim());
    data.append("releaseYear", releaseYear);
    data.append("imageFile", imageFile);

    setError(null);
    setIsSubmitting(true);
    onSubmittingChange(true);
    try {
      await createAlbum(data);
      onDone();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't create the album"));
    } finally {
      setIsSubmitting(false);
      onSubmittingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FilePicker
        label="Cover image"
        accept="image/*"
        file={imageFile}
        onChange={setImageFile}
        disabled={isSubmitting}
        preview
      />

      <div>
        <label htmlFor="album-title" className={labelClass}>
          Title
        </label>
        <input
          id="album-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="album-artist" className={labelClass}>
          Artist
        </label>
        <input
          id="album-artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="album-year" className={labelClass}>
          Release year
        </label>
        <input
          id="album-year"
          type="number"
          min={1900}
          max={new Date().getFullYear() + 1}
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          required
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

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
          {isSubmitting ? "Creating" : "Add Album"}
        </button>
      </div>
    </form>
  );
};

export default AddAlbumDialog;
