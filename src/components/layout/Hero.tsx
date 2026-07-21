import Image from "next/image";
import Link from "next/link";

const chips = [
  { icon: "restaurant", label: "Heirloom Tomato", delay: "0s" },
  { icon: "eco", label: "Fresh Basil", delay: "1.2s" },
  { icon: "kitchen", label: "Parmesan Reggiano", delay: "2.5s" },
  { icon: "local_fire_department", label: "Garlic Confit", delay: "0.8s" },
  { icon: "egg", label: "Farm Eggs", delay: "1.8s" },
];

const aiResultIngredients = ["Heirloom Tomato", "Fresh Basil", "Farm Eggs"];

function AiResultCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-primary text-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-500 ${className}`}
    >
      <div className="relative h-24 w-full">
        <Image
          src="https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&h=300&fit=crop&q=80"
          alt="A golden, herb-flecked skillet frittata with tomato"
          fill
          sizes="256px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
      </div>
      <div className="p-6 pt-4">
        <div className="flex items-center gap-1.5 text-caption font-semibold text-white/80 mb-3">
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          Generated in 2.1s
        </div>
        <h3 className="font-heading text-title mb-3 leading-snug">
          Heirloom Tomato &amp; Basil Frittata
        </h3>
        <ul className="space-y-1.5 mb-4 text-label text-white/90">
          {aiResultIngredients.map((ingredient) => (
            <li key={ingredient} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-white/60 shrink-0" />
              {ingredient}
            </li>
          ))}
        </ul>
        <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-caption font-semibold">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          18 min
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative h-auto md:h-[65vh] md:min-h-150 py-12 md:py-0 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
        <div className="z-10">
          <h1 className="font-heading text-display-mobile md:text-display text-charcoal mb-4">
            Your Personal AI <br /> <span className="text-primary">Sous-Chef.</span>
          </h1>
          <p className="text-body-lg text-charcoal-muted max-w-lg mb-8">
            Transform a few random ingredients into a five-star dining experience.
            MealMind AI crafts editorial-quality recipes tailored to your pantry,
            preferences, and dietary needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/ai-generator"
              className="bg-primary text-white px-8 py-4 rounded-full text-label font-semibold hover:bg-primary-hover transition-all active:scale-95"
            >
              Generate a Recipe
            </Link>
            <Link
              href="/explore"
              className="border-2 border-border text-primary px-8 py-4 rounded-full text-label font-semibold hover:bg-cream-alt transition-all active:scale-95"
            >
              Explore Recipes
            </Link>
          </div>
        </div>
        <div className="relative hidden md:flex h-[440px]">
          <AiResultCard className="absolute bottom-10 right-0 lg:right-4 w-48 lg:w-64 transform -rotate-3 hover:rotate-0" />
          <div className="absolute inset-y-0 left-0 right-[46%] flex flex-wrap gap-4 items-center justify-center p-8">
            {chips.map((chip) => (
              <div
                key={chip.label}
                className="chip-float bg-cream/70 backdrop-blur-sm border border-border text-charcoal-muted px-4 py-1.5 rounded-full text-caption font-medium flex items-center gap-1.5"
                style={{ animationDelay: chip.delay }}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {chip.icon}
                </span>
                {chip.label}
              </div>
            ))}
          </div>
        </div>
        <div className="md:hidden max-w-xs mx-auto w-full">
          <AiResultCard className="w-full" />
        </div>
      </div>
    </section>
  );
}
