"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeCardSkeleton } from "@/components/recipe/RecipeCardSkeleton";
import type { CuisineType, DietType, Recipe } from "@/types/recipe";

const placeholderRecipes: Recipe[] = [
  {
    _id: "1",
    title: "Truffle Mushroom Risotto",
    shortDescription:
      "Creamy arborio rice with sautéed wild mushrooms and truffle oil.",
    fullDescription:
      "Creamy arborio rice with sautéed wild mushrooms and truffle oil.",
    ingredients: ["Arborio rice", "Wild mushrooms", "Truffle oil", "Parmesan"],
    instructions: ["Toast the rice.", "Add stock gradually.", "Fold in mushrooms and truffle oil."],
    cuisineType: "italian",
    dietType: "vegetarian",
    prepTimeMinutes: 35,
    difficulty: "medium",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXnCBIZMJmcc23SaF4_Pm7syTbVbbuus_Bc0e8BedWwqM7Ys0ZpXYVkZDvXTkMjbyFJGaUX-C6UZ9muVgi5Zfw0ufu-rId8wMQNm9Uq70JY1ENZyhxsTocqQwRNbb9y3ZxFQSl7hPaS9OVaFkqD6efPPNupxG5y3gFbDeeqGyozPr734RVc1PclVJYkq6DhmgZ967_8yzPlKx3KY8tOiJG5MWp6bJXBM4TE_le4MItjM-GzPcqfgS2jwbSI8VzZlyMU7cDFKajpcw",
    images: [],
    ratingAverage: 4.9,
    ratingCount: 214,
    createdBy: "chef-marcus",
    createdAt: "2026-06-18T00:00:00.000Z",
  },
  {
    _id: "2",
    title: "Pan-Seared Salmon",
    shortDescription:
      "Crispy-skin salmon over asparagus and quinoa with a bright citrus finish.",
    fullDescription:
      "Crispy-skin salmon over asparagus and quinoa with a bright citrus finish.",
    ingredients: ["Salmon fillet", "Asparagus", "Quinoa", "Lemon"],
    instructions: ["Sear salmon skin-side down.", "Steam asparagus.", "Plate over quinoa."],
    cuisineType: "american",
    dietType: "keto",
    prepTimeMinutes: 20,
    difficulty: "easy",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCr2UsBdKXJLIBm1zdRgcSHBJs0VCnztWMW89iCn3Nrz9dSj0hFTtaL9eS8eSQ_Q1UDBwTRXyadS3Brt2cpe8ffa5fhA3PRrR-kMHMOwqKBaC0ygLDPJGpd55zIzq_E789OwxpFEKZYcMjE-_dWIp-NWBxrF6vSA498XsML63Mt__V7qpQ_qp_QeRqvwPLS2m_aizaSpTHAgJkivAOpE3mceTnXmdhMijxYw99WkM_XXO6W9apP5iMt5cd0Swfhli0hmhrtuouLekU",
    images: [],
    ratingAverage: 4.8,
    ratingCount: 176,
    createdBy: "home-cook-sarah",
    createdAt: "2026-07-02T00:00:00.000Z",
  },
  {
    _id: "3",
    title: "Margherita Classico",
    shortDescription:
      "Wood-fired crust with San Marzano tomatoes, buffalo mozzarella, and basil.",
    fullDescription:
      "Wood-fired crust with San Marzano tomatoes, buffalo mozzarella, and basil.",
    ingredients: ["Pizza dough", "San Marzano tomatoes", "Buffalo mozzarella", "Basil"],
    instructions: ["Stretch the dough.", "Top with sauce and mozzarella.", "Bake until charred."],
    cuisineType: "italian",
    dietType: "vegetarian",
    prepTimeMinutes: 15,
    difficulty: "easy",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtfg09f10sn4IjtniQyVRd0oLdP-RvhRprwwFBp_A3gSx9_enteQT5Scom4uOJTnYD1lmsFsGw0fCgb9LUhwdk-zMVlmk4ngYG5NIpTM65q6dk62RKOAuFeU2XFkzZIdq35fveKaHJkVLijyX3eXVR3zJWPBPu2FX4QObOd7uJ6BTTfIC18P0Zz5t2l0yiMk5-yGtH9zkh4si2y11LETSs8-uV0V8lMy9e1uFHGhybXd660tlBDTxe6ozzjEgstkO1EtoQR5Iwooo",
    images: [],
    ratingAverage: 4.9,
    ratingCount: 302,
    createdBy: "chef-marcus",
    createdAt: "2026-05-27T00:00:00.000Z",
  },
  {
    _id: "4",
    title: "Harvest Buddha Bowl",
    shortDescription:
      "Roasted sweet potatoes, avocado, chickpeas, and massaged kale.",
    fullDescription:
      "Roasted sweet potatoes, avocado, chickpeas, and massaged kale.",
    ingredients: ["Sweet potato", "Avocado", "Chickpeas", "Kale"],
    instructions: ["Roast sweet potatoes.", "Massage kale with oil.", "Assemble the bowl."],
    cuisineType: "mediterranean",
    dietType: "vegan",
    prepTimeMinutes: 25,
    difficulty: "easy",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjKqzyUwpfbDFzUEpjeuNPrs4T5dBk1em8-4pmCLqXZEH6D2cY6JhvRVS7XYDVmJ_O33gAyaSjYPYRLyzPYQNlaF64UOBZlgYCD_AZNDbmyjPV8PbEycDBW__DnXtIrMTVvaEgegzTY6H38CBwfDq4ydO436mvFwZgOb7gTTHQwQl56hNU4QUBBxTqcXJ950blE8h-x2CWjYam_0ZGJbaWXWKMBDhF5THx_pIMACdWhrqIaj4la87eAF77oAvwRPWgsFw1gVCjMS0",
    images: [],
    ratingAverage: 4.7,
    ratingCount: 98,
    createdBy: "home-cook-sarah",
    createdAt: "2026-07-10T00:00:00.000Z",
  },
];

const cuisineOptions: CuisineType[] = [
  "italian",
  "mexican",
  "indian",
  "chinese",
  "japanese",
  "thai",
  "french",
  "mediterranean",
  "american",
  "other",
];

const dietOptions: DietType[] = [
  "vegan",
  "vegetarian",
  "keto",
  "paleo",
  "gluten-free",
  "dairy-free",
  "none",
];

type SortOption = "rating" | "newest" | "prepTime";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");
}

export default function ExplorePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState<CuisineType | "all">("all");
  const [diet, setDiet] = useState<DietType | "all">("all");
  const [sort, setSort] = useState<SortOption>("rating");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const recipes = useMemo(() => {
    const filtered = placeholderRecipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCuisine = cuisine === "all" || recipe.cuisineType === cuisine;
      const matchesDiet = diet === "all" || recipe.dietType === diet;
      return matchesSearch && matchesCuisine && matchesDiet;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "rating") return b.ratingAverage - a.ratingAverage;
      if (sort === "prepTime") return a.prepTimeMinutes - b.prepTimeMinutes;
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }, [search, cuisine, diet, sort]);

  return (
    <>
      <Navbar />
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
                onChange={(event) =>
                  setCuisine(event.target.value as CuisineType | "all")
                }
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
                onChange={(event) =>
                  setDiet(event.target.value as DietType | "all")
                }
                className="appearance-none bg-cream-alt border border-border rounded-lg pl-4 pr-10 py-2 text-label text-charcoal-muted cursor-pointer hover:bg-border/40 transition-colors"
              >
                <option value="all">Diet Type: All</option>
                {dietOptions.map((option) => (
                  <option key={option} value={option}>
                    {capitalize(option)}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-muted">
                expand_more
              </span>
            </div>
            <button className="flex items-center gap-1 px-4 py-2 bg-secondary-light text-secondary rounded-lg text-label font-semibold hover:opacity-90 transition-opacity">
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
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="appearance-none bg-transparent text-label text-primary font-semibold cursor-pointer hover:underline pr-6"
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

        {isLoading ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <RecipeCardSkeleton key={index} />
            ))}
          </section>
        ) : recipes.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </section>
        ) : (
          <section className="py-16 text-center text-charcoal-muted">
            No recipes found. Try adjusting your search or filters.
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
