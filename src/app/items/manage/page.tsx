"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { fetchMyRecipes, deleteRecipe } from "@/lib/recipes-api";
import { getApiErrorMessage } from "@/lib/errors";
import { formatRelativeTime } from "@/lib/format";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Recipe } from "@/types/recipe";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function ManageRecipesPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    fetchMyRecipes()
      .then((data) => {
        if (!cancelled) setRecipes(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(getApiErrorMessage(error, "Could not load your recipes."));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    const query = search.trim().toLowerCase();
    if (!query) return recipes;
    return recipes.filter((recipe) => recipe.title.toLowerCase().includes(query));
  }, [recipes, search]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteRecipe(deleteTarget._id);
      setRecipes((prev) => (prev ? prev.filter((r) => r._id !== deleteTarget._id) : prev));
      setDeleteTarget(null);
    } catch (error) {
      setDeleteError(getApiErrorMessage(error, "Could not delete this recipe."));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPending || !session) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
          <p className="text-charcoal-muted">Checking your session...</p>
        </main>
        <Footer />
      </>
    );
  }

  const isLoading = recipes === null && !loadError;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen w-full min-w-0">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-display-mobile md:text-display tracking-tight">
              Manage Recipes
            </h1>
            <p className="text-body-lg text-charcoal-muted mt-1">
              Logged in as{" "}
              <span className="font-bold text-secondary">{session.user.name}</span>
            </p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your kitchen..."
              className="pl-10 pr-4 py-2 bg-cream-alt border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-full md:w-64 transition-all"
            />
          </div>
        </div>

        {isLoading && (
          <p className="text-charcoal-muted text-center py-16">
            Loading your recipes...
          </p>
        )}

        {loadError && <p className="text-error text-center py-16">{loadError}</p>}

        {!isLoading && !loadError && recipes && recipes.length === 0 && <EmptyState />}

        {!isLoading && !loadError && recipes && recipes.length > 0 && (
          <>
            <div className="hidden md:block bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] overflow-hidden border border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-cream-alt border-b border-border">
                      <th className="px-6 py-4 text-label text-charcoal-muted uppercase tracking-wider">
                        Recipe
                      </th>
                      <th className="px-6 py-4 text-label text-charcoal-muted uppercase tracking-wider">
                        Cuisine
                      </th>
                      <th className="px-6 py-4 text-label text-charcoal-muted uppercase tracking-wider">
                        Prep Time
                      </th>
                      <th className="px-6 py-4 text-label text-charcoal-muted uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-label text-charcoal-muted uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredRecipes.map((recipe) => (
                      <tr key={recipe._id} className="hover:bg-cream-alt transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-cream-alt shadow-sm">
                              {recipe.imageUrl ? (
                                // Recipe photos are arbitrary user-supplied URLs and
                                // can't go through next/image's remotePatterns allowlist.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={recipe.imageUrl}
                                  alt={recipe.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-charcoal-muted">
                                  <span className="material-symbols-outlined">image</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-title font-semibold">{recipe.title}</div>
                              <div className="text-caption text-charcoal-muted">
                                Added {formatRelativeTime(recipe.createdAt)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-secondary-light text-secondary px-3 py-1 rounded-full text-label font-medium">
                            {capitalize(recipe.cuisineType)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-charcoal-muted">
                          {recipe.prepTimeMinutes} mins
                        </td>
                        <td className="px-6 py-4">
                          <RatingCell recipe={recipe} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/recipes/${recipe._id}`}
                              className="p-2 text-charcoal-muted hover:text-primary hover:bg-cream-alt rounded-lg transition-colors"
                              aria-label={`View ${recipe.title}`}
                            >
                              <span className="material-symbols-outlined">
                                visibility
                              </span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteTarget(recipe);
                                setDeleteError(null);
                              }}
                              className="p-2 text-charcoal-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                              aria-label={`Delete ${recipe.title}`}
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-cream-alt border-t border-border">
                <span className="text-caption text-charcoal-muted">
                  Showing {filteredRecipes.length} of {recipes.length} recipe
                  {recipes.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div className="md:hidden space-y-4">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] p-4 border border-border/60"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-cream-alt">
                      {recipe.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-charcoal-muted">
                          <span className="material-symbols-outlined">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-title font-semibold truncate">
                        {recipe.title}
                      </div>
                      <div className="text-caption text-charcoal-muted mb-2">
                        Added {formatRelativeTime(recipe.createdAt)}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-secondary-light text-secondary px-2 py-0.5 rounded-full text-caption font-medium">
                          {capitalize(recipe.cuisineType)}
                        </span>
                        <span className="text-caption text-charcoal-muted">
                          {recipe.prepTimeMinutes} mins
                        </span>
                        <RatingCell recipe={recipe} compact />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/60">
                    <Link
                      href={`/recipes/${recipe._id}`}
                      className="flex-1 text-center py-2 border border-border rounded-full text-label font-semibold text-charcoal hover:bg-cream-alt transition-colors"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTarget(recipe);
                        setDeleteError(null);
                      }}
                      className="flex-1 text-center py-2 border border-error/40 text-error rounded-full text-label font-semibold hover:bg-error/10 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-caption text-charcoal-muted text-center pt-2">
                Showing {filteredRecipes.length} of {recipes.length} recipe
                {recipes.length === 1 ? "" : "s"}
              </p>
            </div>
          </>
        )}
      </main>
      <Footer />

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) setDeleteTarget(null);
          }}
        >
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
            <div className="flex items-center gap-4 mb-4 text-error">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h3 className="font-heading text-headline-sm">Delete Recipe?</h3>
            </div>
            <p className="text-charcoal-muted mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-charcoal">
                &ldquo;{deleteTarget.title}&rdquo;
              </span>
              ? This action cannot be undone and the recipe will be removed
              from your collection permanently.
            </p>
            {deleteError && (
              <p className="text-error text-caption mb-4">{deleteError}</p>
            )}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 border border-border rounded-full text-label font-semibold text-charcoal-muted hover:bg-cream-alt transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-error text-white rounded-full text-label font-semibold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="bg-cream-alt rounded-xl p-16 text-center border-2 border-dashed border-border max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-primary text-[40px]">
          menu_book
        </span>
      </div>
      <h3 className="font-heading text-headline-sm mb-2">
        You haven&apos;t added any recipes yet
      </h3>
      <p className="text-body-lg text-charcoal-muted mb-8">
        Start your culinary journey by creating your first AI-powered recipe
        or exploring our library of seasonal favorites.
      </p>
      <Link
        href="/items/add"
        className="bg-primary text-white text-title font-semibold px-10 py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-primary-hover transition-all active:scale-95 inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined">add</span>
        Create Your First Recipe
      </Link>
    </div>
  );
}

function RatingCell({ recipe, compact }: { recipe: Recipe; compact?: boolean }) {
  const isNew = recipe.ratingCount === 0;
  return (
    <div className="flex items-center gap-1 text-primary">
      <span
        className={`material-symbols-outlined ${compact ? "text-[14px]" : "text-[18px]"}`}
        style={{ fontVariationSettings: `'FILL' ${isNew ? 0 : 1}` }}
      >
        star
      </span>
      <span className={compact ? "text-caption font-semibold" : "text-label font-semibold"}>
        {isNew ? "New" : recipe.ratingAverage.toFixed(1)}
      </span>
    </div>
  );
}
