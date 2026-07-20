"use client";

import { useRef } from "react";
import Image from "next/image";

interface FeaturedRecipe {
  title: string;
  description: string;
  badge: string;
  timeLabel: string;
  alt: string;
  imageUrl: string;
}

const recipes: FeaturedRecipe[] = [
  {
    title: "Slow-Roasted Tomato Pasta",
    description:
      "A comforting classic elevated by thyme-infused confit tomatoes.",
    badge: "Vegetarian",
    timeLabel: "30 mins",
    alt: "A close-up editorial shot of Slow-Roasted Tomato Pasta with ribbons of steam rising, topped with fresh basil and grated parmesan.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRcC2xuHyN6hyC8qFiZ1dSj4h7U0M1pg3F20XEYzSM2ksi7sddCF-EsJc-z8qydVNxuY-s4-FfZd_KNe36Rh2_8aBSZfLp0QoEe8rJ9Nmao5qe2akZZuPSAKYH3L85sOKTDe0zw6-LmMI4p65f1IjcHaVJz7XbKWbpHMDeBinS3mDRurfI5a7pfwjwsp5rcjg3vsBS7owS1dXsPvtwhSEktPRd4_YGFb0bI1FPiaq2tUrpa0tpkBbUlq6PgHt0GZQNoWQBjvk1kxY",
  },
  {
    title: "Herb-Crusted Salmon",
    description:
      "Fresh Atlantic salmon with a crust of dill, lemon, and sourdough crumbs.",
    badge: "High Protein",
    timeLabel: "20 mins",
    alt: "An editorial-style photograph of a Herb-Crusted Salmon fillet, perfectly seared with a golden herb crust, served with asparagus and lemon.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpT-BUU4Gzu255qlZhvP7AmYSetvANPaXvmGEuNt2Gbhv5Ww-FfYZGinu-dffF8MeiltUpng17D8TV3kB5UO-tavCsiP_rhhaP2nrvJaI_egcodJB3EcpzvBDaNfSfonA6RwIPDEnB5qfJAAkgnWfof9kmY62KBFtZcQbM3Lj3A45Z0HFnopNDash7jkrTo2dj6ikne-vgydEMiJ_71PccZ312VN-xNLdqTYJYYAzcT5RdGQnih1dH6IMvS3DOqSRcH0zVnC4GKP8",
  },
  {
    title: "Honey-Glazed Duck Breast",
    description:
      "Master the art of the perfect sear with our AI-guided temperature control.",
    badge: "Gourmet",
    timeLabel: "45 mins",
    alt: "An artistic culinary photograph of a Honey-Glazed Duck Breast sliced thinly, crispy skin drizzled with balsamic honey reduction, garnished with microgreens.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCt9zMbf5_-aWFz4Ew4tPiPZYQlfsq3BTNG3hjOc0I5s2aT4MVU3hdymkWkcQSSvHeiUTHdrcfiFcoCeaSTkya4HCeD80qCHzrsq2B3cc6wRUDzMVU0zZMkQQsoWpNphTyKeUM9VnJAIjneZ_HlFjECQDFUf6kpP87jwT7Yz6RsWq4aTMXf28171tLAUs1WpazcE8NltxvMDnVhDaowVKgj5DVdVTAhWa93ObLx0VUcmDD-iYkvNY_oabTa3DKB847XUCtYfyo_lvU",
  },
];

export function FeaturedRecipes() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    carouselRef.current?.scrollBy({ left: direction * 424, behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-cream-alt overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
        <h2 className="font-heading text-headline">Featured Recipes</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous recipe"
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Next recipe"
            className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
      <div
        ref={carouselRef}
        className="recipe-carousel flex gap-6 overflow-x-auto px-[calc((100vw-1280px)/2+24px)] snap-x snap-mandatory"
      >
        {recipes.map((recipe) => (
          <div
            key={recipe.title}
            className="min-w-[340px] md:min-w-[400px] bg-cream rounded-2xl p-4 shadow-[0px_4px_20px_rgba(34,32,29,0.06)] snap-start"
          >
            <div className="relative h-64 rounded-lg overflow-hidden mb-4">
              <Image
                src={recipe.imageUrl}
                alt={recipe.alt}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            <div className="flex gap-2 mb-2">
              <span className="bg-secondary-light text-secondary px-2 py-1 rounded text-[12px] font-semibold">
                {recipe.badge}
              </span>
              <span className="bg-cream-alt text-charcoal-muted px-2 py-1 rounded text-[12px] font-semibold">
                {recipe.timeLabel}
              </span>
            </div>
            <h3 className="text-title font-semibold mb-1">{recipe.title}</h3>
            <p className="text-charcoal-muted mb-4">{recipe.description}</p>
            <button className="text-primary text-label font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Cook Now
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
