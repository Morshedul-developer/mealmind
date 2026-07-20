import type { Recipe } from "@/types/recipe";

export const dietLabels: Record<Recipe["dietType"], string> = {
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  keto: "Keto",
  paleo: "Paleo",
  "gluten-free": "Gluten-Free",
  "dairy-free": "Dairy-Free",
  none: "No Restrictions",
};

export const difficultyLabels: Record<Recipe["difficulty"], string> = {
  easy: "Easy",
  medium: "Intermediate",
  hard: "Advanced",
};

// Recipe data isn't guaranteed to arrive in the app's canonical lowercase
// casing (e.g. legacy/seeded documents) — this looks up case-insensitively
// and always returns a display string instead of `undefined`, so a badge
// never renders empty.
export function getDietLabel(dietType: string): string {
  const normalized = dietType.toLowerCase() as Recipe["dietType"];
  return dietLabels[normalized] ?? dietType.charAt(0).toUpperCase() + dietType.slice(1);
}
