import Image from "next/image";

const testimonials = [
  {
    quote:
      "MealMind AI doesn't just suggest recipes; it suggests flavors I hadn't even considered. It's like having a creative consultant in my kitchen who never gets tired of trying something new.",
    name: "Chef Marcus",
    role: "Michelin-Starred Consultant",
    alt: "A professional headshot of a refined man in a chef's coat, Chef Marcus, with a warm, confident smile against a soft-focus professional kitchen background.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuApePHfFj9NS3n4hyd_KrA9q5WMG-5zCIkTKTVAYFb6KZ714jlhN8LDBjonmM3Hz15WVkR6o2um3jxw0kZzc5nXBfQluuSl3Q0p228bRMP_-Ly5YuUc7fCtVEmffe9SPD0LaXRVKpTzaaDvqTK-3-20TJEpQA5e3Fi3Nu_QD9APnmKHI9MFLHuRHcZQ0Mty0bQyztqStv-kOaEyV6Ir55SkUGlQJSQwTfiTFWL14RYf1_C2nSepdkheq1doW6PiFy0OOhQGTj3lpU4",
  },
  {
    quote:
      "I used to throw away so much produce every week. Now, I just scan my drawer and MealMind tells me exactly what to do. It's saved me money and made me a better cook.",
    name: "Home Cook Sarah",
    role: "Sustainability Advocate",
    alt: "A portrait of a woman in her early 30s, Home Cook Sarah, laughing in a bright, modern kitchen filled with plants and light.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXIjHEyYkBaq1EAdkFYq7ZWXUnmwPwOdHkaNtr-Toa9QWvdFYia9pl5Hbt-MBiZa8J0bUSTKXp1gYV52QsDKIWG05kEt-MJz7t_CmU0c6p-WsMrTBuxehsl0DqbqKd93VLW3YmEpu1HNdHf0baP7ZVwRhloQAi1mCqI9fhYU3qjhCSuplea5vSjuaCVrNXzuPJIUmvhWqgM_tMQpOGE0CNjDEuZkSEPiAYIaPoU6VRg1coPw2lLrxNuyKxD8wsuivCyBNeBQNaS7I",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="font-heading text-headline">
          Loved by Pros and Enthusiasts
        </h2>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="p-12 bg-cream-alt rounded-2xl border border-border/60 flex flex-col gap-6"
          >
            <span className="material-symbols-outlined text-primary text-[48px]">
              format_quote
            </span>
            <p className="text-body-lg italic leading-relaxed text-charcoal">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={testimonial.imageUrl}
                  alt={testimonial.alt}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-title font-semibold">{testimonial.name}</p>
                <p className="text-caption text-charcoal-muted">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
