"use client";

import { useState } from "react";
import Image from "next/image";
import { isOptimizableImageUrl } from "@/lib/image-hosts";
import { getDietLabel } from "@/lib/recipe-labels";
import { StarRating } from "./StarRating";
import type { Recipe } from "@/types/recipe";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function RecipeHero({ recipe }: { recipe: Recipe }) {
  const images =
    recipe.images.length > 0
      ? recipe.images
      : recipe.imageUrl
        ? [recipe.imageUrl]
        : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <section className="relative w-full">
      <div className="relative w-full h-[60vh] min-h-[420px] md:h-[78vh] md:min-h-[560px] md:max-h-[820px] bg-cream-alt overflow-hidden">
        {activeImage ? (
          isOptimizableImageUrl(activeImage) ? (
            <Image
              src={activeImage}
              alt={recipe.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            // Arbitrary user-supplied URLs (Add Recipe form) can't go
            // through next/image's remotePatterns allowlist.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-charcoal-muted">
            <span className="material-symbols-outlined text-[64px]">image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:pb-12 max-w-7xl mx-auto">
          <div className="flex gap-2 mb-4">
            <span className="bg-white/15 backdrop-blur-sm text-white border border-white/30 px-3 py-1 rounded-full text-caption font-medium">
              {capitalize(recipe.cuisineType)}
            </span>
            <span className="bg-white/15 backdrop-blur-sm text-white border border-white/30 px-3 py-1 rounded-full text-caption font-medium">
              {getDietLabel(recipe.dietType)}
            </span>
          </div>
          <h1 className="font-heading text-display-mobile md:text-display text-white leading-tight max-w-3xl drop-shadow-md mb-4">
            {recipe.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90">
            <div className="flex items-center gap-2">
              <StarRating value={recipe.ratingAverage} />
              <span className="text-label font-semibold">
                {recipe.ratingAverage.toFixed(1)}
              </span>
              <span className="text-caption text-white/70">
                ({recipe.ratingCount} {recipe.ratingCount === 1 ? "review" : "reviews"})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px]">schedule</span>
              <span className="text-label font-medium">{recipe.prepTimeMinutes} mins</span>
            </div>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex gap-3 overflow-x-auto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden transition-all ${
                index === activeIndex
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-cream"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {isOptimizableImageUrl(src) ? (
                <Image
                  src={src}
                  alt={`${recipe.title} — photo ${index + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={`${recipe.title} — photo ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
