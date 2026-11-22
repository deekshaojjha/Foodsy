import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Foodsy",
  description: "Find. Taste. Share.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${fraunces.variable} bg-foodsy-cream font-sans text-foodsy-ink antialiased`}
      >
        {/* A soft saffron glow at the top of every page */}
        <div className="min-h-screen bg-[radial-gradient(60rem_26rem_at_50%_-8rem,#FFE08A_0%,rgba(255,249,233,0)_70%)]">
          <div className="mx-auto max-w-xl px-4 py-8">
            <header className="mb-8 flex animate-fade-in items-center justify-between">
              <Link href="/restaurant/1" className="group flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foodsy-red text-lg font-bold text-foodsy-yellow shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                  F
                </span>
                <span>
                  <span className="block font-display text-2xl font-semibold leading-none">Foodsy</span>
                  <span className="mt-1 block text-sm text-foodsy-muted">Find. Taste. Share.</span>
                </span>
              </Link>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
