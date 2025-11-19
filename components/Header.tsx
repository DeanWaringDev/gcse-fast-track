/**
 * Header Component
 * 
 * A fully responsive navigation header for the GCSE Fast Track application.
 * Features mobile-first design with hamburger menu for small screens and 
 * horizontal navigation for desktop.
 * 
 * Authentication-aware:
 * - Shows "Login" button when user is not authenticated
 * - Shows "Logout" button when user is authenticated
 * - Checks authentication state on mount and updates dynamically
 * 
 * Responsive Breakpoints:
 * - Mobile (<640px): Small logo/title, hamburger menu
 * - Small (640px+): Larger logo/title, still hamburger menu
 * - Medium (768px+): Compact horizontal nav appears, hamburger hidden
 * - Large (1024px+): Full-size nav with increased spacing
 * 
 * @component
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Header() {
  // State to control mobile menu visibility
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State to track authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * Handles navigation to login page
   */
  const handleLoginClick = () => {
    router.push('/login');
  };

  /**
   * Handles user logout
   */
  const handleLogoutClick = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo and Brand Title - Always visible, links to homepage */}
          <Link href="/" className="flex items-center gap-3">
            {/* Logo Image - Responsive sizing:
                - Mobile: 40px
                - Small (640px+): 60px
                - Medium (768px+): 48px for better fit with nav
            */}
            <Image 
              src="/images/logo.svg" 
              alt="GCSE Fast Track Logo" 
              width={60} 
              height={60}
              className="w-10 h-10 sm:w-[60px] sm:h-[60px] md:w-12 md:h-12"
            />
            
            {/* Two-tone brand name - Responsive text sizing */}
            <div 
              className="text-xl sm:text-2xl md:text-xl font-bold" 
              style={{ letterSpacing: '-0.02em' }}
            >
              <span style={{ color: '#10B981' }}>GCSE</span>
              <span style={{ color: '#2563EB' }}> FastTrack</span>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile, visible from 768px+ */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6">
            {/* Navigation Links - Compact at md, full size at lg */}
            <Link 
              href="/dashboard" 
              className="text-sm lg:text-base text-gray-700 hover:text-primary transition-all duration-200 font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/about" 
              className="text-sm lg:text-base text-gray-700 hover:text-primary transition-all duration-200 font-medium"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="text-sm lg:text-base text-gray-700 hover:text-primary transition-all duration-200 font-medium"
            >
              Contact Us
            </Link>
            <Link 
              href="/faq" 
              className="text-sm lg:text-base text-gray-700 hover:text-primary transition-all duration-200 font-medium"
            >
              Help/FAQ
            </Link>
            
            {/* Login/Logout Button - Using inline style for reliable color rendering */}
            {!loading && (
              isLoggedIn ? (
                <button 
                  className="flex items-center gap-1.5 text-white px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-semibold cursor-pointer hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md" 
                  style={{ backgroundColor: '#EF4444' }} 
                  onClick={handleLogoutClick}
                  aria-label="Logout from your account"
                >
                  {/* Logout icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Logout
                </button>
              ) : (
                <button 
                  className="flex items-center gap-1.5 text-white px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-semibold cursor-pointer hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md" 
                  style={{ backgroundColor: '#3B82F6' }} 
                  onClick={handleLoginClick}
                  aria-label="Login to your account"
                >
                  {/* Login icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                    />
                  </svg>
                  Login
                </button>
              )
            )}
          </nav>

          {/* Mobile Hamburger Button - Visible only on mobile/tablet, hidden from 768px+ */}
          <button 
            className="md:hidden p-2.5 hover:bg-background-light rounded-md transition-colors flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {/* Animated hamburger/close icon */}
            <svg 
              className="w-6 h-6" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24" 
              stroke="#2563EB"
            >
              {mobileMenuOpen ? (
                // X icon when menu is open
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Hamburger lines when menu is closed
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Fixed position overlay, only visible when open */}
      {mobileMenuOpen && (
        <div className="fixed top-20 right-0 w-56 z-50 md:hidden">
          <div className="bg-white border-l border-b border-gray-200 shadow-xl rounded-bl-lg max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 pb-6 space-y-1">
              
              {/* Home Link - Only in mobile menu */}
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-2.5 text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                  />
                </svg>
                Home
              </Link>

              {/* Dashboard Link */}
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-3 py-2.5 text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
                Dashboard
              </Link>
              
              {/* Visual divider between primary and secondary nav items */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* About Us Link */}
              <Link 
                href="/about" 
                className="flex items-center gap-2 px-3 py-2.5 text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                About Us
              </Link>

              {/* Contact Us Link */}
              <Link 
                href="/contact" 
                className="flex items-center gap-2 px-3 py-2.5 text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                Contact Us
              </Link>

              {/* Help/FAQ Link */}
              <Link 
                href="/faq" 
                className="flex items-center gap-2 px-3 py-2.5 text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50 rounded-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                Help/FAQ
              </Link>
              
              {/* Login/Logout Button - Separated from nav links with padding */}
              {!loading && (
                <div className="pt-3">
                  {isLoggedIn ? (
                    <button 
                      className="w-full text-white px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
                      style={{ backgroundColor: '#EF4444' }}
                      onClick={() => {
                        handleLogoutClick();
                        setMobileMenuOpen(false);
                      }}
                      aria-label="Logout from your account"
                    >
                      {/* Logout icon */}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                      </svg>
                      Logout
                    </button>
                  ) : (
                    <button 
                      className="w-full text-white px-4 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
                      style={{ backgroundColor: '#3B82F6' }}
                      onClick={() => {
                        handleLoginClick();
                        setMobileMenuOpen(false);
                      }}
                      aria-label="Login to your account"
                    >
                      {/* Login icon */}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                        />
                      </svg>
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}