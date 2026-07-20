const scannedIngredients = [
  "Organic Chickpeas (1 can)",
  "Wilted Kale (1 bunch)",
  "Tahini (half jar)",
];

export function AIFeatureSpotlight() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="bg-cream-alt p-8 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col gap-4 z-10 relative">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">camera</span>
                </div>
                <h3 className="font-heading text-headline-sm">Ingredient Scan</h3>
              </div>
              <p className="text-charcoal-muted">Scanning pantry... Found:</p>
              <ul className="space-y-2">
                {scannedIngredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="flex items-center gap-4 p-4 bg-cream rounded-lg border border-border/60"
                  >
                    <span className="material-symbols-outlined text-secondary">
                      check_circle
                    </span>
                    <span className="font-medium">{ingredient}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 h-2 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 animate-pulse" />
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 opacity-5">
              <span className="material-symbols-outlined text-[300px]">
                kitchen
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-primary text-label tracking-widest uppercase">
              The Result
            </span>
            <h2 className="font-heading text-display-mobile md:text-display">
              From scraps to <span className="italic">masterpiece.</span>
            </h2>
            <div className="bg-primary text-white p-8 rounded-2xl shadow-xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <h4 className="font-heading text-headline-sm mb-4">
                Crispy Tahini-Glazed Chickpeas with Sautéed Kale
              </h4>
              <p className="mb-8 opacity-90">
                A nutrition-packed lunch that tastes like it came from a
                high-end bistro. Total time: 12 minutes.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                <div>
                  <p className="text-caption opacity-70">Difficulty</p>
                  <p className="text-label font-semibold">Easy</p>
                </div>
                <div>
                  <p className="text-caption opacity-70">Sustainability Score</p>
                  <p className="text-label font-semibold">High (9.2/10)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
