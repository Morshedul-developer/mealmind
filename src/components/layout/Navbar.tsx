"use client";

import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#", active: true },
  { label: "Explore Recipes", href: "#" },
  { label: "About", href: "#" },
  { label: "Login", href: "#" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-cream/90 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0px_4px_20px_rgba(34,32,29,0.06)]" : ""
      }`}
    >
      <nav className="flex justify-between items-center h-20 px-6 max-w-7xl mx-auto">
        <div className="font-heading text-2xl md:text-3xl text-primary tracking-tight">
          MealMind AI
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "text-primary font-bold border-b-2 border-primary pb-1 text-lg"
                  : "text-charcoal-muted font-medium text-lg hover:text-primary transition-colors duration-200"
              }
            >
              {link.label}
            </a>
          ))}
        </div>
        <button className="bg-primary text-white px-6 py-4 rounded-full text-label font-semibold cursor-pointer active:scale-95 transition-transform hover:bg-primary-hover">
          Create Recipe
        </button>
      </nav>
    </header>
  );
}
