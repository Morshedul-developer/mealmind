"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/errors";
import { dietLabels } from "@/lib/recipe-labels";
import { difficultyToApi } from "@/lib/recipe-format";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { CuisineType, DietType, Difficulty, Recipe } from "@/types/recipe";

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
  "bengali",
  "other",
];

const dietOptions: DietType[] = [
  "vegan",
  "vegetarian",
  "keto",
  "paleo",
  "gluten-free",
  "dairy-free",
  "none",
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Med" },
  { value: "hard", label: "Hard" },
];

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

interface FormState {
  title: string;
  shortDescription: string;
  ingredientsText: string;
  instructionsText: string;
  cuisineType: CuisineType | "";
  dietType: DietType | "";
  prepTimeMinutes: string;
  difficulty: Difficulty;
  imageUrl: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

interface NewRecipeInput {
  title: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  instructions: string[];
  cuisineType: CuisineType;
  dietType: DietType;
  prepTimeMinutes: number;
  difficulty: "Easy" | "Medium" | "Hard";
  imageUrl?: string;
  images?: string[];
}

const initialForm: FormState = {
  title: "",
  shortDescription: "",
  ingredientsText: "",
  instructionsText: "",
  cuisineType: "",
  dietType: "",
  prepTimeMinutes: "",
  difficulty: "easy",
  imageUrl: "",
};

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.title.trim()) errors.title = "Recipe title is required.";
  if (!form.shortDescription.trim())
    errors.shortDescription = "Short description is required.";
  if (!form.ingredientsText.trim())
    errors.ingredientsText = "List at least one ingredient.";
  if (!form.instructionsText.trim())
    errors.instructionsText = "Instructions are required.";
  if (!form.cuisineType) errors.cuisineType = "Select a cuisine.";
  if (!form.dietType) errors.dietType = "Select a dietary profile.";

  if (!form.prepTimeMinutes.trim()) {
    errors.prepTimeMinutes = "Prep time is required.";
  } else {
    const prepTime = Number(form.prepTimeMinutes);
    if (!Number.isFinite(prepTime) || !Number.isInteger(prepTime)) {
      errors.prepTimeMinutes = "Enter a whole number of minutes.";
    } else if (prepTime <= 0) {
      errors.prepTimeMinutes = "Prep time cannot be zero or negative.";
    }
  }

  if (form.imageUrl.trim() && !isValidUrl(form.imageUrl)) {
    errors.imageUrl = "Enter a valid image URL.";
  }

  return errors;
}

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*\d+[.)]\s*/, "").trim())
    .filter(Boolean);
}

export default function AddRecipePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [form, setForm] = useState<FormState>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFailedToLoad, setImageFailedToLoad] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "imageUrl") setImageFailedToLoad(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validate(form);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    const imageUrl = form.imageUrl.trim();
    const payload: NewRecipeInput = {
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.instructionsText.trim(),
      ingredients: parseLines(form.ingredientsText),
      instructions: parseLines(form.instructionsText),
      cuisineType: form.cuisineType as CuisineType,
      dietType: form.dietType as DietType,
      prepTimeMinutes: Number(form.prepTimeMinutes),
      difficulty: difficultyToApi[form.difficulty],
      ...(imageUrl ? { imageUrl, images: [imageUrl] } : {}),
    };

    setIsSubmitting(true);
    try {
      const response = await api.post<{
        success: boolean;
        data?: Recipe;
        error?: string;
      }>("/api/recipes", payload);

      if (!response.data.success || !response.data.data) {
        setFormError(response.data.error ?? "Could not save the recipe.");
        return;
      }
      router.push(`/recipes/${response.data.data._id}`);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        router.push("/login");
        return;
      }
      setFormError(getApiErrorMessage(error, "Could not save the recipe."));
    } finally {
      setIsSubmitting(false);
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

  const showImagePreview = form.imageUrl.trim() && isValidUrl(form.imageUrl) && !imageFailedToLoad;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <nav className="flex items-center gap-1 text-charcoal-muted mb-2">
            <Link href="/" className="text-caption hover:text-primary">
              Home
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <Link href="/explore" className="text-caption hover:text-primary">
              Recipes
            </Link>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="text-caption text-primary">New Recipe</span>
          </nav>
          <h1 className="font-heading text-headline">
            Craft Your Culinary Masterpiece
          </h1>
          <p className="text-charcoal-muted max-w-2xl mt-2 text-body-lg">
            Every great dish begins with a detailed blueprint. Document your
            recipe below.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">
                  edit_note
                </span>
                <h2 className="text-title font-semibold">General Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-label text-charcoal-muted mb-1" htmlFor="title">
                    Recipe Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="e.g. Pan-Seared Scallops with Saffron Risotto"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    className={`w-full bg-cream border rounded-lg p-3 placeholder:text-charcoal-muted/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      fieldErrors.title ? "border-error" : "border-border"
                    }`}
                    aria-invalid={Boolean(fieldErrors.title)}
                  />
                  {fieldErrors.title && (
                    <p className="text-error text-caption mt-1">{fieldErrors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-label text-charcoal-muted mb-1" htmlFor="shortDescription">
                    Short Description
                  </label>
                  <textarea
                    id="shortDescription"
                    rows={3}
                    placeholder="Describe the soul of the dish in 2-3 sentences..."
                    value={form.shortDescription}
                    onChange={(event) => updateField("shortDescription", event.target.value)}
                    className={`w-full bg-cream border rounded-lg p-3 placeholder:text-charcoal-muted/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      fieldErrors.shortDescription ? "border-error" : "border-border"
                    }`}
                    aria-invalid={Boolean(fieldErrors.shortDescription)}
                  />
                  <p className="text-caption text-charcoal-muted mt-1">
                    This will appear on the recipe discovery cards.
                  </p>
                  {fieldErrors.shortDescription && (
                    <p className="text-error text-caption mt-1">
                      {fieldErrors.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">
                  shopping_basket
                </span>
                <h2 className="text-title font-semibold">Ingredients</h2>
              </div>
              <textarea
                id="ingredientsText"
                rows={5}
                placeholder={"200g Duck Breast\n6 Fresh Figs, halved\n3 tbsp Wildflower Honey"}
                value={form.ingredientsText}
                onChange={(event) => updateField("ingredientsText", event.target.value)}
                className={`w-full bg-cream border rounded-lg p-3 leading-relaxed placeholder:text-charcoal-muted/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  fieldErrors.ingredientsText ? "border-error" : "border-border"
                }`}
                aria-invalid={Boolean(fieldErrors.ingredientsText)}
              />
              <p className="text-caption text-charcoal-muted mt-1">
                One ingredient per line.
              </p>
              {fieldErrors.ingredientsText && (
                <p className="text-error text-caption mt-1">
                  {fieldErrors.ingredientsText}
                </p>
              )}
            </section>

            <section className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">timer</span>
                <h2 className="text-title font-semibold">Preparation &amp; Metrics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-label text-charcoal-muted mb-1" htmlFor="prepTimeMinutes">
                    Prep Time (Minutes)
                  </label>
                  <div className="relative">
                    <input
                      id="prepTimeMinutes"
                      type="number"
                      value={form.prepTimeMinutes}
                      onChange={(event) => updateField("prepTimeMinutes", event.target.value)}
                      className={`w-full bg-cream border rounded-lg p-3 pr-12 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        fieldErrors.prepTimeMinutes
                          ? "border-error bg-error/5 text-error"
                          : "border-border"
                      }`}
                      aria-invalid={Boolean(fieldErrors.prepTimeMinutes)}
                    />
                    {fieldErrors.prepTimeMinutes && (
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-error">
                        error
                      </span>
                    )}
                  </div>
                  {fieldErrors.prepTimeMinutes && (
                    <p className="text-error text-caption mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        warning
                      </span>
                      {fieldErrors.prepTimeMinutes}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-label text-charcoal-muted mb-1">
                    Difficulty Level
                  </label>
                  <div className="flex bg-cream border border-border rounded-full p-1">
                    {difficultyOptions.map((option) => {
                      const checked = form.difficulty === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`flex-1 text-center py-2 rounded-full cursor-pointer transition-all text-label font-semibold ${
                            checked
                              ? "bg-secondary-light text-secondary"
                              : "text-charcoal-muted"
                          }`}
                        >
                          <input
                            type="radio"
                            name="difficulty"
                            value={option.value}
                            checked={checked}
                            onChange={() => updateField("difficulty", option.value)}
                            className="sr-only"
                          />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-label text-charcoal-muted mb-1" htmlFor="cuisineType">
                    Cuisine
                  </label>
                  <select
                    id="cuisineType"
                    value={form.cuisineType}
                    onChange={(event) =>
                      updateField("cuisineType", event.target.value as CuisineType | "")
                    }
                    className={`w-full bg-cream border rounded-lg p-3 appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      fieldErrors.cuisineType ? "border-error" : "border-border"
                    }`}
                    aria-invalid={Boolean(fieldErrors.cuisineType)}
                  >
                    <option value="">Select a cuisine</option>
                    {cuisineOptions.map((option) => (
                      <option key={option} value={option}>
                        {capitalize(option)}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.cuisineType && (
                    <p className="text-error text-caption mt-1">
                      {fieldErrors.cuisineType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-label text-charcoal-muted mb-1" htmlFor="dietType">
                    Dietary Profile
                  </label>
                  <select
                    id="dietType"
                    value={form.dietType}
                    onChange={(event) =>
                      updateField("dietType", event.target.value as DietType | "")
                    }
                    className={`w-full bg-cream border rounded-lg p-3 appearance-none transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      fieldErrors.dietType ? "border-error" : "border-border"
                    }`}
                    aria-invalid={Boolean(fieldErrors.dietType)}
                  >
                    <option value="">Select a dietary profile</option>
                    {dietOptions.map((option) => (
                      <option key={option} value={option}>
                        {dietLabels[option]}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.dietType && (
                    <p className="text-error text-caption mt-1">
                      {fieldErrors.dietType}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">
                  menu_book
                </span>
                <h2 className="text-title font-semibold">Cooking Instructions</h2>
              </div>
              <textarea
                id="instructionsText"
                rows={8}
                placeholder={"1. Heat the olive oil in a wide pan...\n2. Add the aromatics and sauté until translucent..."}
                value={form.instructionsText}
                onChange={(event) => updateField("instructionsText", event.target.value)}
                className={`w-full bg-cream border rounded-lg p-3 leading-relaxed placeholder:text-charcoal-muted/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  fieldErrors.instructionsText ? "border-error" : "border-border"
                }`}
                aria-invalid={Boolean(fieldErrors.instructionsText)}
              />
              {fieldErrors.instructionsText && (
                <p className="text-error text-caption mt-1">
                  {fieldErrors.instructionsText}
                </p>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4">
            <section className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(34,32,29,0.06)] lg:sticky lg:top-32">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">image</span>
                  <h2 className="text-title font-semibold">Recipe Visual</h2>
                </div>
                <div className="mb-6">
                  <label className="block text-label text-charcoal-muted mb-1" htmlFor="imageUrl">
                    Image URL (optional)
                  </label>
                  <input
                    id="imageUrl"
                    type="url"
                    placeholder="https://images.example.com/your-dish.jpg"
                    value={form.imageUrl}
                    onChange={(event) => updateField("imageUrl", event.target.value)}
                    className={`w-full bg-cream border rounded-lg p-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      fieldErrors.imageUrl ? "border-error" : "border-border"
                    }`}
                    aria-invalid={Boolean(fieldErrors.imageUrl)}
                  />
                  {fieldErrors.imageUrl && (
                    <p className="text-error text-caption mt-1">{fieldErrors.imageUrl}</p>
                  )}
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-alt border-2 border-dashed border-border flex items-center justify-center">
                  {showImagePreview ? (
                    // Arbitrary user-supplied URLs can't go through next/image's
                    // remotePatterns allowlist, so a plain img is used here.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.imageUrl}
                      alt="Live preview of the recipe image"
                      className="w-full h-full object-cover"
                      onError={() => setImageFailedToLoad(true)}
                    />
                  ) : (
                    <div className="text-center text-charcoal-muted px-6">
                      <span className="material-symbols-outlined text-[32px] mb-2 block">
                        {imageFailedToLoad ? "broken_image" : "image"}
                      </span>
                      <p className="text-caption">
                        {imageFailedToLoad
                          ? "Couldn't load that image."
                          : "Live preview will appear here."}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-caption text-charcoal-muted mt-4 text-center">
                  Images should be high-resolution with a clean editorial
                  aesthetic.
                </p>
              </div>
              <div className="bg-cream-alt p-6 border-t border-border">
                {formError && (
                  <p className="text-error text-caption mb-3 text-center">{formError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 rounded-full text-title font-semibold shadow-lg hover:bg-primary-hover transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? "Publishing..." : "Publish Recipe"}
                  {!isSubmitting && (
                    <span className="material-symbols-outlined">publish</span>
                  )}
                </button>
              </div>
            </section>
          </aside>
        </form>
      </main>
      <Footer />
    </>
  );
}
