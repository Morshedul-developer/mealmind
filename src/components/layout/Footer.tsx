const exploreLinks = ["AI Tools", "Our Story", "Community", "Premium Access"];
const supportLinks = ["Cooking Guides", "FAQ", "API Reference", "Contact Us"];

export function Footer() {
  return (
    <footer className="bg-cream-alt border-t border-border w-full mt-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="font-heading text-title text-primary">MealMind AI</div>
          <p className="text-caption text-charcoal-muted max-w-xs">
            Elevating the everyday kitchen experience through culinary artificial
            intelligence and editorial design.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-label text-charcoal uppercase mb-1">Explore</h4>
          {exploreLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-charcoal-muted hover:text-primary transition-colors text-caption"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-label text-charcoal uppercase mb-1">Support</h4>
          {supportLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-charcoal-muted hover:text-primary transition-colors text-caption"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-label text-charcoal uppercase mb-1">
            Taste the Future
          </h4>
          <p className="text-caption text-charcoal-muted mb-1">
            Weekly recipes and AI kitchen tips in your inbox.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email address"
              className="bg-white border border-border px-4 py-2 rounded-l-lg w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-hover transition-colors">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-caption text-charcoal-muted opacity-70">
          © 2026 MealMind AI. Modern Editorial Kitchen.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-charcoal-muted text-caption hover:text-primary underline">
            Privacy
          </a>
          <a href="#" className="text-charcoal-muted text-caption hover:text-primary underline">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
