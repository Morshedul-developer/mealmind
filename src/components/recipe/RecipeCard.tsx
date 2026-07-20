"use client";

import { useState } from "react";
import Image from "next/image";
import type { Recipe } from "@/types/recipe";

const dietLabels: Record<Recipe["dietType"], string> = {
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  keto: "Keto",
  paleo: "Paleo",
  "gluten-free": "Gluten-Free",
  "dairy-free": "Dairy-Free",
  none: "No Restrictions",
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <article className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] transition-transform duration-300 hover:-translate-y-2 flex flex-col overflow-hidden">
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 flex flex-col grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="text-title font-semibold leading-tight">{recipe.title}</h3>
          <button
            onClick={() => setIsFavorited((prev) => !prev)}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorited}
            className={`material-symbols-outlined shrink-0 cursor-pointer ${
              isFavorited ? "text-primary" : "text-charcoal-muted"
            }`}
            style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          <span className="bg-secondary-light text-secondary text-caption px-2 py-0.5 rounded-full font-medium">
            {dietLabels[recipe.dietType]}
          </span>
          <span className="bg-cream-alt text-charcoal-muted text-caption px-2 py-0.5 rounded-full font-medium">
            {recipe.prepTimeMinutes} min
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1 text-primary">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-label font-semibold">
              {recipe.ratingAverage.toFixed(1)}
            </span>
          </div>
          <button className="text-primary text-label font-semibold flex items-center hover:gap-1 transition-all">
            View
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
