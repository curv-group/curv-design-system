import { cn } from "../lib/cn";

export interface FaviconProps {
  src: string;
  /** Defaults to empty — the neighbouring label names the brand. */
  alt?: string;
  title?: string;
  className?: string;
}

/**
 * 16px brand / domain mark. Pass the **real** asset (the official favicon or
 * logo). Never draw a stand-in G, play triangle, or infinity — a guessed mark
 * is worse than a muted system glyph. Direct / “others” / a generic website
 * stay a globe, not a fake brand.
 */
export function Favicon({ src, alt = "", title, className }: FaviconProps) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      width={16}
      height={16}
      className={cn("size-4 rounded-[4px] object-contain", className)}
    />
  );
}
