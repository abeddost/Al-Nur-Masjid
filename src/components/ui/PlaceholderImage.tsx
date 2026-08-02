import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceholderImageProps = {
  label: string;
  className?: string;
  aspect?: "square" | "video" | "portrait" | "wide";
};

const aspectClass = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

/**
 * Renders an obviously-labeled empty slot instead of inventing a photo. Used
 * wherever a Payload Media relation is missing or flagged `isPlaceholder`.
 */
export function PlaceholderImage({ label, className, aspect = "video" }: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mosque-green/25 bg-sage/60 p-6 text-center text-mosque-green-dark/70",
        aspectClass[aspect],
        className,
      )}
    >
      <ImageIcon className="h-8 w-8 opacity-60" aria-hidden="true" />
      <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}
