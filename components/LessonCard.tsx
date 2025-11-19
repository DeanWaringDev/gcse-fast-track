/**
 * Lesson Card Component
 * 
 * Displays individual lesson with progress indicators
 */

import Link from 'next/link';

interface LessonCardProps {
  lesson: {
    id: number;
    number: string;
    slug: string;
    title: string;
    category: string;
    tier: string;
    difficulty: string;
    isFree: boolean;
    estimatedMinutes: number;
    topicsCovered: string[];
    contentReady?: boolean;
  };
  progress?: {
    is_completed: boolean;
    lesson_completed: boolean;
    accuracy_score: number | null;
  } | null;
  isLocked: boolean;
  courseSlug: string;
}

export default function LessonCard({ lesson, progress, isLocked, courseSlug }: LessonCardProps) {
  const isCompleted = progress?.is_completed || false;
  const lessonCompleted = progress?.lesson_completed || false;
  const accuracy = progress?.accuracy_score || null;
  const isContentReady = lesson.contentReady !== false; // Default to true if not specified

  // Determine card styling based on status
  const getCardStyle = () => {
    if (isCompleted) {
      return 'bg-green-50 border-green-200 border-2';
    }
    if (isLocked) {
      return 'bg-gray-100 border-gray-300 border opacity-60';
    }
    return 'bg-white border-gray-200 border-2 hover:border-blue-400';
  };

  const getDifficultyColor = () => {
    switch (lesson.difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const content = (
    <div className={`rounded-lg p-4 transition-all relative ${getCardStyle()} ${!isLocked && isContentReady ? 'hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'}`}>
      {/* Green Tick for Completed Lessons */}
      {lessonCompleted && (
        <div className="absolute bottom-3 left-3 z-20">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Coming Soon Overlay */}
      {!isContentReady && (
        <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
              COMING SOON
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500">#{lesson.number}</span>
          {lesson.isFree && (
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
              FREE
            </span>
          )}
        </div>
        {isLocked && (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        {isCompleted && (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">
        {lesson.title}
      </h3>

      {/* Category & Tier */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-600">{lesson.category}</span>
        <span className="text-xs text-gray-400">•</span>
        <span className="text-xs text-gray-600">{lesson.tier}</span>
      </div>

      {/* Topics Covered */}
      {lesson.topicsCovered && lesson.topicsCovered.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-1">
            {lesson.topicsCovered.slice(0, 3).map((topic, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
              >
                {topic}
              </span>
            ))}
            {lesson.topicsCovered.length > 3 && (
              <span className="text-xs text-gray-500 px-1 py-0.5">
                +{lesson.topicsCovered.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Difficulty & Time */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getDifficultyColor()}`}>
          {lesson.difficulty}
        </span>
        <span className="text-xs text-gray-500">{lesson.estimatedMinutes} min</span>
      </div>

      {/* Accuracy Score */}
      {accuracy !== null && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-700">Accuracy</span>
            <span className="text-xs font-bold text-blue-600">{accuracy}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  // If locked or content not ready, return non-clickable div
  if (isLocked || !isContentReady) {
    return content;
  }

  // Otherwise, wrap in Link
  return (
    <Link href={`/courses/${courseSlug}/lessons/${lesson.slug}`}>
      {content}
    </Link>
  );
}
