"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Recipes", href: "/explore" },
  { label: "About", href: "/about" },
];

const authedLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Recipes", href: "/explore" },
  { label: "AI Generator", href: "/ai-generator" },
  { label: "My Recipes", href: "/items/manage" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = session ? authedLinks : publicLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    closeMobileMenu();
    await signOut();
    router.push("/");
    router.refresh();
  };

  const userInitial = session?.user.name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-cream/90 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0px_4px_20px_rgba(34,32,29,0.06)]" : ""
      }`}
    >
      <nav className="flex justify-between items-center h-20 px-6 max-w-7xl mx-auto">
        <Link
          href="/"
          className="font-heading text-2xl md:text-3xl text-primary tracking-tight"
        >
          MealMind AI
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.href !== "#" && pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1 text-lg"
                    : "text-charcoal-muted font-medium text-lg hover:text-primary transition-colors duration-200"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/items/add"
                className="bg-primary text-white px-6 py-3 rounded-full text-label font-semibold cursor-pointer active:scale-95 transition-transform hover:bg-primary-hover"
              >
                Create Recipe
              </Link>
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  aria-label="Account menu"
                  aria-expanded={isUserMenuOpen}
                  className="w-10 h-10 rounded-full bg-secondary-light text-secondary flex items-center justify-center font-semibold overflow-hidden border border-border"
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userInitial
                  )}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] border border-border py-2">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-label font-semibold text-charcoal truncate">
                        {session.user.name}
                      </p>
                      <p className="text-caption text-charcoal-muted truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 flex items-center gap-2 text-charcoal-muted hover:bg-cream-alt hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-charcoal-muted font-semibold text-lg hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-primary text-primary px-6 py-3 rounded-full text-label font-semibold hover:bg-primary hover:text-white transition-all active:scale-95"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden text-charcoal p-2 -mr-2"
        >
          <span className="material-symbols-outlined text-3xl">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-cream border-t border-border px-6 py-4">
          <div className="flex flex-col">
            {navLinks.map((link) => {
              const isActive = link.href !== "#" && pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`py-3 border-b border-border/60 font-medium ${
                    isActive ? "text-primary font-bold" : "text-charcoal"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            {session ? (
              <>
                <div className="flex items-center gap-3 pb-1">
                  <div className="w-10 h-10 rounded-full bg-secondary-light text-secondary flex items-center justify-center font-semibold overflow-hidden border border-border shrink-0">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-label font-semibold text-charcoal truncate">
                      {session.user.name}
                    </p>
                    <p className="text-caption text-charcoal-muted truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/items/add"
                  onClick={closeMobileMenu}
                  className="bg-primary text-white text-center px-6 py-3 rounded-full text-label font-semibold hover:bg-primary-hover transition-all active:scale-95"
                >
                  Create Recipe
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 border border-border text-charcoal-muted py-3 rounded-full text-label font-semibold hover:bg-cream-alt transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="text-center py-3 border border-border rounded-full text-charcoal font-semibold hover:bg-cream-alt transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="text-center py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-all active:scale-95"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
