/**
 * Homepage (Landing Page)
 * 
 * Main entry point for GCSE FastTrack application.
 * Features hero section highlighting the 100-lesson crash course program.
 * 
 * Features:
 * - Hero section with value proposition
 * - 100 lesson plan details
 * - Free access information (25 lessons free)
 * - Call-to-action buttons
 * - Feature highlights
 * - Dynamic course cards from JSON
 * - Responsive design
 * 
 * @page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import coursesData from '@/public/data/courses.json';
import MathsInfoModal from '@/components/MathsInfoModal';
import ComputerScienceInfoModal from '@/components/ComputerScienceInfoModal';
import EnrollButton from '@/components/EnrollButton';

export default function Home() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Hero Content */}
          <div className="text-center">
            
            {/* Badge/Label */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-semibold text-sm">Complete GCSE Preparation - All Subjects</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Master Your GCSEs
              <br />
              <span className="text-yellow-300">100 Lessons</span> Per Subject
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Comprehensive crash courses across all major GCSE subjects. From basics to exam-ready in record time.
            </p>

            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">100</div>
                <div className="text-white/80 text-sm font-medium">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">25</div>
                <div className="text-white/80 text-sm font-medium">Free Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-1">100%</div>
                <div className="text-white/80 text-sm font-medium">Exam Focused</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
              <Link
                href="/signup"
                className="px-8 py-3 bg-yellow-400 text-purple-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl"
              >
                Start Free Lessons
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
              >
                Learn More
              </Link>
            </div>

            {/* Trust Badge */}
            <p className="text-white/70 text-sm">
              ✓ No credit card required • ✓ Start learning immediately
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Available Courses
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your course and start learning today
            </p>
          </div>

          {/* Course Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesData.courses.map((course) => (
              <div
                key={course.id}
                className="relative bg-gray-50 rounded-xl p-5 hover:shadow-xl transition-all transform hover:scale-105"
              >
                {/* Info Icon for Ready Courses */}
                {course.contentReady && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenModal(course.slug);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10 border-2 border-gray-200 hover:border-gray-300"
                    aria-label="Course information"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}

                {/* Coming Soon Badge */}
                {!course.contentReady && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                    COMING SOON
                  </div>
                )}

                {/* Course Content */}
                <div>
                  {/* Course Icon */}
                  <div 
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-3xl mb-3"
                    style={{ backgroundColor: `${course.color}15` }}
                  >
                    {course.icon}
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.course_name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-gray-600 text-sm mb-3">
                    {course.short_description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>{course.total_lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      <span>{course.free_lessons} free</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  {course.contentReady ? (
                    <EnrollButton
                      courseSlug={course.slug}
                      courseName={course.course_name}
                      courseColor={course.color}
                      variant="card"
                    />
                  ) : (
                    <button
                      className="w-full py-2.5 rounded-lg font-bold text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                      disabled
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Why Choose Our Crash Courses?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Every lesson is carefully crafted to build your knowledge systematically across all subjects.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-shadow border-2 border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Structured Curriculum</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                100 lessons per subject, organized in logical progression from foundational concepts to advanced topics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-shadow border-2 border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">25 Free Lessons</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Start immediately with 25 free lessons. Experience the quality before committing.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl transition-shadow border-2 border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fast-Track Learning</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Our crash course methodology gets you exam-ready quickly across all your GCSE subjects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Join students mastering their GCSEs with our proven 100-lesson system across all subjects.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl"
          >
            Get Started Free Today
          </Link>
        </div>
      </section>

      {/* Course Info Modals */}
      <MathsInfoModal 
        isOpen={openModal === 'maths'} 
        onClose={() => setOpenModal(null)} 
      />
      <ComputerScienceInfoModal 
        isOpen={openModal === 'computer-science'} 
        onClose={() => setOpenModal(null)} 
      />

    </div>
  );
}
