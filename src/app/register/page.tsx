"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn, signUp } from "@/lib/auth-client";
import { getRequestErrorMessage } from "@/lib/errors";
import { GoogleIcon } from "@/components/ui/GoogleIcon";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function validate(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "Full name is required.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (!confirmPassword) errors.confirmPassword = "Please confirm your password.";
  else if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

function getPasswordStrength(value: string) {
  let score = 0;
  if (value.length > 7) score += 25;
  if (/[A-Z]/.test(value)) score += 25;
  if (/[0-9]/.test(value)) score += 25;
  if (/[^A-Za-z0-9]/.test(value)) score += 25;

  if (score <= 25) return { score, label: "Weak. Add more characters.", color: "bg-error", text: "text-error" };
  if (score <= 75) return { score, label: "Medium. Add a number or symbol.", color: "bg-primary", text: "text-primary" };
  return { score, label: "Strong password!", color: "bg-secondary", text: "text-secondary" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validate(name, email, password, confirmPassword);
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await signUp.email({ name, email, password, callbackURL: "/" });
      if (error) {
        setFormError(error.message ?? "Could not create your account.");
        return;
      }
      router.push("/");
    } catch (error) {
      setFormError(getRequestErrorMessage(error, "Could not create your account."));
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

  return (
    <>
      <header className="w-full h-20 px-6 flex items-center justify-center md:justify-start">
        <span className="font-heading text-display-mobile md:text-display text-primary tracking-tight cursor-pointer">
          MealMind AI
        </span>
      </header>
      <main className="grow flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)] p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="mb-8 text-center md:text-left">
              <h1 className="font-heading text-headline mb-1">Join our Kitchen</h1>
              <p className="text-charcoal-muted">
                Start your AI-powered culinary journey today.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-1">
                <label className="text-label text-charcoal-muted" htmlFor="full_name">
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Gordon Ramsay"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={`w-full px-4 py-3 bg-cream border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-charcoal-muted/50 ${
                    fieldErrors.name ? "border-error" : "border-border"
                  }`}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && (
                  <p className="text-error text-caption">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-label text-charcoal-muted" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="chef@mealmind.ai"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={`w-full px-4 py-3 bg-cream border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-charcoal-muted/50 ${
                    fieldErrors.email ? "border-error" : "border-border"
                  }`}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email && (
                  <p className="text-error text-caption">{fieldErrors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-label text-charcoal-muted" htmlFor="password">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-cream border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-charcoal-muted/50 ${
                      fieldErrors.password ? "border-error" : "border-border"
                    }`}
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                <div className="mt-1">
                  <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${password ? strength.score : 0}%` }}
                    />
                  </div>
                  <p className={`text-caption mt-1 ${password ? strength.text : "text-charcoal-muted"}`}>
                    {password ? strength.label : "At least 8 characters with numbers and symbols."}
                  </p>
                </div>
                {fieldErrors.password && (
                  <p className="text-error text-caption">{fieldErrors.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-label text-charcoal-muted" htmlFor="confirm_password">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={`w-full px-4 py-3 pr-12 bg-cream border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-charcoal-muted/50 ${
                      fieldErrors.confirmPassword ? "border-error" : "border-border"
                    }`}
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-error text-caption">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {formError && <p className="text-error text-caption">{formError}</p>}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white text-label font-semibold py-4 rounded-full shadow-sm hover:shadow-md hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>{isSubmitting ? "Creating your account..." : "Create Account"}</span>
                  {!isSubmitting && (
                    <span className="material-symbols-outlined">arrow_forward</span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="h-px grow bg-border" />
                <span className="text-caption text-charcoal-muted uppercase tracking-wider">
                  or
                </span>
                <div className="h-px grow bg-border" />
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={isGoogleSubmitting}
                className="w-full bg-cream border border-border text-charcoal text-label font-semibold py-4 rounded-full flex items-center justify-center gap-3 hover:bg-cream-alt transition-colors disabled:opacity-60"
              >
                <GoogleIcon />
                <span>{isGoogleSubmitting ? "Connecting..." : "Continue with Google"}</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-charcoal-muted">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline ml-1 transition-all">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 opacity-10 pointer-events-none -z-10">
        <div className="relative w-full h-full">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyQL1fxW59NdpI1LAGkWVu08m1KUCM3HxKVZB5Yko60sHPgTLyzIE_nUjhdlFBwXKA-d3hL2jHHv0ByjPe3e_KF-ysyVfeJ-6a8lr_EkftjQF0PM9TfE9kQJLynylb04PD4_CRby-RvNjuUUntX3nGKdlvsb6IRy00md3GTa1tAvURw2bz13LbRQXrHI_nPc2k5CkB2On012YIdBUvMC-ur-SKu4XgVAPl5-LonPAHgL9oy6lHMfMEpu9oUsE8MTVy_dR3U1MFCjw"
            alt=""
            fill
            sizes="384px"
            className="object-cover"
          />
        </div>
      </div>

      <footer className="w-full py-4 text-center">
        <p className="text-caption text-charcoal-muted">
          © 2026 MealMind AI. Modern Editorial Kitchen.
        </p>
      </footer>
    </>
  );
}
