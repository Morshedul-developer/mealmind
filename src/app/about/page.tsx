import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About | MealMind AI",
  description:
    "Our mission is bringing the soul of fine dining to every home kitchen — meet the team behind MealMind AI.",
};

const features = [
  {
    icon: "auto_stories",
    title: "Editorial Quality",
    description:
      "Experience recipes that feel meticulously crafted by world-class food editors. We focus on technique, texture, and flavor profiles, moving beyond basic algorithmic suggestions.",
  },
  {
    icon: "recycling",
    title: "Zero Waste",
    description:
      "Turn random pantry scraps into gourmet masterpieces. Our AI understands ingredient longevity and pairings to ensure nothing in your fridge goes to waste.",
  },
  {
    icon: "chat",
    title: "Real-time Guidance",
    description:
      "A sophisticated, conversational assistant that stays with you through every sizzle and simmer. It adapts to your skill level and available kitchen equipment instantly.",
  },
];

const team = [
  {
    name: "Julianne Vance",
    role: "Founder & Executive Food Stylist",
    alt: "Portrait of Julianne Vance, a chef in a white chef's coat in a bright, upscale restaurant kitchen.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGqI-2spvsv9c3ACkGWzO17ehdD0sUmo7XQ9v9tEC_JSO48moBsK1LNy2V8UEQLSn_jgbTUG4CUEYYaNH7r1gfkopliXBdUXhQupazzUb0wfQZw_eIZ_4K3TKWlH5mEcb-vIYrtdIy2pR3WTmLZeKgj5yXVBYAOdkHA0gyC0PHmEsSdE9ANe0lNVZKAwn9jR6MEMpI3g9baUNLFzsIlwIRURb_XMTS49cunwuz-2zcCT-i5OHmxzgElbOaAcGQfcbEls4jN3c-5Gc",
  },
  {
    name: "Marcus Thorne",
    role: "Head of Culinary AI",
    alt: "Portrait of Marcus Thorne in a sleek, minimalist kitchen setting holding a digital tablet.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCb_MFmhLVMdvqfztjbroS3YPU8EgjhQvmThIkbyJzMIbpjnW3NM64n2yS2h0WZk39KO-kQm8eJNegPd2hgkyRKk1XBluH37FWepCu8EwuQFpkxTa4FPHQm8EmrHG6SPMbjuFZ_89_43I3wrMojuoZYbJIGlbGcOAXXcCgExDrJMVDlXvHg3g-gI7YKr3iSlBekt1TunhrcRE5F47tF38zkaB9EsGtl4Qjh_Qp9ZJWKo0-NhQIkUwxMF1zLCnBr08KSrfNLQoQkO0g",
  },
  {
    name: "Sarah Chen",
    role: "Sustainability Lead",
    alt: "Portrait of Sarah Chen in an urban kitchen garden holding fresh vegetables.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAAgsyHQbcAfXmWxP6i1m_2dyJOH7EP_pekT1nIAPhDnVMGC5BN8x4ReTuHxJYH76No4CcHW8dls8JA1AKFkijX7zL46KM287ZAMkHxkARyftfuF7kaubf4depz39nfwr5L01mn29NPbwSc9cJG_cwGqX5CFu0ex6c2uT9EdIOg4c90MozsfOVl_cGSm-s8eYP1jMx3Gxzn6kbxetwBxjXrqF_jxnvzibbtWsbtzLwkIY80VcLXwidFzsE0-7DlX_S8cn9uHp6p9M4",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h1 className="font-heading text-display-mobile md:text-display text-primary leading-tight mb-6">
                Our Mission: Bringing the Soul of Fine Dining to Every Home
                Kitchen.
              </h1>
              <p className="text-body-lg text-charcoal-muted leading-relaxed max-w-lg mb-6">
                At MealMind AI, we believe cooking is an act of creativity and
                care. By combining advanced artificial intelligence with
                professional culinary expertise, we empower home cooks to
                eliminate food waste and rediscover the joy of creating
                restaurant-quality meals with the ingredients they already
                have.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-light text-secondary rounded-full text-label font-semibold">
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
                Zero-Waste Certified Tech
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCojA5jQLTcyIsWCSV4MtWxOjH2gPaK72kVVTz6BpvwAKgz_51qdSI-GzH_Lr7BOjr9itVBcgIS4EwPOWmMZlu_jHFKt8bOBeriae2MtrpV-p0GmAh_Cz2lC5d8AXM2Soe7r1xBHvQFI4XtEFzn5C5uqBlMr29OO0zw9ctTxDBagWIcWeYBqqs37foPsGA9OvPmenLLvMYTZgFPBsD6rio2Vx9e0p0_Fz_Jcg02kr5XqmyuHSRgHNRmuz-yiOp_fQnUqNz_vnj9lPY"
                  alt="A chef prepping fresh herbs in a sun-drenched modern minimalist kitchen with marble countertops and warm terracotta and olive tones."
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="hidden lg:block absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] max-w-[240px]">
                <p className="font-heading italic text-headline-sm text-secondary">
                  &ldquo;Good food is a human right, not a luxury.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-cream-alt">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-heading text-headline">
                Why MealMind AI?
              </h2>
              <div className="w-16 h-1 bg-primary mx-auto mt-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white p-8 rounded-2xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="text-title font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal-muted">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-primary text-label uppercase tracking-widest">
                  The Creators
                </span>
                <h2 className="font-heading text-headline mt-2">
                  The Minds Behind the Meals
                </h2>
              </div>
              <p className="text-charcoal-muted max-w-sm">
                A diverse group of chefs, technologists, and environmentalists
                working to redefine the digital kitchen.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="group">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
                    <Image
                      src={member.imageUrl}
                      alt={member.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <h4 className="text-title font-semibold">{member.name}</h4>
                  <p className="text-primary font-medium text-label">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-primary rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h2 className="font-heading text-display-mobile md:text-headline text-white mb-3">
                  Ready to transform your kitchen?
                </h2>
                <p className="text-white/80 text-body-lg max-w-lg">
                  Join 50,000+ home chefs creating extraordinary meals with
                  the power of MealMind AI.
                </p>
              </div>
              <Link
                href="/ai-generator"
                className="shrink-0 bg-white text-primary px-8 py-4 rounded-full text-title font-semibold shadow-lg hover:bg-cream transition-colors active:scale-95"
              >
                Start Cooking Today
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
