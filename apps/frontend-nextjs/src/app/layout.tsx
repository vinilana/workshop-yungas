import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Franchise Manager | Control Center",
  description: "Modern franchise operations dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0f766e",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html lang="en">
        <body className="relative antialiased">
          <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-white/50 to-transparent" />
          <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 items-center justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-8">
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center gap-3"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-100 to-cyan-100 text-sm font-bold text-emerald-800 shadow-sm transition-transform group-hover:scale-[1.03]">
                      FM
                    </span>
                    <span>
                      <span className="block text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Operations Suite
                      </span>
                      <span className="block text-sm font-semibold text-slate-900 sm:text-base">
                        Franchise Manager
                      </span>
                    </span>
                  </Link>
                  <SignedIn>
                    <nav className="hidden gap-1 sm:flex">
                      <Link href="/dashboard" className="app-header-link">
                        Dashboard
                      </Link>
                      <Link href="/franchises/new" className="app-header-link">
                        New Franchise
                      </Link>
                    </nav>
                  </SignedIn>
                </div>
                <div className="flex items-center gap-2">
                  <SignedOut>
                    <Link href="/sign-in" className="secondary-btn">
                      Sign in
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <UserButton afterSignOutUrl="/sign-in" />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
