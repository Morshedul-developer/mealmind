import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | MealMind AI",
  description: "The terms that govern your use of MealMind AI.",
};

const sections = [
  {
    title: "Using MealMind AI",
    body: "MealMind AI lets you browse recipes, generate new ones with AI from ingredients you have on hand, chat with an AI cooking assistant, and publish your own recipes for others to explore. You need an account to generate recipes, chat with the assistant, publish a recipe, or leave a review.",
  },
  {
    title: "Your content",
    body: "Recipes and reviews you publish are yours, but by publishing them you allow MealMind AI to display them to other users on the Explore and Recipe Details pages. Don't publish anything you don't have the right to share, and keep reviews honest and based on real experience with the recipe.",
  },
  {
    title: "AI-generated content",
    body: "Recipes and chat responses produced by our AI features are generated automatically and may occasionally be inaccurate, especially around cooking times, quantities, or allergen safety. Always use your own judgment, and double-check anything safety-critical (like allergy information) before cooking.",
  },
  {
    title: "Account & availability",
    body: "You're responsible for keeping your account credentials secure. We may suspend accounts that abuse the platform (spam, harassment, or attempts to break the service). MealMind AI is provided as-is, and we don't guarantee uninterrupted availability.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-6 max-w-3xl mx-auto min-h-screen">
        <header className="mb-12">
          <h1 className="font-heading text-display-mobile md:text-display mb-4">
            Terms of Service
          </h1>
          <p className="text-charcoal-muted">Last updated July 2026.</p>
        </header>
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-headline-sm mb-3">
                {section.title}
              </h2>
              <p className="text-body-lg text-charcoal-muted leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
