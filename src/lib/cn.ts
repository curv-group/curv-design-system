import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. The one class-name helper
 *  every component uses, so consumers never re-implement it. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
