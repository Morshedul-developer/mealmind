"use client";

import { useState } from "react";

export function IngredientChecklist({ ingredients }: { ingredients: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <ul>
      {ingredients.map((ingredient, index) => {
        const isChecked = checked.has(index);
        return (
          <li key={ingredient} className="border-b border-border/60 last:border-b-0">
            <label className="flex items-start gap-4 py-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(index)}
                className="mt-0.5 w-5 h-5 rounded border-2 border-border text-secondary focus:ring-secondary focus:ring-offset-0 cursor-pointer shrink-0"
              />
              <span
                className={`text-body-lg leading-snug transition-colors ${
                  isChecked ? "line-through text-charcoal-muted/50" : "text-charcoal"
                }`}
              >
                {ingredient}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
