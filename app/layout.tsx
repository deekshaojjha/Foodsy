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
      <body className={`${outfit.variable} ${fraunces.variable} bg-foodsy-yellow font-sans text-foodsy-ink antialiased`}>
        <div className="mx-auto min-h-screen max-w-xl px-4 py-8">
          <header className="mb-8 flex items-center justify-between">
            <Link href="/restaurant/1" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foodsy-red text-lg font-bold text-foodsy-yellow shadow-sm">
                F
              </span>
              <span>
                <span className="block font-display text-2xl font-semibold leading-none">Foodsy</span>
                <span className="mt-1 block text-sm text-foodsy-ink/70">Find. Taste. Share.</span>
              </span>
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
