import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/layout/Hero";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { PopularCuisines } from "@/components/PopularCuisines";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";
import { AIFeatureSpotlight } from "@/components/AIFeatureSpotlight";
import { PlatformStats } from "@/components/PlatformStats";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mt-20">
        <Hero />
        <HowItWorks />
        <PopularCuisines />
        <FeaturedRecipes />
        <AIFeatureSpotlight />
        <PlatformStats />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
