import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { RecipeHero } from "@/components/recipe/RecipeHero";
import { IngredientChecklist } from "@/components/recipe/IngredientChecklist";
import { InstructionSteps } from "@/components/recipe/InstructionSteps";
import { StarRating } from "@/components/recipe/StarRating";
import { difficultyLabels } from "@/lib/recipe-labels";
import { fetchRecipeDetail } from "@/lib/recipes-api";
import type { Recipe } from "@/types/recipe";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchRecipeDetail(id);
  if (!result) return { title: "Recipe not found | MealMind AI" };
  return { title: `${result.recipe.title} | MealMind AI` };
}

function buildStats(recipe: Recipe) {
  const stats: { icon: string; label: string; value: string }[] = [
    {
      icon: "schedule",
      label: "Prep Time",
      value: `${recipe.prepTimeMinutes} mins`,
    },
  ];
  if (recipe.servings !== undefined) {
    stats.push({
      icon: "restaurant",
      label: "Servings",
      value: `${recipe.servings} ${recipe.servings === 1 ? "Person" : "People"}`,
    });
  }
  if (recipe.calories !== undefined) {
    stats.push({
      icon: "local_fire_department",
      label: "Calories",
      value: `${recipe.calories} kcal`,
    });
  }
  stats.push({
    icon: "signal_cellular_alt",
    label: "Difficulty",
    value: difficultyLabels[recipe.difficulty],
  });
  return stats;
}

export default async function RecipeDetailsPage({ params }: Props) {
  const { id } = await params;
  const result = await fetchRecipeDetail(id);

  if (!result) {
    notFound();
  }

  const { recipe, related } = result;
  const stats = buildStats(recipe);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <RecipeHero recipe={recipe} />

        <div className="max-w-3xl mx-auto px-6 pt-10 md:pt-14 text-center">
          <p className="text-body-lg text-charcoal-muted leading-relaxed whitespace-pre-line">
            {recipe.fullDescription}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 lg:items-start">
            <aside className="lg:col-span-4 lg:sticky lg:top-28">
              <h2 className="font-heading text-headline-sm mb-6">Ingredients</h2>
              {recipe.ingredients.length > 0 ? (
                <IngredientChecklist ingredients={recipe.ingredients} />
              ) : (
                <p className="text-charcoal-muted">No ingredients listed.</p>
              )}
            </aside>
            <div className="lg:col-span-8">
              <h2 className="font-heading text-headline-sm mb-8">Instructions</h2>
              <InstructionSteps steps={recipe.instructions} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-y-6 border-y border-border py-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex items-center gap-3 px-8 first:pl-0 ${
                  index > 0 ? "md:border-l md:border-border" : ""
                }`}
              >
                <span className="material-symbols-outlined text-primary text-[28px]">
                  {stat.icon}
                </span>
                <div className="flex flex-col">
                  <span className="text-title font-semibold leading-none">
                    {stat.value}
                  </span>
                  <span className="text-caption text-charcoal-muted uppercase tracking-wider mt-1">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <section className="mb-16 pb-16 border-b border-border">
            <h2 className="font-heading text-headline-sm mb-6">
              Reviews &amp; Ratings
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="font-heading text-display">
                  {recipe.ratingAverage.toFixed(1)}
                </span>
                <StarRating value={recipe.ratingAverage} />
                <span className="text-caption text-charcoal-muted">
                  {recipe.ratingCount > 0
                    ? `${recipe.ratingCount} Rating${recipe.ratingCount === 1 ? "" : "s"}`
                    : "No ratings yet"}
                </span>
              </div>
              {recipe.ratingCount === 0 && (
                <p className="text-charcoal-muted md:pt-2">
                  Be the first to rate this recipe once you&apos;ve tried it.
                </p>
              )}
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="font-heading text-headline-sm mb-6">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((item) => (
                  <RecipeCard key={item._id} recipe={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <ChatWidget recipeId={recipe._id} recipeTitle={recipe.title} />
    </>
  );
}
