import * as React from "react";
import { cn } from "../lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The canonical raised surface: 12px radius, card background, elevation via the
 * shared `--shadow-card` (a hairline-as-shadow, not a border). This is the one
 * Card every Curv OS app uses — see docs/design-system.md → Cards & surfaces.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-card text-card-foreground shadow-card",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";
