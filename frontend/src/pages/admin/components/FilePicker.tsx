import { useEffect, useMemo, useRef } from "react";
import { Upload } from "lucide-react";

type FilePickerProps = {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;

  preview?: boolean;
};

const FilePicker = ({
  label,
  accept,
  file,
  onChange,
  disabled,
  preview,
}: FilePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(
    () => (preview && file ? URL.createObjectURL(file) : null),
    [preview, file],
  );

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  return (
    <div>
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex w-full items-center gap-3 rounded-md border border-dashed border-zinc-600 bg-zinc-800/50 p-3 text-left text-sm hover:border-emerald-500 transition-colors disabled:opacity-50"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt=""
            className="size-12 rounded object-cover shrink-0"
          />
        ) : (
          <span className="flex size-12 items-center justify-center rounded bg-zinc-800 shrink-0">
            <Upload className="size-5 text-zinc-400" />
          </span>
        )}
        <span className="min-w-0 truncate text-zinc-300">
          {file ? file.name : "Choose a file"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        aria-label={label}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
};

export default FilePicker;
