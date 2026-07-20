import Image from "next/image";

const cuisines = [
  {
    name: "Italian",
    tagline: "Al dente dreams",
    alt: "A top-down editorial food photograph of a rustic Italian pasta dish with fresh basil leaves, bright red cherry tomatoes, and olive oil glistening under warm natural lighting.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMw1mm9nxsVx5N68b5mu1jQ-onNO5SOwXmaNaW2FS_gpmqZ2uUVlgbEpkyVV0gbEuPElBT73yaNP40F_g_A-czEJ922iMYQTtb3TZFIHlN9fGmYMaFJ40JvnWVfJO2UCFaAD9vyUf_mSzBEwfmAwwVYAGzcuL-i6qH79Q2XrOLeF5T_NLQVZRBlGWlahkHwq6Sc9oIYfnhlegAZvEGIx7H7WjLoo_mzusrbggXNWmVq9zazDTAC3fUvWMWxJMxqO014GNSiUPb8ao",
  },
  {
    name: "Japanese",
    tagline: "Zen on a plate",
    alt: "A minimalist and elegant editorial shot of Japanese cuisine, featuring a perfectly arranged plate of sashimi with delicate garnishes on a dark ceramic dish.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAiip4L1eAOnedKOmEp707UZv4EFjTdrOu0N1RPgcTvyY0IA-ubh1QRZvbfT9w8opD4ZrFXabPayoGjvxegVLOiet4mS0g6v8c0A6iLCvfNcDAUYASo-qMhOphlEu2tmGXVCxQ3tdUgC1OrL-LkoRkWYmG9zvIL-XKSFpKqkyFl5dh0qvyyf0ndbMaOiExtIGa6f0g_d7FSw3WTUH50PSmStBNGp5OBFiXTli90Kc6GVOK3SxpsUvI7j5sDHx55NoBOiUUqd2V_dF0",
  },
  {
    name: "Mexican",
    tagline: "Bold & Spirited",
    alt: "A vibrant and colorful editorial photograph of gourmet Mexican street tacos served on a rustic wooden board with fresh lime wedges and cilantro.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAMNsm8BvxwqFg8Ll-nJkPCMDCNE95ux0Sy2EK9cpU9pz1bBXSVlH7L0XzNbjyrOjXPkQSRgLrZLwP2TWwIfyAs_5UQh2B_KDNKqJuSR44r9IHcaDthaDkaUzWJxbbM6nMqu_miE_5Rsi_DHZNvdmHcnzUWMA1kjfE5tj8Np323z_g2U77mr0i_6B8A3kCbaigZuuGqAAKhRP6LI-lDoeFk3sUYyW_smkOWELKgF1tPi-MnxIpWsoZuIWJS24sgo0e5yJ7qURKd4Y",
  },
  {
    name: "Mediterranean",
    tagline: "Golden Hour Flavors",
    alt: "A sun-drenched editorial shot of a Mediterranean platter featuring fresh hummus, olives, roasted vegetables, and warm pita bread.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRLJF3sZEH1hqydEdfO5E2ujK-VQ2Mnr6iXgqO-w4DGf5ly6PaFJ2DHN_SASDYSKcAQeG798C09Nt2RKEKH9Ch2MnUEB9sY5kP83G5AZsQMX_i68Ydp0vfEVv-yRM5rcyFkHPw3iyPPJKSjVFeDqoMepZ49k5Ydh48PmL4p8e4mlVUwXvsFh3I8iPXzejry0QkzdRWm3NaJI1216Ujq0vi1xkcGAfA9blMzUVhxtt1SgSVyh4MZbWVolYx0PbvvDHPrKcVcJo47wo",
  },
];

export function PopularCuisines() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="max-w-xl">
            <span className="text-label text-primary uppercase tracking-widest">
              Global Flavors
            </span>
            <h2 className="font-heading text-headline mt-2">Explore by Cuisine</h2>
          </div>
          <a
            href="#"
            className="text-primary text-label font-semibold flex items-center gap-1 mt-4 md:mt-0 hover:underline"
          >
            View All Cuisines
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cuisines.map((cuisine) => (
            <div
              key={cuisine.name}
              className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-3/4"
            >
              <Image
                src={cuisine.imageUrl}
                alt={cuisine.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-title font-semibold">
                  {cuisine.name}
                </h3>
                <p className="text-white/80 text-caption">{cuisine.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
