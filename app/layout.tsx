/**
 * Root Layout Component
 * 
 * The main layout wrapper for the entire GCSE FastTrack application.
 * Provides consistent structure across all pages with Header and Footer.
 * 
 * Features:
 * - Next.js metadata configuration for SEO
 * - Global Header component (navigation)
 * - Global Footer component (legal links, attribution)
 * - Global CSS imports
 * - Antialiased text rendering for better readability
 * 
 * Structure:
 * - Header (sticky navigation at top)
 * - Children (page content - dynamic)
 * - Footer (legal information at bottom)
 * 
 * @layout
 */

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// SEO metadata for the application
export const metadata: Metadata = {
  title: "GCSE Fast Track",
  description: "Master your GCSE exams with interactive lessons and practice questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
