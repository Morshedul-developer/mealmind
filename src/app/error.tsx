"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center text-center">
        <span className="material-symbols-outlined text-primary text-[64px] mb-4">
          error
        </span>
        <h1 className="font-heading text-headline mb-2">
          Something went wrong
        </h1>
        <p className="text-charcoal-muted max-w-md mb-8">
          We had trouble loading this page. Please try again in a moment.
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-primary text-white px-8 py-3 rounded-full text-label font-semibold hover:bg-primary-hover transition-all active:scale-95"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-border text-charcoal px-8 py-3 rounded-full text-label font-semibold hover:bg-cream-alt transition-all active:scale-95"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
