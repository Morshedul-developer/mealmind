"use client";

import { useState } from "react";

export function ClickableStarRating({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div
      className={className ?? "flex gap-1"}
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = displayValue >= star;
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverValue(star)}
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
            className="active:scale-95 transition-transform p-2 -m-2"
          >
            <span
              className={`material-symbols-outlined text-[28px] ${
                filled ? "text-primary" : "text-charcoal-muted/40"
              }`}
              style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
            >
              star
            </span>
          </button>
        );
      })}
    </div>
  );
}
