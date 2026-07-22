import { api } from "@/lib/api";

export interface Review {
  _id: string;
  recipeId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export async function fetchMyReviewForRecipe(recipeId: string): Promise<Review | null> {
  const response = await api.get<{ success: boolean; data?: Review | null }>(
    `/api/reviews/mine-for/${recipeId}`
  );
  return response.data.data ?? null;
}

export async function submitReview(input: {
  recipeId: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const response = await api.post<{ success: boolean; data: Review }>("/api/reviews", input);
  return response.data.data;
}
