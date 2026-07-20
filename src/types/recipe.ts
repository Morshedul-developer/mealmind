export type CuisineType =
  | "italian"
  | "mexican"
  | "indian"
  | "chinese"
  | "japanese"
  | "thai"
  | "french"
  | "mediterranean"
  | "american"
  | "bengali"
  | "other";

export type DietType =
  | "vegan"
  | "vegetarian"
  | "keto"
  | "paleo"
  | "gluten-free"
  | "dairy-free"
  | "none";

export type Difficulty = "easy" | "medium" | "hard";

export interface Recipe {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  instructions: string[];
  cuisineType: CuisineType;
  dietType: DietType;
  prepTimeMinutes: number;
  servings?: number;
  calories?: number;
  difficulty: Difficulty;
  imageUrl: string;
  images: string[];
  ratingAverage: number;
  ratingCount: number;
  createdBy: string;
  createdAt: string;
}
