"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { generateRecipe } from "@/lib/ai-api";
import { getApiErrorMessage } from "@/lib/errors";
import { dietLabels, difficultyLabels } from "@/lib/recipe-labels";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IngredientChecklist } from "@/components/recipe/IngredientChecklist";
import { InstructionSteps } from "@/components/recipe/InstructionSteps";
import type { CuisineType, DietType } from "@/types/recipe";

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
  "none",
  "vegan",
  "vegetarian",
  "keto",
  "paleo",
  "gluten-free",
  "dairy-free",
];

type Length = "quick" | "detailed";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AiGeneratorPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientDraft, setIngredientDraft] = useState("");
  const [cuisineType, setCuisineType] = useState<CuisineType>("italian");
  const [dietType, setDietType] = useState<DietType>("none");
  const [length, setLength] = useState<Length>("quick");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const mutation = useMutation({
    mutationFn: () => generateRecipe({ ingredients, cuisineType, dietType, length }),
  });

  const commitIngredientDraft = () => {
    const trimmed = ingredientDraft.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setIngredientDraft("");
  };

  const handleIngredientKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitIngredientDraft();
    } else if (event.key === "Backspace" && ingredientDraft === "" && ingredients.length > 0) {
      setIngredients((prev) => prev.slice(0, -1));
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
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

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
        <div className="mb-8">
          <h1 className="font-heading text-headline mb-1">AI Recipe Generator</h1>
          <p className="text-charcoal-muted text-body-lg">
            Tell us what&apos;s in your kitchen and we&apos;ll craft a recipe
            around it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-cream-alt rounded-xl p-6 shadow-[0px_4px_20px_rgba(34,32,29,0.06)] flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  temp_preferences_custom
                </span>
                <h2 className="font-heading text-headline-sm">Recipe Lab</h2>
              </div>

              <div>
                <label className="text-label text-charcoal-muted block mb-2">
                  Your Ingredients
                </label>
                <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-lg border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  {ingredients.map((ingredient, index) => (
                    <span
                      key={ingredient}
                      className="bg-secondary-light text-secondary px-3 py-1 rounded-full text-caption font-medium flex items-center gap-1"
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        aria-label={`Remove ${ingredient}`}
                        className="hover:opacity-70"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          close
                        </span>
                      </button>
                    </span>
                  ))}
                  <input
                    value={ingredientDraft}
                    onChange={(event) => setIngredientDraft(event.target.value)}
                    onKeyDown={handleIngredientKeyDown}
                    onBlur={commitIngredientDraft}
                    placeholder={
                      ingredients.length === 0 ? "e.g. tomato, basil..." : "Add more..."
                    }
                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-caption placeholder:text-charcoal-muted/60 flex-1 min-w-[96px]"
                  />
                </div>
                <p className="text-caption text-charcoal-muted mt-2">
                  {ingredients.length === 0
                    ? "Add at least one ingredient, then press Enter."
                    : "Press Enter or comma to add another."}
                </p>
              </div>

              <div>
                <label className="text-label text-charcoal-muted block mb-2">
                  Cuisine Style
                </label>
                <div className="relative">
                  <select
                    value={cuisineType}
                    onChange={(event) =>
                      setCuisineType(event.target.value as CuisineType)
                    }
                    className="w-full appearance-none bg-white border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {cuisineOptions.map((option) => (
                      <option key={option} value={option}>
                        {capitalize(option)}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-muted">
                    expand_more
                  </span>
                </div>
              </div>

              <div>
                <label className="text-label text-charcoal-muted block mb-2">
                  Dietary Preferences
                </label>
                <div className="relative">
                  <select
                    value={dietType}
                    onChange={(event) => setDietType(event.target.value as DietType)}
                    className="w-full appearance-none bg-white border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {dietOptions.map((option) => (
                      <option key={option} value={option}>
                        {dietLabels[option]}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal-muted">
                    expand_more
                  </span>
                </div>
              </div>

              <div>
                <label className="text-label text-charcoal-muted block mb-2">
                  Recipe Depth
                </label>
                <div className="flex p-1 bg-border/40 rounded-full">
                  <button
                    type="button"
                    onClick={() => setLength("quick")}
                    className={`flex-1 py-2 px-4 rounded-full text-label font-semibold transition-all ${
                      length === "quick"
                        ? "bg-white text-primary shadow-sm"
                        : "text-charcoal-muted hover:text-charcoal"
                    }`}
                  >
                    Quick
                  </button>
                  <button
                    type="button"
                    onClick={() => setLength("detailed")}
                    className={`flex-1 py-2 px-4 rounded-full text-label font-semibold transition-all ${
                      length === "detailed"
                        ? "bg-white text-primary shadow-sm"
                        : "text-charcoal-muted hover:text-charcoal"
                    }`}
                  >
                    Detailed
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => mutation.mutate()}
                disabled={ingredients.length === 0 || mutation.isPending}
                className="w-full bg-primary text-white py-4 rounded-full text-title font-semibold shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                <span className="material-symbols-outlined">
                  {mutation.isPending ? "sync" : "auto_awesome"}
                </span>
                {mutation.isPending ? "Generating..." : "Generate Recipe"}
              </button>
            </div>

            <div className="bg-secondary-light text-secondary rounded-xl p-4 shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
              <p className="text-label uppercase tracking-widest opacity-70 mb-1">
                Chef&apos;s Note
              </p>
              <p className="leading-relaxed">
                The best AI-generated recipes start with real ingredients you
                actually have on hand — the more specific, the better the
                result.
              </p>
            </div>
          </aside>

          <section className="lg:col-span-8">
            {mutation.isIdle && (
              <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] p-16 text-center text-charcoal-muted min-h-[400px] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[48px] mb-4">
                  auto_awesome
                </span>
                <p className="text-title font-semibold text-charcoal mb-1">
                  Your recipe will appear here
                </p>
                <p className="max-w-sm">
                  Add your ingredients on the left and hit Generate Recipe to
                  see what MealMind AI comes up with.
                </p>
              </div>
            )}

            {mutation.isPending && (
              <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] p-8 space-y-6 animate-pulse">
                <div className="h-8 bg-cream-alt rounded w-2/3" />
                <div className="h-4 bg-cream-alt rounded w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                  <div className="md:col-span-5 space-y-3">
                    <div className="h-5 bg-cream-alt rounded w-1/2" />
                    <div className="h-4 bg-cream-alt rounded w-full" />
                    <div className="h-4 bg-cream-alt rounded w-full" />
                    <div className="h-4 bg-cream-alt rounded w-3/4" />
                  </div>
                  <div className="md:col-span-7 space-y-3">
                    <div className="h-5 bg-cream-alt rounded w-1/2" />
                    <div className="h-4 bg-cream-alt rounded w-full" />
                    <div className="h-4 bg-cream-alt rounded w-full" />
                    <div className="h-4 bg-cream-alt rounded w-5/6" />
                  </div>
                </div>
                <p className="flex items-center gap-2 text-primary text-label font-semibold pt-2">
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    sync
                  </span>
                  MealMind AI is cooking up your recipe...
                </p>
              </div>
            )}

            {mutation.isError && (
              <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] p-16 text-center min-h-[400px] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-error text-[48px] mb-4">
                  error
                </span>
                <p className="text-title font-semibold text-charcoal mb-1">
                  Couldn&apos;t generate a recipe
                </p>
                <p className="text-charcoal-muted max-w-sm mb-6">
                  {getApiErrorMessage(
                    mutation.error,
                    "Something went wrong while generating your recipe. Please try again."
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => mutation.mutate()}
                  className="bg-primary text-white px-8 py-3 rounded-full text-label font-semibold hover:bg-primary-hover transition-all active:scale-95"
                >
                  Try Again
                </button>
              </div>
            )}

            {mutation.isSuccess && mutation.data && (
              <>
                <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] overflow-hidden">
                  <div className="p-8">
                    <div className="flex gap-2 mb-3">
                      <span className="bg-secondary-light text-secondary px-3 py-1 rounded-full text-caption font-medium">
                        {dietLabels[dietType]}
                      </span>
                      <span className="bg-cream-alt text-charcoal-muted px-3 py-1 rounded-full text-caption font-medium">
                        {mutation.data.prepTimeMinutes} mins
                      </span>
                      <span className="bg-cream-alt text-charcoal-muted px-3 py-1 rounded-full text-caption font-medium">
                        {difficultyLabels[mutation.data.difficulty]}
                      </span>
                    </div>
                    <h2 className="font-heading text-display-mobile md:text-display mb-3">
                      {mutation.data.title}
                    </h2>
                    <p className="text-body-lg text-charcoal-muted leading-relaxed">
                      {mutation.data.shortDescription}
                    </p>
                  </div>

                  <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                    <aside className="md:col-span-5">
                      <h3 className="text-title font-semibold flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">
                          shopping_basket
                        </span>
                        Ingredients
                      </h3>
                      <IngredientChecklist ingredients={mutation.data.ingredients} />
                    </aside>
                    <div className="md:col-span-7">
                      <h3 className="text-title font-semibold flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary">
                          restaurant_menu
                        </span>
                        Preparation
                      </h3>
                      <InstructionSteps steps={mutation.data.instructions} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                    className="flex items-center gap-3 text-charcoal-muted hover:text-primary transition-colors py-4 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">refresh</span>
                    <span className="text-label font-semibold">
                      Regenerate with these ingredients
                    </span>
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
