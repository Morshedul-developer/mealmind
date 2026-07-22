"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Can I use it for specific dietary restrictions?",
    answer:
      "Absolutely. You can set persistent profiles for Vegan, Paleo, Keto, Gluten-Free, and over 20 common allergens. Our AI cross-references every ingredient against your profile.",
  },
  {
    question: 'How does the "Ingredient Scan" work?',
    answer:
      "Simply take a photo of your fridge or pantry shelf. Our computer vision identifies items and quantities, then suggests recipes that maximize what you already have.",
  },
  {
    question: "Is it suitable for professional chefs?",
    answer:
      'Yes! Many pros use MealMind for "creative spark" sessions—finding unusual pairings or optimizing plating ideas through our Pro-Grade prompt engine.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 bg-white scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-heading text-headline text-center mb-16">
          Kitchen Queries
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-border">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-title font-semibold">
                    {faq.question}
                  </span>
                  <span
                    className={`material-symbols-outlined transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 text-charcoal-muted">{faq.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
