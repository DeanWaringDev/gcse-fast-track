/**
 * Maths Course Info Modal
 * 
 * Displays a slideshow presentation of GCSE Maths course information
 * Designed to convince users to enroll by showing comprehensive course details
 */

'use client';

import { useState, useEffect } from 'react';
import EnrollButton from '@/components/EnrollButton';

interface MathsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MathsInfoModal({ isOpen, onClose }: MathsInfoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') previousSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  // Reset to first slide when modal opens
  useEffect(() => {
    if (isOpen) setCurrentSlide(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const slides = [
    // Slide 1: Welcome
    {
      title: 'Welcome to GCSE Maths',
      content: (
        <div className="text-center">
          <div className="text-7xl mb-6">📐</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            100 Comprehensive Lessons
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            Master GCSE Maths with our structured crash course
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">100</div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
            <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">25</div>
              <div className="text-sm text-gray-600">Free Lessons</div>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">20</div>
              <div className="text-sm text-gray-600">Week Course</div>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 2: Course Structure
    {
      title: 'Course Structure',
      content: (
        <div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800">Foundation Tier</h4>
              </div>
              <p className="text-gray-600 mb-3">Essential content for grades 1-5</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Shape (26 lessons)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Algebra (23 lessons)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Number (19 lessons)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Data (9 lessons)</span>
                </li>
              </ul>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800">Higher Tier</h4>
              </div>
              <p className="text-gray-600 mb-3">Advanced topics for grades 6-9</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Quadratic equations and factorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Advanced trigonometry and circle theorems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Complex probability calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>Multi-step problem solving</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-700">
              <strong className="text-yellow-800">All Exam Boards:</strong> AQA, Edexcel, OCR - Comprehensive coverage for all specifications
            </p>
          </div>
        </div>
      ),
    },
    // Slide 3: What You'll Learn
    {
      title: "What You'll Learn",
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">📐</span> Shape (26 lessons)
            </h4>
            <p className="text-sm text-gray-600">Angles, Polygons, Area, Volume, Perimeter, Pythagoras, Trigonometry, Circle Theorems</p>
            <div className="mt-2 text-xs text-green-600 font-semibold">6 lessons free</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-purple-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">🔢</span> Algebra (23 lessons)
            </h4>
            <p className="text-sm text-gray-600">Basics, Simplifying, Equations, Graphs, Sequences, Quadratics, Inequalities</p>
            <div className="mt-2 text-xs text-green-600 font-semibold">7 lessons free</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">🔢</span> Number (19 lessons)
            </h4>
            <p className="text-sm text-gray-600">BIDMAS, Negatives, Fractions, Decimals, Percentages, Powers, Standard Form</p>
            <div className="mt-2 text-xs text-green-600 font-semibold">8 lessons free</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-orange-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">📊</span> Data (9 lessons)
            </h4>
            <p className="text-sm text-gray-600">Averages, Charts, Scatter Graphs, Cumulative Frequency, Box Plots</p>
            <div className="mt-2 text-xs text-green-600 font-semibold">3 lessons free</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-red-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">🎲</span> Probability (5 lessons)
            </h4>
            <p className="text-sm text-gray-600">Basic Probability, Tree Diagrams, Venn Diagrams, Conditional Probability</p>
            <div className="mt-2 text-xs text-green-600 font-semibold">1 lesson free</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-indigo-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">📝</span> Exam Practice (6 lessons)
            </h4>
            <p className="text-sm text-gray-600">Foundation & Higher Mock Exams, Final Confidence Check</p>
            <div className="mt-2 text-xs text-gray-500 font-semibold">Premium only</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-cyan-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">🔄</span> Mixed Practice (5 lessons)
            </h4>
            <p className="text-sm text-gray-600">Cross-topic integration and exam-style questions</p>
            <div className="mt-2 text-xs text-gray-500 font-semibold">Premium only</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-pink-500">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-2xl">💡</span> Problem Solving (4 lessons)
            </h4>
            <p className="text-sm text-gray-600">Units, Time, Money, Multi-step Problems</p>
            <div className="mt-2 text-xs text-gray-500 font-semibold">Premium only</div>
          </div>
        </div>
      ),
    },
    // Slide 4: Why This Course
    {
      title: 'Why Choose This Course?',
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4 bg-linear-to-r from-blue-50 to-blue-100 p-5 rounded-xl">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Structured Learning Path</h4>
              <p className="text-sm text-gray-600">100 lessons carefully ordered to build your knowledge step by step, from basics to advanced topics.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-linear-to-r from-green-50 to-green-100 p-5 rounded-xl">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Try Before You Buy</h4>
              <p className="text-sm text-gray-600">25 completely free lessons to experience the quality and teaching style before committing.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-linear-to-r from-purple-50 to-purple-100 p-5 rounded-xl">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Exam-Focused Content</h4>
              <p className="text-sm text-gray-600">Every lesson designed to help you pass your GCSE exams with confidence and achieve your target grade.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 bg-linear-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Learn at Your Own Pace</h4>
              <p className="text-sm text-gray-600">Complete the course in 20 weeks or go faster - full lifetime access to all content.</p>
            </div>
          </div>
        </div>
      ),
    },
    // Slide 5: Ready to Start
    {
      title: 'Ready to Start?',
      content: (
        <div className="text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Begin Your Journey Today
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students achieving their GCSE goals with our proven crash course methodology.
          </p>
          <div className="bg-linear-to-br from-green-50 to-emerald-50 p-8 rounded-2xl max-w-md mx-auto mb-6 border-2 border-green-200">
            <div className="text-5xl font-bold text-green-600 mb-2">FREE</div>
            <div className="text-xl text-gray-700 mb-4">First 25 Lessons</div>
            <ul className="text-left space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Instant access to quality content
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full access to foundation topics
              </li>
            </ul>
            <EnrollButton
              courseSlug="maths"
              courseName="Maths"
              variant="modal"
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-500">Start with 25 free lessons, upgrade anytime for full access</p>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div
          className="px-8 py-6 text-white relative"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #1E40AF)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold">{slides[currentSlide].title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm opacity-90">Slide {currentSlide + 1} of {slides.length}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {slides[currentSlide].content}
        </div>

        {/* Navigation */}
        <div className="px-8 py-6 bg-gray-50 border-t flex items-center justify-between">
          <button
            onClick={previousSlide}
            disabled={currentSlide === 0}
            className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-blue-600' : 'w-2.5 bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
