"use client";

import { useState } from "react";
import Link from "next/link";
import type { Recipe } from "@/types/recipe";
import { getDietLabel } from "@/lib/recipe-labels";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <article className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] transition-transform duration-300 hover:-translate-y-2 flex flex-col overflow-hidden">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-cream-alt">
        {recipe.imageUrl ? (
          // Recipe photos are arbitrary user-supplied URLs and can't go
          // through next/image's remotePatterns allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-charcoal-muted">
            <span className="material-symbols-outlined text-[32px]">image</span>
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="text-title font-semibold leading-tight">{recipe.title}</h3>
          <button
            onClick={() => setIsFavorited((prev) => !prev)}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorited}
            className={`material-symbols-outlined shrink-0 cursor-pointer p-2 -m-2 ${
              isFavorited ? "text-primary" : "text-charcoal-muted"
            }`}
            style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
          >
            favorite
          </button>
        </div>
        <div className="flex gap-2 mb-4">
          <span className="bg-secondary-light text-secondary text-caption px-2 py-0.5 rounded-full font-medium">
            {getDietLabel(recipe.dietType)}
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
          <Link
            href={`/recipes/${recipe._id}`}
            className="text-primary text-label font-semibold flex items-center hover:gap-1 transition-all"
          >
            View
            <span className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
