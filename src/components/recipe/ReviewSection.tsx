"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { fetchMyReviewForRecipe, submitReview } from "@/lib/reviews-api";
import { getApiErrorMessage } from "@/lib/errors";
import { StarRating } from "@/components/recipe/StarRating";
import { ClickableStarRating } from "@/components/recipe/ClickableStarRating";

const MIN_COMMENT_LENGTH = 10;

export function ReviewSection({ recipeId }: { recipeId: string }) {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const myReviewQuery = useQuery({
    queryKey: ["myReview", recipeId],
    queryFn: () => fetchMyReviewForRecipe(recipeId),
    enabled: !!session,
  });

  const mutation = useMutation({
    mutationFn: () => submitReview({ recipeId, rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myReview", recipeId] });
      router.refresh();
    },
  });

  if (!session || sessionPending || myReviewQuery.isPending) {
    return null;
  }

  const existingReview = myReviewQuery.data;

  if (existingReview) {
    return (
      <div className="mt-8 pt-8 border-t border-border max-w-xl">
        <h3 className="text-title font-semibold mb-3">
          You&apos;ve already reviewed this recipe
        </h3>
        <div className="bg-white border border-border rounded-lg p-4">
          <StarRating value={existingReview.rating} className="flex text-primary mb-2" />
          <p className="text-charcoal-muted whitespace-pre-line">
            {existingReview.comment}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    setRatingError(null);
    setCommentError(null);

    let hasError = false;
    if (rating < 1 || rating > 5) {
      setRatingError("Please select a star rating.");
      hasError = true;
    }
    if (comment.trim().length < MIN_COMMENT_LENGTH) {
      setCommentError(`Please write at least ${MIN_COMMENT_LENGTH} characters.`);
      hasError = true;
    }
    if (hasError) return;

    mutation.mutate();
  };

  return (
    <div className="mt-8 pt-8 border-t border-border max-w-xl">
      <h3 className="text-title font-semibold mb-4">Write a Review</h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-label text-charcoal-muted">Your Rating</label>
          <ClickableStarRating value={rating} onChange={setRating} />
          {ratingError && (
            <p className="flex items-center gap-2 mt-1 text-error text-caption">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {ratingError}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-label text-charcoal-muted" htmlFor="review-comment">
            Your Review
          </label>
          <textarea
            id="review-comment"
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience making this recipe..."
            className={`w-full bg-cream border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none ${
              commentError ? "border-error" : "border-border"
            }`}
          />
          {commentError && (
            <p className="flex items-center gap-2 mt-1 text-error text-caption">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {commentError}
            </p>
          )}
        </div>

        {mutation.isError && (
          <p className="flex items-center gap-2 text-error text-caption">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {getApiErrorMessage(mutation.error, "Could not submit your review.")}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="bg-primary text-white rounded-full px-8 py-3 text-label font-semibold hover:bg-primary-hover transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {mutation.isPending ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
