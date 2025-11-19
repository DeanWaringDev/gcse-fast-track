/**
 * Footer Component
 * 
 * A compact, professional footer for the GCSE Fast Track application.
 * Features dark blue background (#1E3A8A) with light text for visual contrast.
 * Fully responsive with mobile-first design.
 * 
 * Responsive Breakpoints:
 * - Mobile (<640px): 2 columns - Legal links split, Support spans 2 columns
 * - Small (640px+): 3 columns - Legal split across first 2, Support in third
 * - All sizes: Compact spacing to minimize footer height
 * 
 * Sections:
 * - Legal (Privacy Policy, Terms of Service, Cookie Policy, Acceptable Use)
 * - Support (Email Support link to Contact page)
 * - Copyright notice with dynamic year
 * - Developer attribution (DeanWaringDev)
 * 
 * @component
 */

import Link from 'next/link';

export default function Footer() {
  // Dynamic year for copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1E3A8A] text-white border-t border-blue-900">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 
          Grid layout: 
          - Mobile: 2 columns (Legal split, Support spans both)
          - 640px+: 3 columns (Legal in first 2, Support in third)
          - max-w-2xl keeps content centered and compact
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          
          {/* Legal Section - First Half (Privacy & Terms) */}
          <div>
            <h3 className="text-sm font-bold mb-3">Legal</h3>
            <ul className="space-y-1.5">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-blue-200 hover:text-white transition-colors text-xs"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-blue-200 hover:text-white transition-colors text-xs"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section - Second Half (Cookie & Acceptable Use) */}
          {/* pt-7 on sm+ aligns with links below "Legal" heading */}
          <div className="sm:pt-7">
            <ul className="space-y-1.5">
              <li>
                <Link 
                  href="/cookies" 
                  className="text-blue-200 hover:text-white transition-colors text-xs"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/acceptable-use" 
                  className="text-blue-200 hover:text-white transition-colors text-xs"
                >
                  Acceptable Use Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          {/* col-span-2 on mobile (full width below legal), col-span-1 on sm+ (third column) */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-sm font-bold mb-3">Support</h3>
            <Link 
              href="/contact" 
              className="text-blue-200 hover:text-white transition-colors text-xs flex items-center gap-2"
              aria-label="Contact support via email"
            >
              {/* Email icon */}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
              Email Support
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright & Attribution */}
      <div className="border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Flex layout: stacks on mobile, horizontal on sm+ */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            
            {/* Copyright Notice with dynamic year */}
            <p className="text-blue-200 text-xs text-center sm:text-left">
              © {currentYear} GCSE FastTrack. All rights reserved.
            </p>
            
            {/* Developer Attribution */}
            <p className="text-blue-200 text-xs text-center sm:text-right">
              Created by{' '}
              <a 
                href="https://deanwaringdev.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-100 font-semibold transition-colors"
              >
                DeanWaringDev
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
