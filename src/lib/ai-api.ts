import { api } from "@/lib/api";
import { difficultyFromApi } from "@/lib/recipe-format";
import type { CuisineType, DietType, Difficulty } from "@/types/recipe";

export interface GeneratedRecipe {
  title: string;
  shortDescription: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  difficulty: Difficulty;
}

export interface GenerateRecipeInput {
  ingredients: string[];
  cuisineType: CuisineType;
  dietType: DietType;
  length: "quick" | "detailed";
}

interface GeneratedRecipeApiPayload {
  title: string;
  shortDescription: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

export async function generateRecipe(
  input: GenerateRecipeInput
): Promise<GeneratedRecipe> {
  const response = await api.post<{
    success: boolean;
    data?: GeneratedRecipeApiPayload;
    error?: string;
  }>("/api/ai/generate-recipe", input);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error ?? "Could not generate a recipe.");
  }

  const raw = response.data.data;
  return {
    title: raw.title,
    shortDescription: raw.shortDescription,
    ingredients: raw.ingredients,
    instructions: raw.instructions,
    prepTimeMinutes: raw.prepTimeMinutes,
    difficulty: difficultyFromApi[raw.difficulty] ?? "easy",
  };
}
