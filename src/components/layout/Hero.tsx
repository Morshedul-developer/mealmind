const chips = [
  { icon: "restaurant", label: "Heirloom Tomato", bg: "bg-secondary-light text-secondary", delay: "0s" },
  { icon: "eco", label: "Fresh Basil", bg: "bg-cream-alt text-charcoal", delay: "1.2s" },
  { icon: "kitchen", label: "Parmesan Reggiano", bg: "bg-primary/10 text-primary", delay: "2.5s" },
  { icon: "local_fire_department", label: "Garlic Confit", bg: "bg-secondary-light text-secondary", delay: "0.8s" },
  { icon: "egg", label: "Farm Eggs", bg: "bg-white text-charcoal", delay: "1.8s" },
];

export function Hero() {
  return (
    <section className="relative h-[665px] flex items-center overflow-hidden">
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
            <button className="bg-primary text-white px-8 py-4 rounded-full text-label font-semibold hover:bg-primary-hover transition-all active:scale-95">
              Generate a Recipe
            </button>
            <button className="border-2 border-border text-primary px-8 py-4 rounded-full text-label font-semibold hover:bg-cream-alt transition-all active:scale-95">
              Explore Recipes
            </button>
          </div>
        </div>
        <div className="relative hidden md:flex h-full items-center justify-center">
          <div className="absolute inset-0 flex flex-wrap gap-4 items-center justify-center p-8">
            {chips.map((chip) => (
              <div
                key={chip.label}
                className={`chip-float ${chip.bg} px-6 py-2 rounded-full text-label font-semibold flex items-center gap-2 shadow-sm`}
                style={{ animationDelay: chip.delay }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {chip.icon}
                </span>
                {chip.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
