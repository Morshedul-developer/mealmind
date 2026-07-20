const stats = [
  { value: "1M+", label: "RECIPES GENERATED" },
  { value: "500k+", label: "HAPPY COOKS" },
  { value: "4.9/5", label: "AVERAGE RATING" },
];

export function PlatformStats() {
  return (
    <section className="py-16 bg-charcoal text-white text-center">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-heading text-display text-primary mb-1">
              {stat.value}
            </p>
            <p className="text-label tracking-wider opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
