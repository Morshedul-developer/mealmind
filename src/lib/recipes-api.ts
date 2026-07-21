import { cache } from "react";
import axios from "axios";
import { api } from "@/lib/api";
import { difficultyFromApi } from "@/lib/recipe-format";
import type { CuisineType, DietType, Recipe } from "@/types/recipe";

interface RecipeApiPayload {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  ingredients?: string[];
  instructions?: string[];
  cuisineType: CuisineType;
  dietType: DietType;
  prepTimeMinutes: number;
  servings?: number;
  calories?: number;
  difficulty: "Easy" | "Medium" | "Hard";
  imageUrl?: string;
  images?: string[];
  ratingAverage?: number;
  ratingCount?: number;
  createdBy: string;
  createdAt: string;
}

function mapApiRecipe(raw: RecipeApiPayload): Recipe {
  return {
    _id: raw._id,
    title: raw.title,
    shortDescription: raw.shortDescription,
    fullDescription: raw.fullDescription,
    ingredients: raw.ingredients ?? [],
    instructions: raw.instructions ?? [],
    cuisineType: raw.cuisineType,
    dietType: raw.dietType,
    prepTimeMinutes: raw.prepTimeMinutes,
    servings: raw.servings,
    calories: raw.calories,
    difficulty: difficultyFromApi[raw.difficulty] ?? "easy",
    imageUrl: raw.imageUrl ?? "",
    images: raw.images ?? [],
    ratingAverage: raw.ratingAverage ?? 0,
    ratingCount: raw.ratingCount ?? 0,
    createdBy: raw.createdBy,
    createdAt: raw.createdAt,
  };
}

export interface RecipeDetailResult {
  recipe: Recipe;
  related: Recipe[];
}

export async function fetchMyRecipes(): Promise<Recipe[]> {
  const response = await api.get<{ success: boolean; data?: RecipeApiPayload[] }>(
    "/api/recipes/mine"
  );
  return (response.data.data ?? []).map(mapApiRecipe);
}

export async function deleteRecipe(id: string): Promise<void> {
  await api.delete(`/api/recipes/${id}`);
}

export interface RecipesQuery {
  search?: string;
  cuisineType?: CuisineType;
  dietType?: DietType;
  difficulty?: "Easy" | "Medium" | "Hard";
  prepTimeMin?: number;
  prepTimeMax?: number;
  minRating?: number;
  sort?: "rating" | "newest" | "prepTime";
  page?: number;
  limit?: number;
}

export interface RecipesPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface RecipesListResult {
  items: Recipe[];
  pagination: RecipesPagination;
}

export async function fetchRecipes(query: RecipesQuery): Promise<RecipesListResult> {
  const response = await api.get<{
    success: boolean;
    data?: { items: RecipeApiPayload[]; pagination: RecipesPagination };
  }>("/api/recipes", { params: query });

  const data = response.data.data ?? {
    items: [],
    pagination: { page: 1, limit: query.limit ?? 12, total: 0, pages: 0 },
  };

  return {
    items: data.items.map(mapApiRecipe),
    pagination: data.pagination,
  };
}

export const fetchRecipeDetail = cache(
  async (id: string): Promise<RecipeDetailResult | null> => {
    try {
      const response = await api.get<{
        success: boolean;
        data?: { recipe: RecipeApiPayload; related?: RecipeApiPayload[] };
      }>(`/api/recipes/${id}`);

      if (!response.data.success || !response.data.data) return null;

      const { recipe, related } = response.data.data;
      return {
        recipe: mapApiRecipe(recipe),
        related: (related ?? []).map(mapApiRecipe),
      };
    } catch (error) {
      // A response from the server (404, validation error, etc.) means the
      // recipe genuinely can't be resolved — treat as not-found. A network
      // failure (backend unreachable) is a different problem and should
      // surface as a real error instead of a misleading "not found".
      if (axios.isAxiosError(error) && error.response) return null;

      // Node's fetch/undici throws a bare AggregateError with an empty
      // top-level message when a connection genuinely can't be established
      // (e.g. the backend is down), which Next.js then renders with no
      // useful information at all. Re-wrap with a real message.
      throw new Error(
        "Could not reach the recipe service. Is the backend running?",
        { cause: error }
      );
    }
  }
);
