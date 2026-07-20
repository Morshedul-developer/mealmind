const steps = [
  {
    icon: "inventory",
    iconBg: "bg-primary/10 text-primary",
    title: "1. Tell us your ingredients",
    description: "Scan your fridge or type in what's on hand. No amount is too small.",
  },
  {
    icon: "auto_awesome",
    iconBg: "bg-secondary-light text-secondary",
    title: "2. AI Crafts a Recipe",
    description: "Our culinary intelligence balances flavors and techniques in seconds.",
  },
  {
    icon: "soup_kitchen",
    iconBg: "bg-cream-alt text-charcoal",
    title: "3. Cook & Enjoy",
    description: "Follow step-by-step instructions designed for chefs of every level.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-cream-alt">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-heading text-headline text-center mb-16">
          The Path to Perfection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center group"
            >
              <div
                className={`w-16 h-16 rounded-full ${step.iconBg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
              >
                <span className="material-symbols-outlined text-[32px]">
                  {step.icon}
                </span>
              </div>
              <h3 className="text-title font-semibold mb-2">{step.title}</h3>
              <p className="text-charcoal-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
