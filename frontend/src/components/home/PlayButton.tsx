import { Pause, Play } from "lucide-react";
import { cn } from "../../lib/utils";

type PlayButtonProps = {
  isCurrent: boolean;
  isPlaying: boolean;
  className?: string;
};

const PlayButton = ({ isCurrent, isPlaying, className }: PlayButtonProps) => (
  <span
    aria-hidden
    className={cn(
      "flex size-10 items-center justify-center rounded-full bg-green-500 text-black shadow-lg transition-all hover:scale-105 hover:bg-green-400",
      isCurrent
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
      className,
    )}
  >
    {isCurrent && isPlaying ? (
      <Pause className="size-5" fill="currentColor" />
    ) : (
      <Play className="size-5 ml-0.5" fill="currentColor" />
    )}
  </span>
);

export default PlayButton;
