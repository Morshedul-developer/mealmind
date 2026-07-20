import type { Difficulty } from "@/types/recipe";

// The backend expects/returns capitalized difficulty values on the wire,
// distinct from the lowercase `Difficulty` type used everywhere in the app.
export const difficultyToApi: Record<Difficulty, "Easy" | "Medium" | "Hard"> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const difficultyFromApi: Record<"Easy" | "Medium" | "Hard", Difficulty> = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
};
