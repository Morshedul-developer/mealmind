"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import { fetchRecipes, type RecipesQuery } from "@/lib/recipes-api";
import { getApiErrorMessage } from "@/lib/errors";
import { difficultyToApi } from "@/lib/recipe-format";
import { getDietLabel } from "@/lib/recipe-labels";
import type { CuisineType, DietType, Difficulty } from "@/types/recipe";

const cuisineOptions: CuisineType[] = [
  "italian",
  "mexican",
  "indian",
  "chinese",
  "japanese",
  "korean",
  "thai",
  "vietnamese",
  "french",
  "mediterranean",
  "american",
  "bengali",
  "other",
];

const dietOptions: DietType[] = [
  "vegan",
  "vegetarian",
  "non-veg",
  "keto",
  "paleo",
  "gluten-free",
  "dairy-free",
  "none",
];

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];

const PAGE_SIZE = 8;

type PrepTimeRange = "all" | "under30" | "30to60" | "over60";

const prepTimeRangeToMinutes: Record<
  Exclude<PrepTimeRange, "all">,
  { min?: number; max?: number }
> = {
  under30: { max: 30 },
  "30to60": { min: 30, max: 60 },
  over60: { min: 60 },
};

const prepTimeRangeLabels: Record<PrepTimeRange, string> = {
  all: "Any Prep Time",
  under30: "Under 30 min",
  "30to60": "30-60 min",
  over60: "Over 60 min",
};

type SortOption = "rating" | "newest" | "prepTime";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");
}

function isCuisineType(value: string | null): value is CuisineType {
  return value !== null && (cuisineOptions as string[]).includes(value);
}

function ExploreLoadingFallback() {
  return (
    <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: PAGE_SIZE }).map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </section>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ExploreLoadingFallback />}>
        <ExploreContent />
      </Suspense>
      <Footer />
    </>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [cuisine, setCuisine] = useState<CuisineType | "all">(() => {
    const param = searchParams.get("cuisineType");
    return isCuisineType(param) ? param : "all";
  });
  const [diet, setDiet] = useState<DietType | "all">("all");
  const [sort, setSort] = useState<SortOption>("rating");
  const [page, setPage] = useState(1);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [prepTimeRange, setPrepTimeRange] = useState<PrepTimeRange>("all");
  const [minRating, setMinRating] = useState<"all" | "4" | "4.5">("all");

  // Debounce the search box: only commit to debouncedSearch (and thus the
  // query key) 400ms after the user stops typing, so rapid keystrokes don't
  // each trigger their own fetch.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const queryParams: RecipesQuery = useMemo(() => {
    const prepTime = prepTimeRange === "all" ? undefined : prepTimeRangeToMinutes[prepTimeRange];
    return {
      search: debouncedSearch.trim() || undefined,
      cuisineType: cuisine === "all" ? undefined : cuisine,
      dietType: diet === "all" ? undefined : diet,
      difficulty: difficulty === "all" ? undefined : difficultyToApi[difficulty],
      prepTimeMin: prepTime?.min,
      prepTimeMax: prepTime?.max,
      minRating: minRating === "all" ? undefined : Number(minRating),
      sort,
      page,
      limit: PAGE_SIZE,
    };
  }, [debouncedSearch, cuisine, diet, difficulty, prepTimeRange, minRating, sort, page]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recipes", queryParams],
    queryFn: () => fetchRecipes(queryParams),
  });

  const recipes = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-headline mb-1">
            Explore Curations
          </h1>
          <p className="text-charcoal-muted text-body-lg">
            Discover hand-picked recipes tailored for your kitchen.
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search recipes..."
            className="w-full bg-white border border-border rounded-lg pl-12 pr-4 py-3 text-charcoal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={cuisine}
              onChange={(event) => {
                setCuisine(event.target.value as CuisineType | "all");
                setPage(1);
              }}
              className="appearance-none bg-cream-alt border border-border rounded-lg pl-4 pr-10 py-2 text-label text-charcoal-muted cursor-pointer hover:bg-border/40 transition-colors"
            >
              <option value="all">Cuisine: All</option>
              {cuisineOptions.map((option) => (
                <option key={option} value={option}>
                  {capitalize(option)}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-muted">
              expand_more
            </span>
          </div>
          <div className="relative">
            <select
              value={diet}
              onChange={(event) => {
                setDiet(event.target.value as DietType | "all");
                setPage(1);
              }}
              className="appearance-none bg-cream-alt border border-border rounded-lg pl-4 pr-10 py-2 text-label text-charcoal-muted cursor-pointer hover:bg-border/40 transition-colors"
            >
              <option value="all">Diet Type: All</option>
              {dietOptions.map((option) => (
                <option key={option} value={option}>
                  {getDietLabel(option)}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-muted">
              expand_more
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMoreFiltersOpen((prev) => !prev)}
            aria-expanded={isMoreFiltersOpen}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-label font-semibold transition-opacity hover:opacity-90 ${
              isMoreFiltersOpen
                ? "bg-secondary text-white"
                : "bg-secondary-light text-secondary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            More Filters
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-caption text-charcoal-muted font-medium">
            SORT BY
          </span>
          <div className="relative">
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortOption);
                setPage(1);
              }}
              className="appearance-none bg-transparent text-label text-primary font-semibold cursor-pointer hover:underline pr-6 py-2"
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="prepTime">Preparation Time</option>
            </select>
            <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </section>

      {isMoreFiltersOpen && (
        <section className="flex flex-wrap gap-4 mb-8 -mt-4 p-4 bg-cream-alt border border-border rounded-lg">
          <div>
            <label className="block text-caption text-charcoal-muted font-medium mb-1" htmlFor="difficulty">
              Difficulty
            </label>
            <div className="relative">
              <select
                id="difficulty"
                value={difficulty}
                onChange={(event) => {
                  setDifficulty(event.target.value as Difficulty | "all");
                  setPage(1);
                }}
                className="appearance-none bg-white border border-border rounded-lg pl-4 pr-10 py-2 text-label text-charcoal-muted cursor-pointer hover:bg-border/40 transition-colors"
              >
                <option value="all">Any Difficulty</option>
                {difficultyOptions.map((option) => (
                  <option key={option} value={option}>
                    {capitalize(option)}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-muted">
                expand_more
              </span>
            </div>
          </div>

          <div>
            <label className="block text-caption text-charcoal-muted font-medium mb-1" htmlFor="prepTimeRange">
              Prep Time
            </label>
            <div className="relative">
              <select
                id="prepTimeRange"
                value={prepTimeRange}
                onChange={(event) => {
                  setPrepTimeRange(event.target.value as PrepTimeRange);
                  setPage(1);
                }}
                className="appearance-none bg-white border border-border rounded-lg pl-4 pr-10 py-2 text-label text-charcoal-muted cursor-pointer hover:bg-border/40 transition-colors"
              >
                {(Object.keys(prepTimeRangeLabels) as PrepTimeRange[]).map((option) => (
                  <option key={option} value={option}>
                    {prepTimeRangeLabels[option]}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-muted">
                expand_more
              </span>
            </div>
          </div>

          <div>
            <label className="block text-caption text-charcoal-muted font-medium mb-1" htmlFor="minRating">
              Minimum Rating
            </label>
            <div className="relative">
              <select
                id="minRating"
                value={minRating}
                onChange={(event) => {
                  setMinRating(event.target.value as "all" | "4" | "4.5");
                  setPage(1);
                }}
                className="appearance-none bg-white border border-border rounded-lg pl-4 pr-10 py-2 text-label text-charcoal-muted cursor-pointer hover:bg-border/40 transition-colors"
              >
                <option value="all">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-muted">
                expand_more
              </span>
            </div>
          </div>
        </section>
      )}

      {isLoading ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </section>
      ) : isError ? (
        <section className="py-16 text-center text-error">
          {getApiErrorMessage(error, "Could not load recipes.")}
        </section>
      ) : recipes.length > 0 ? (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </section>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={pagination.page <= 1}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-lg text-charcoal-muted hover:bg-cream-alt transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="text-label text-charcoal-muted">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(pagination.pages, prev + 1))
                }
                disabled={pagination.page >= pagination.pages}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-lg text-charcoal-muted hover:bg-cream-alt transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                aria-label="Next page"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <section className="py-16 text-center text-charcoal-muted">
          No recipes found. Try adjusting your search or filters.
        </section>
      )}
    </main>
  );
}
