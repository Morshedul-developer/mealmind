"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { requestPasswordReset } from "@/lib/auth-client";
import { getRequestErrorMessage } from "@/lib/errors";

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
  return undefined;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sendResetLink = async () => {
    const error = validateEmail(email);
    setEmailError(error);
    setFormError(null);
    if (error) return;

    setIsSubmitting(true);
    try {
      const { error: apiError } = await requestPasswordReset({ email });
      if (apiError) {
        setFormError(apiError.message ?? "Could not send the reset link.");
        return;
      }
      setIsSent(true);
    } catch (error) {
      setFormError(getRequestErrorMessage(error, "Could not send the reset link."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendResetLink();
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <main className="grow flex items-center justify-center px-6 py-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading text-display-mobile md:text-display text-primary tracking-tight mb-2">
              MealMind AI
            </h1>
            <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
          </div>

          <div className="bg-white shadow-[0px_4px_20px_rgba(34,32,29,0.06)] rounded-xl p-6 md:p-8 transition-all duration-300">
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-secondary text-label font-semibold hover:opacity-80 transition-colors w-fit"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
                Back to Login
              </Link>

              {isSent ? (
                <div className="mt-2 space-y-4">
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="material-symbols-outlined">check_circle</span>
                    <h2 className="font-heading text-headline-sm">Link Sent!</h2>
                  </div>
                  <p className="text-charcoal-muted">
                    Check your inbox for instructions to reset your password for{" "}
                    <span className="font-semibold text-charcoal">{email}</span>.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-2">
                    <h2 className="font-heading text-headline-sm mb-1">
                      Reset your password
                    </h2>
                    <p className="text-charcoal-muted">
                      Enter your email and we&apos;ll send you a link to get back
                      into your kitchen.
                    </p>
                  </div>

                  <form className="space-y-6 mt-4" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-1">
                      <label className="text-label text-charcoal ml-1" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted group-focus-within:text-primary transition-colors">
                          mail
                        </span>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="chef@mealmind.ai"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className={`w-full pl-12 pr-4 py-3 bg-cream border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-charcoal-muted/50 ${
                            emailError ? "border-error" : "border-border"
                          }`}
                          aria-invalid={Boolean(emailError)}
                        />
                      </div>
                      {emailError && (
                        <p className="text-error text-caption">{emailError}</p>
                      )}
                    </div>

                    {formError && (
                      <p className="text-error text-caption">{formError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white text-title font-semibold py-3 rounded-full shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                      {!isSubmitting && (
                        <span className="material-symbols-outlined">send</span>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 text-center space-y-4">
            <p className="text-charcoal-muted">
              Didn&apos;t receive the email?{" "}
              <button
                type="button"
                className="text-primary text-label font-semibold hover:underline"
              >
                Check spam
              </button>{" "}
              or{" "}
              <button
                type="button"
                onClick={sendResetLink}
                disabled={isSubmitting}
                className="text-primary text-label font-semibold hover:underline disabled:opacity-60"
              >
                Resend
              </button>
            </p>
            <div className="pt-8 border-t border-border">
              <p className="text-caption text-charcoal-muted opacity-60">
                © 2026 MealMind AI. Modern Editorial Kitchen.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="hidden xl:block fixed bottom-6 left-6 w-64 h-80 opacity-40">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt40RvLp3YEYSdj5-Mksiiko1pkkzbmm1UgvVbKvtMaO6Ru_Di1P8IbfVgg--6O_OVDqVgNOP0dOmsjcWsBtOHoa5O8gFyx7383y-fm_byi701gTyRP0J0P0F1WJsuLdBrm5SKZV5ehbYTqIbmE_avBqoKMk89r1pgJSDfNsHtkk4RLzxtCrVTIlq1b-lzawmjICyYu0dD7xkZtnBmFWXFq1aqtfTpkVO4wtHHsagj6qbbTVQymyqlnaSwwO9ILcl-QUVd763GIMA"
          alt=""
          fill
          sizes="256px"
          className="object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>
    </>
  );
}
