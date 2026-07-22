"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/lib/auth-client";
import { getRequestErrorMessage } from "@/lib/errors";
import { GoogleIcon } from "@/components/ui/GoogleIcon";

const DEMO_EMAIL = "demo@mealmind.ai";
const DEMO_PASSWORD = "MealMindDemo123!";

type FieldErrors = { email?: string; password?: string };

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validate(email, password);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await signIn.email({ email, password, callbackURL: "/" });
      if (error) {
        setFormError(error.message ?? "Invalid credentials.");
        return;
      }
      router.push("/");
    } catch (error) {
      setFormError(getRequestErrorMessage(error, "Could not log in."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setFormError(null);
    setIsGoogleSubmitting(true);
    try {
      const { error } = await signIn.social({
        provider: "google",
        // Google OAuth leaves this page entirely and lands back on the
        // backend directly, so there's no browser "current page" left to
        // resolve a relative callbackURL against — it must be absolute.
        callbackURL: window.location.origin,
      });
      if (error) setFormError(error.message ?? "Could not continue with Google.");
    } catch (error) {
      setFormError(getRequestErrorMessage(error, "Could not continue with Google."));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setFieldErrors({});
    setFormError(null);
  };

  return (
    <main className="grow flex items-center justify-center px-6 py-16 relative overflow-hidden bg-linear-to-br from-cream to-cream-alt">
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-display-mobile md:text-display text-primary tracking-tight mb-1">
            MealMind AI
          </h1>
          <p className="text-title text-charcoal-muted">
            Welcome back to the kitchen.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] p-8 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-1">
              <label className="block text-label text-charcoal-muted" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`w-full bg-cream border px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  fieldErrors.email ? "border-error" : "border-border"
                }`}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email && (
                <p className="flex items-center gap-2 mt-2 text-error text-caption">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-end">
                <label className="block text-label text-charcoal-muted" htmlFor="password">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-caption text-primary hover:underline transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`w-full bg-cream border px-4 py-3 pr-12 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    fieldErrors.password ? "border-error" : "border-border"
                  }`}
                  aria-invalid={Boolean(fieldErrors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {fieldErrors.password && (
                <p className="flex items-center gap-2 mt-2 text-error text-caption">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {formError && (
              <p className="flex items-center gap-2 text-error text-caption">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {formError}
              </p>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white text-title font-semibold py-3 rounded-full hover:bg-primary-hover transition-all duration-200 active:scale-[0.98] shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>

              <div className="flex items-center py-2">
                <div className="grow h-px bg-border" />
                <span className="px-4 text-caption text-charcoal-muted italic">
                  or continue with
                </span>
                <div className="grow h-px bg-border" />
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={isGoogleSubmitting}
                className="w-full bg-cream border border-border text-charcoal text-label font-semibold py-4 rounded-full flex items-center justify-center gap-3 hover:bg-cream-alt transition-colors disabled:opacity-60"
              >
                <GoogleIcon />
                {isGoogleSubmitting ? "Connecting..." : "Continue with Google"}
              </button>

              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full bg-secondary-light text-secondary text-label font-semibold py-3 rounded-full hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
              >
                Try Demo Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-charcoal-muted">
              New to MealMind AI?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-8 text-center space-y-2">
          <p className="text-caption text-charcoal-muted">
            © 2026 MealMind AI. Modern Editorial Kitchen.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#" className="text-caption text-charcoal-muted hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-caption text-charcoal-muted hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-caption text-charcoal-muted hover:text-primary transition-colors">
              Help
            </a>
          </div>
        </footer>
      </div>

      <div className="hidden lg:block absolute right-0 top-0 h-full w-2/5 bg-cream-alt overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB13v2U5Kj3FelLyoPiZJFpBGyiaKxrmJdI347OcGhBW_z2RNRxeKtgvrjh9a8gN0I0NPXi5j-ymELQ0h68V_CxJcR40GXS63Id3HcNVkZrTJh-c2STibqvHiDSAXPAtp43F0JGhllTYZjuMN3B76kdlLzKM9qpf6DdBi0QdRBBUsHgjngeGPRfBBlZyBqi_P0W1VmmyrPpkI8RI8kkjt10tZHV6atv2QWuWJ7HmjgxJ02_fxGfyG7K3QEP-Bq3zgmdC4OqUcN_Qvk"
            alt="Fresh herbs and a chef's knife on a rustic wooden table"
            fill
            sizes="40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-16 text-white">
            <h2 className="font-heading text-headline-sm mb-2 drop-shadow-xs">
              &ldquo;The future of home cooking is conversational.&rdquo;
            </h2>
            <p className="text-body-lg opacity-90 italic">
              — The Modern Gourmet Journal
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
