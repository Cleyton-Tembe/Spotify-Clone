import { useState } from "react";
import { Loader, Trash2 } from "lucide-react";
import { getErrorMessage } from "../../../stores/useAdminStore";

type DeleteButtonProps = {
  label: string;
  confirmText: string;
  onDelete: () => Promise<void>;
};

const DeleteButton = ({ label, confirmText, onDelete }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = async () => {
    if (!window.confirm(confirmText)) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      window.alert(getErrorMessage(error, "Couldn't delete it"));
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDeleting}
      aria-label={`Delete ${label}`}
      className="rounded-md p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors disabled:opacity-50"
    >
      {isDeleting ? (
        <Loader className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
    </button>
  );
};

export default DeleteButton;
