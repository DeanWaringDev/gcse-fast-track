/**
 * Course Progress Banner
 * 
 * Displays overall course progress statistics
 */

import Link from 'next/link';

interface CourseProgressBannerProps {
  completionPercent: number;
  completedLessons: number;
  totalLessons: number;
  strongestLesson: {
    title: string;
    category: string;
    accuracy: number;
  } | null;
  weakestLesson: {
    title: string;
    category: string;
    accuracy: number;
  } | null;
  recommendedNext: {
    title: string;
    slug: string;
    number: string;
  } | null;
}

export default function CourseProgressBanner({
  completionPercent,
  completedLessons,
  totalLessons,
  strongestLesson,
  weakestLesson,
  recommendedNext,
}: CourseProgressBannerProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-800">Course Progress</h2>
          <span className="text-2xl font-bold text-blue-600">{completionPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedLessons} of {totalLessons} lessons completed
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Strongest Area */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="font-bold text-gray-800">Strongest Area</h3>
          </div>
          {strongestLesson ? (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-1">{strongestLesson.category}</p>
              <p className="text-xs text-gray-600 mb-2">{strongestLesson.title}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-full rounded-full"
                    style={{ width: `${strongestLesson.accuracy}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-green-700">{strongestLesson.accuracy}%</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Complete lessons to see stats</p>
          )}
        </div>

        {/* Weakest Area */}
        <div className="bg-linear-to-br from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-bold text-gray-800">Needs Practice</h3>
          </div>
          {weakestLesson ? (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-1">{weakestLesson.category}</p>
              <p className="text-xs text-gray-600 mb-2">{weakestLesson.title}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-orange-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-full rounded-full"
                    style={{ width: `${weakestLesson.accuracy}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-orange-700">{weakestLesson.accuracy}%</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Complete lessons to see stats</p>
          )}
        </div>

        {/* Recommended Next */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <h3 className="font-bold text-gray-800">Continue Learning</h3>
          </div>
          {recommendedNext ? (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-1">Lesson {recommendedNext.number}</p>
              <p className="text-xs text-gray-600 mb-3">{recommendedNext.title}</p>
              <Link
                href={`/courses/maths/lessons/${recommendedNext.slug}`}
                className="inline-block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
              >
                Start Lesson →
              </Link>
            </>
          ) : (
            <p className="text-sm text-gray-500">All lessons completed! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}
