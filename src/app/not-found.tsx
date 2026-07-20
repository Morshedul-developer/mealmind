import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-primary text-[64px] mb-4">
          soup_kitchen
        </span>
        <h1 className="font-heading text-headline mb-2">
          We couldn&apos;t find that page
        </h1>
        <p className="text-charcoal-muted max-w-md mb-8">
          The recipe or page you&apos;re looking for doesn&apos;t exist, or
          may have been removed.
        </p>
        <Link
          href="/explore"
          className="bg-primary text-white px-8 py-3 rounded-full text-label font-semibold hover:bg-primary-hover transition-all active:scale-95"
        >
          Explore Recipes
        </Link>
      </main>
      <Footer />
    </>
  );
}
