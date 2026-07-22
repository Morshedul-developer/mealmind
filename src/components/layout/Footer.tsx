"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const exploreLinks = [
  { label: "AI Tools", href: "/ai-generator" },
  { label: "Our Story", href: "/about" },
];

const supportLinks = [
  { label: "Cooking Guides", href: "/explore" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact Us", href: "/contact" },
];

const socialLinks = [
  { label: "MealMind AI on X", icon: "public", href: "https://twitter.com/mealmindai" },
  { label: "MealMind AI on Instagram", icon: "share", href: "https://instagram.com/mealmindai" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="bg-cream-alt border-t border-border w-full mt-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-heading text-title text-primary w-fit">
            MealMind AI
          </Link>
          <p className="text-caption text-charcoal-muted max-w-xs">
            Elevating the everyday kitchen experience through culinary artificial
            intelligence and editorial design.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-label text-charcoal uppercase mb-1">Explore</h4>
          {exploreLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-charcoal-muted hover:text-primary transition-colors text-caption"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-label text-charcoal uppercase mb-1">Support</h4>
          {supportLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-charcoal-muted hover:text-primary transition-colors text-caption"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-label text-charcoal uppercase mb-1">
            Taste the Future
          </h4>
          {isSubscribed ? (
            <p className="text-caption text-secondary font-medium flex items-center gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              Thanks for subscribing!
            </p>
          ) : (
            <>
              <p className="text-caption text-charcoal-muted mb-1">
                Weekly recipes and AI kitchen tips in your inbox.
              </p>
              <form className="flex" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="bg-white border border-border px-4 py-2 rounded-l-lg w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-primary-hover transition-colors"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-caption text-charcoal-muted opacity-70">
          © 2026 MealMind AI. Modern Editorial Kitchen.
        </p>
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="text-charcoal-muted text-caption hover:text-primary underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-charcoal-muted text-caption hover:text-primary underline"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
