import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | MealMind AI",
  description: "How MealMind AI collects, uses, and protects your data.",
};

const sections = [
  {
    title: "What we collect",
    body: "When you create an account, we store your name, email address, and a securely hashed password (or, if you sign in with Google, the profile info Google shares with us). When you use the app, we store the recipes you create, the reviews and star ratings you submit, and the ingredients or messages you send to our AI features so we can generate a response.",
  },
  {
    title: "How we use it",
    body: "Your account info keeps you signed in and lets you manage your own recipes. Ingredients and messages you send to the AI Recipe Generator and Chat Assistant are forwarded to our AI provider to produce a response, and are not used to train any model. We don't sell your data, and we don't share it with third parties beyond the infrastructure that runs the app (our hosting provider, database, and AI provider).",
  },
  {
    title: "Cookies & sessions",
    body: "We use a single session cookie to keep you logged in. It's required for the app to function and isn't used for advertising or cross-site tracking.",
  },
  {
    title: "Your choices",
    body: "You can delete any recipe you've created at any time from the Manage Recipes page. To request deletion of your account and associated data, email us at hello@mealmind.ai and we'll take care of it.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-6 max-w-3xl mx-auto min-h-screen">
        <header className="mb-12">
          <h1 className="font-heading text-display-mobile md:text-display mb-4">
            Privacy Policy
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
