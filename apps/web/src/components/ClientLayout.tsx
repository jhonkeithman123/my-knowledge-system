"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import Link from "next/link";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
        <nav className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <Link
                href="/"
                className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-300 dark:hover:to-purple-300 transition-all"
              >
                <span className="hidden sm:inline">Knowledge Management</span>
                <span className="sm:hidden">KMS</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                <Link
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  href="/topic"
                >
                  All Topics
                </Link>
                <Link
                  href="/topic/new"
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  + New Topic
                </Link>
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6 text-gray-700 dark:text-gray-300"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {mobileMenuOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-slate-700">
                <Link
                  href="/topic"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Topics
                </Link>
                <Link
                  href="/topic/new"
                  className="block px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-purple-700 transition-all text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  + New Topic
                </Link>
              </div>
            )}
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
