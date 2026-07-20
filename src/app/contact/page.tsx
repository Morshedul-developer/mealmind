"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const contactInfo = [
  { icon: "mail", label: "Email", value: "hello@mealmind.ai" },
  { icon: "call", label: "Phone", value: "+88 01792-988812" },
  { icon: "location_on", label: "Address", value: "West Shewrapara, Mirpur, Dhaka" },
];

const socialIcons = ["public", "photo_camera", "forum"];

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialForm: FormState = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const handleSendAnother = () => {
    setForm(initialForm);
    setIsSubmitted(false);
  };

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
        <header className="mb-12 max-w-2xl">
          <h1 className="font-heading text-display-mobile md:text-display mb-4">
            Get in Touch
          </h1>
          <p className="text-body-lg text-charcoal-muted leading-relaxed">
            We&apos;d love to hear from you. Whether it&apos;s a feature
            request, a recipe question, or just to say hi, our team is here.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <section className="md:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-[0px_4px_20px_rgba(34,32,29,0.06)]">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <span
                  className="material-symbols-outlined text-secondary text-[56px] mb-4"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <h2 className="text-title font-semibold mb-2">
                  Message sent!
                </h2>
                <p className="text-charcoal-muted max-w-sm mb-6">
                  Thanks for reaching out — our team will get back to you
                  soon.
                </p>
                <button
                  type="button"
                  onClick={handleSendAnother}
                  className="text-primary font-semibold text-label hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="name"
                      className="text-label text-charcoal-muted"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-cream border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email"
                      className="text-label text-charcoal-muted"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="hello@example.com"
                      className="w-full bg-cream border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="subject"
                    className="text-label text-charcoal-muted"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={(event) => updateField("subject", event.target.value)}
                    placeholder="What is this regarding?"
                    className="w-full bg-cream border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="message"
                    className="text-label text-charcoal-muted"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Write your message here..."
                    className="w-full bg-cream border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-full text-label font-semibold shadow-sm hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  Send Message
                  <span className="material-symbols-outlined text-[18px]">
                    send
                  </span>
                </button>
              </form>
            )}
          </section>

          <aside className="md:col-span-5 space-y-6">
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="bg-cream-alt p-5 rounded-xl flex items-center gap-4 border border-transparent hover:border-border transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary-light flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined">
                      {info.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-label text-charcoal-muted">
                      {info.label}
                    </p>
                    <p className="text-title font-semibold">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {socialIcons.map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-white hover:bg-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {icon}
                  </span>
                </a>
              ))}
            </div>

            <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden bg-secondary-light border border-border">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ019FRwO060odGgGgyDLShjR2EOmhNtL93Wf0-K2dWk1imj8tnQAt5UDTuqJItrMw2uWI70-mC0sMRIV2QcOgoPUIIbU2E6bwRS_MnSPbPMe550wbbsUGWonKvgTs_eIS3hn-Q7BaKDccqHm8eRxBDBCNg9MMOlHmgcRuqnIQ8UwCsGO3a5vKdTQZtCBzWj12GRA0LH45MAc4C-_99uiSc1sw6jjEFFMwhSEWgx-H-US-KSxOkDQEoc85kmKM-9aPkvkg4Wus7ek"
                alt="A minimalist illustrated map of San Francisco streets in muted olive and cream tones."
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover grayscale opacity-40 mix-blend-multiply"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined">
                    location_on
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-sm">
                <p className="text-label font-semibold">Headquarters</p>
                <p className="text-caption text-charcoal-muted">
                  Mirpur, Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
