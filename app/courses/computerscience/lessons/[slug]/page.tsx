'use client';

/**
 * Dynamic Lesson Page - Computer Science
 * 
 * Displays lesson dashboard and practice options
 * Works for all 100 lessons based on slug parameter
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import lessonsData from '@/public/data/computerscience/computerscience_lessons.json';
import LessonDashboard from '@/components/LessonDashboard';
import LessonContentModal from '@/components/LessonContentModal';
import PracticeSession from '@/components/PracticeSession';

interface LessonProgress {
  lesson_id: number;
  lesson_slug: string;
  is_completed: boolean;
  lesson_completed: boolean;
  lesson_completed_at: string | null;
  accuracy_score: number | null;
  time_spent_minutes: number;
  attempts: number;
  last_attempt_at: string | null;
  confidence_level: number | null;
  practice_perfect?: boolean;
  timed_perfect?: boolean;
  expert_perfect?: boolean;
}

interface QuestionAttempt {
  question_id: string;
  is_correct: boolean;
  attempt_count: number;
}

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null);
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>([]);
  const [showContentModal, setShowContentModal] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  // Find the lesson from lessons.json
  const lesson = lessonsData.lessons.find(l => l.slug === slug);

  useEffect(() => {
    if (!lesson) {
      router.push('/courses/computerscience');
      return;
    }
    checkAccess();
  }, [lesson]);

  async function checkAccess() {
    if (!lesson) return;

    const supabase = createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      router.push(`/login?redirect=/courses/computerscience/lessons/${slug}`);
      return;
    }

    // Check enrollment
    const { data: enrollmentData } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', 'computerscience')
      .eq('status', 'active')
      .single();

    if (!enrollmentData) {
      router.push('/?error=not-enrolled');
      return;
    }

    setEnrollment(enrollmentData);

    // Check if lesson is accessible (free or premium)
    const isPremium = enrollmentData.subscription_tier === 'premium';
    if (!lesson.isFree && !isPremium) {
      router.push('/courses/computerscience?error=premium-required');
      return;
    }

    // Get lesson progress
    const { data: progressData } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', 'computerscience')
      .eq('lesson_id', lesson.id)
      .single();

    // Get practice session count (only completed sessions)
    const { count: sessionCount } = await supabase
      .from('practice_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('course_slug', 'computerscience')
      .eq('lesson_id', lesson.id)
      .not('completed_at', 'is', null);

    // Update progress with session count
    if (progressData) {
      progressData.attempts = sessionCount || 0;
    }
    
    setLessonProgress(progressData);

    // Get unique question attempts (most recent attempt per question)
    const { data: attemptsData } = await supabase
      .from('question_attempts')
      .select('question_id, is_correct')
      .eq('user_id', user.id)
      .eq('course_slug', 'computerscience')
      .eq('lesson_id', lesson.id)
      .order('attempted_at', { ascending: false });

    // Get unique questions (most recent attempt for each)
    const uniqueAttempts = new Map();
    attemptsData?.forEach(attempt => {
      if (!uniqueAttempts.has(attempt.question_id)) {
        uniqueAttempts.set(attempt.question_id, {
          question_id: attempt.question_id,
          is_correct: attempt.is_correct,
          attempt_count: 1,
        });
      }
    });
    
    setQuestionAttempts(Array.from(uniqueAttempts.values()));

    setIsLoading(false);
  }

  async function refreshProgress() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !lesson) return;

    const { data: progressData } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', 'computerscience')
      .eq('lesson_id', lesson.id)
      .single();

    // Get updated session count (only completed sessions)
    const { count: sessionCount } = await supabase
      .from('practice_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('course_slug', 'computerscience')
      .eq('lesson_id', lesson.id)
      .not('completed_at', 'is', null);

    // Update progress with session count
    if (progressData) {
      progressData.attempts = sessionCount || 0;
    }

    setLessonProgress(progressData);

    // Refresh question attempts to update Questions Attempted count
    const { data: attemptsData } = await supabase
      .from('question_attempts')
      .select('question_id, is_correct')
      .eq('user_id', user.id)
      .eq('course_slug', 'computerscience')
      .eq('lesson_id', lesson.id)
      .order('attempted_at', { ascending: false });

    // Get unique questions (most recent attempt for each)
    const uniqueAttempts = new Map();
    attemptsData?.forEach(attempt => {
      if (!uniqueAttempts.has(attempt.question_id)) {
        uniqueAttempts.set(attempt.question_id, {
          question_id: attempt.question_id,
          is_correct: attempt.is_correct,
          attempt_count: 1,
        });
      }
    });
    
    setQuestionAttempts(Array.from(uniqueAttempts.values()));
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  const isPremium = enrollment?.subscription_tier === 'premium';
  const hasContentReady = lesson.contentReady !== false;

  // Calculate weak areas (questions answered incorrectly)
  const weakQuestions = questionAttempts.filter(q => !q.is_correct && q.attempt_count > 0);
  const hasWeakAreas = weakQuestions.length >= 10;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/courses/computerscience')}
            className="flex items-center gap-2 text-indigo-100 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-indigo-200 font-semibold">#{lesson.number}</span>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-indigo-100">
            <span>{lesson.category}</span>
            <span>•</span>
            <span>{lesson.difficulty}</span>
            <span>•</span>
            <span>{lesson.estimatedMinutes} minutes</span>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <LessonDashboard
          lesson={lesson}
          progress={lessonProgress}
          questionAttempts={questionAttempts}
        />
      </div>

      {/* Practice Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Practice Options</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Lesson Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200 relative">
            {lessonProgress?.lesson_completed && (
              <div className="absolute top-4 right-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Lesson Content</h3>
                <p className="text-sm text-gray-500">Learn the concepts</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Interactive slideshow covering all key topics and examples
            </p>
            <button
              onClick={() => setShowContentModal(true)}
              disabled={!hasContentReady}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                hasContentReady
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {!hasContentReady ? 'Coming Soon' : lessonProgress?.lesson_completed ? 'Review Lesson' : 'Start Lesson'}
            </button>
          </div>

          {/* Practice Questions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">Practice Questions</h3>
                <p className="text-sm text-gray-500">10 questions</p>
              </div>
              {lessonProgress?.practice_perfect && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Random selection from 30 practice questions to test your understanding
            </p>
            <button
              onClick={() => setActiveMode('practice')}
              disabled={!hasContentReady}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                hasContentReady
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {hasContentReady ? 'Start Practice' : 'Coming Soon'}
            </button>
          </div>

          {/* Timed Challenge */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">Timed Challenge</h3>
                <p className="text-sm text-gray-500">15 questions • 15 mins</p>
              </div>
              {lessonProgress?.timed_perfect && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Race against the clock! Build speed and accuracy under pressure
            </p>
            <button
              onClick={() => setActiveMode('timed')}
              disabled={!hasContentReady}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                hasContentReady
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {hasContentReady ? 'Start Challenge' : 'Coming Soon'}
            </button>
          </div>

          {/* Expert Mode */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">Expert Mode</h3>
                <p className="text-sm text-gray-500">15 questions</p>
              </div>
              {lessonProgress?.expert_perfect && (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Advanced questions (150-300) for students aiming for top grades
            </p>
            <button
              onClick={() => setActiveMode('expert')}
              disabled={!hasContentReady}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                hasContentReady
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {hasContentReady ? 'Start Expert Mode' : 'Coming Soon'}
            </button>
          </div>

          {/* Weak Areas */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Weak Areas</h3>
                <p className="text-sm text-gray-500">10 questions</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Focus on questions you've previously gotten wrong to improve
            </p>
            <button
              onClick={() => setActiveMode('weak_areas')}
              disabled={!hasWeakAreas}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                hasWeakAreas
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {hasWeakAreas ? 'Practice Weak Areas' : 'No Weak Areas Yet'}
            </button>
          </div>

          {/* Download Worksheet */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Worksheet</h3>
                <p className="text-sm text-gray-500">PDF Download</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Download printable worksheet with answers for offline practice
            </p>
            <button
              disabled={!lesson.files?.worksheet}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                lesson.files?.worksheet
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {lesson.files?.worksheet ? 'Download Worksheet' : 'Coming Soon'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Modal */}
      {showContentModal && hasContentReady && (
        <LessonContentModal
          lesson={lesson}
          courseSlug="computerscience"
          lessonSlug={slug}
          onClose={() => setShowContentModal(false)}
          onComplete={refreshProgress}
        />
      )}

      {/* Practice Session */}
      {activeMode && lesson && lesson.files && (
        <PracticeSession
          courseSlug="computerscience"
          lessonId={lesson.id}
          lessonSlug={slug}
          lessonTitle={lesson.title}
          questionsFile={lesson.files.questions || ''}
          answersFile={lesson.files.answers || ''}
          practiceMode={activeMode as 'practice' | 'timed' | 'expert' | 'weak_areas'}
          onComplete={() => {
            setActiveMode(null);
            refreshProgress();
          }}
          onClose={() => setActiveMode(null)}
        />
      )}
    </div>
  );
}
