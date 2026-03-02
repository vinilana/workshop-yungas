import { ClerkProvider, UserButton, SignedIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Franchise Manager",
  description: "Franchise Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center gap-8">
                  <Link
                    href="/dashboard"
                    className="text-xl font-bold text-indigo-600"
                  >
                    Franchise Manager
                  </Link>
                  <SignedIn>
                    <nav className="flex gap-4">
                      <Link
                        href="/dashboard"
                        className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/franchises/new"
                        className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        New Franchise
                      </Link>
                    </nav>
                  </SignedIn>
                </div>
                <SignedIn>
                  <UserButton afterSignOutUrl="/sign-in" />
                </SignedIn>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
