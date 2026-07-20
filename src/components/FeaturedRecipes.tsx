"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "@/lib/recipes-api";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";

export function FeaturedRecipes() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recipes", { sort: "rating", limit: 6 }],
    queryFn: () => fetchRecipes({ sort: "rating", limit: 6 }),
  });

  const recipes = data?.items ?? [];

  const scroll = (direction: 1 | -1) => {
    carouselRef.current?.scrollBy({ left: direction * 424, behavior: "smooth" });
  };

  if (!isLoading && !isError && recipes.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-cream-alt overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
        <h2 className="font-heading text-headline">Featured Recipes</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous recipe"
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Next recipe"
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div
        ref={carouselRef}
        className="recipe-carousel flex gap-6 overflow-x-auto px-[calc((100vw-1280px)/2+24px)] snap-x snap-mandatory"
      >
        {isError ? (
          <p className="text-charcoal-muted">Could not load featured recipes.</p>
        ) : isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-85 md:w-100 snap-start shrink-0">
              <RecipeCardSkeleton />
            </div>
          ))
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="w-85 md:w-100 snap-start shrink-0"
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
