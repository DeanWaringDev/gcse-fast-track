'use client';

/**
 * Dashboard Page
 * 
 * Comprehensive learning dashboard featuring:
 * - Personalized welcome with user stats
 * - Real-time grade predictions based on performance
 * - Target grade setting with Foundation/Higher tier options
 * - Paper tier recommendations based on performance
 * - Study streak tracking and gamification
 * - Course progress overview with visual indicators
 * - Weak areas identification and recommendations
 * - Daily study time tracking
 * - Achievement badges and milestones
 * - Quick action cards for resuming learning
 * 
 * @page
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import SetTargetGradeModal from '@/components/SetTargetGradeModal';
import WithdrawModal from '@/components/WithdrawModal';
import { formatGradeWithTier, getGradeDescription } from '@/lib/gradePrediction';
import { hasTwoTiers } from '@/lib/courseConfig';

interface EnrollmentData {
  id: string;
  course_slug: string;
  course_name: string;
  enrolled_at: string;
  subscription_tier: string;
  lessons_completed: number;
  total_lessons: number;
  overall_accuracy: number;
  time_spent_minutes: number;
  study_streak_days: number;
  target_paper: 'foundation' | 'higher' | 'none';
  target_grade: number;
  predicted_grade: number | null;
  recommended_paper?: 'foundation' | 'higher';
  paper_change_reason?: string;
  confidence?: 'low' | 'medium' | 'high';
  on_track?: boolean;
  next_lesson_slug: string | null;
  next_lesson_title: string | null;
  weakest_category: string | null;
  strongest_category: string | null;
  color: string;
  icon: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [totalLessonsCompleted, setTotalLessonsCompleted] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<EnrollmentData | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const supabase = createClient();

    // Check authentication
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    setUser(authUser);

    // Load enrollments with progress data
    const { data: enrollmentData } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', authUser.id)
      .eq('status', 'active');

    if (!enrollmentData || enrollmentData.length === 0) {
      setIsLoading(false);
      return;
    }

    // Load detailed stats for each enrollment
    const enrichedEnrollments: EnrollmentData[] = [];
    let totalTime = 0;
    let totalCompleted = 0;
    let maxStreak = 0;

    for (const enrollment of enrollmentData) {
      // Get lesson progress for this course
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('course_slug', enrollment.course_slug);

      // Calculate stats
      const completedLessons = progressData?.filter(p => p.is_completed).length || 0;
      const totalLessons = 100; // All courses have 100 lessons

      // Calculate overall accuracy
      const lessonsWithScores = progressData?.filter(p => p.accuracy_score !== null) || [];
      const overallAccuracy = lessonsWithScores.length > 0
        ? Math.round(lessonsWithScores.reduce((sum, p) => sum + (p.accuracy_score || 0), 0) / lessonsWithScores.length)
        : 0;

      // Calculate total time spent
      const timeSpent = progressData?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0;
      totalTime += timeSpent;

      // Find next lesson
      const nextLesson = progressData?.find(p => !p.is_completed);

      // Find weakest and strongest categories (we'd need category data from lessons)
      const weakestCategory = lessonsWithScores.length > 0 
        ? lessonsWithScores.sort((a, b) => (a.accuracy_score || 0) - (b.accuracy_score || 0))[0]
        : null;

      const strongestCategory = lessonsWithScores.length > 0
        ? lessonsWithScores.sort((a, b) => (b.accuracy_score || 0) - (a.accuracy_score || 0))[0]
        : null;

      // Predict grade based on accuracy
      let predictedGrade = 'U';
      if (overallAccuracy >= 90) predictedGrade = '9';
      else if (overallAccuracy >= 85) predictedGrade = '8';
      else if (overallAccuracy >= 75) predictedGrade = '7';
      else if (overallAccuracy >= 65) predictedGrade = '6';
      else if (overallAccuracy >= 55) predictedGrade = '5';
      else if (overallAccuracy >= 45) predictedGrade = '4';
      else if (overallAccuracy >= 35) predictedGrade = '3';
      else if (overallAccuracy >= 25) predictedGrade = '2';
      else if (overallAccuracy >= 15) predictedGrade = '1';

      // Get course metadata
      const courseColors: Record<string, string> = {
        maths: '#3B82F6',
        computerscience: '#8B5CF6',
        englishlanguage: '#EF4444',
      };

      const courseIcons: Record<string, string> = {
        maths: '📐',
        computerscience: '💻',
        englishlanguage: '📝',
      };

      const courseNames: Record<string, string> = {
        maths: 'Maths',
        computerscience: 'Computer Science',
        englishlanguage: 'English Language',
      };

      // Streak is calculated globally, not per course
      // We'll fetch it separately

      totalCompleted += completedLessons;

      // Determine default paper tier
      let defaultPaper: 'foundation' | 'higher' | 'none' = 'none';
      if (hasTwoTiers(enrollment.course_slug)) {
        defaultPaper = 'foundation';
      }

      enrichedEnrollments.push({
        id: enrollment.id,
        course_slug: enrollment.course_slug,
        course_name: courseNames[enrollment.course_slug] || enrollment.course_slug,
        enrolled_at: enrollment.enrolled_at,
        subscription_tier: enrollment.subscription_tier,
        lessons_completed: completedLessons,
        total_lessons: totalLessons,
        overall_accuracy: overallAccuracy,
        time_spent_minutes: timeSpent,
        study_streak_days: 0, // Will be set globally
        target_paper: enrollment.target_paper || defaultPaper,
        target_grade: enrollment.target_grade || 4,
        predicted_grade: null, // Will be loaded from predictions API
        next_lesson_slug: nextLesson?.lesson_slug || null,
        next_lesson_title: null, // Would need to fetch from lessons.json
        weakest_category: null,
        strongest_category: null,
        color: courseColors[enrollment.course_slug] || '#6366F1',
        icon: courseIcons[enrollment.course_slug] || '📚',
      });
    }

    setEnrollments(enrichedEnrollments);
    setTotalStudyTime(totalTime);
    setTotalLessonsCompleted(totalCompleted);

    // Fetch actual study streak from API
    try {
      const streakResponse = await fetch('/api/study-streak');
      if (streakResponse.ok) {
        const { streak } = await streakResponse.json();
        setCurrentStreak(streak);
        maxStreak = streak;
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
      setCurrentStreak(0);
    }

    // Fetch grade predictions from API
    try {
      const predictionsResponse = await fetch('/api/grade-predictions');
      if (predictionsResponse.ok) {
        const { predictions } = await predictionsResponse.json();
        
        // Update enrollments with predictions
        const updatedEnrollments = enrichedEnrollments.map(enrollment => {
          const prediction = predictions.find(
            (p: any) => p.courseSlug === enrollment.course_slug
          );
          
          if (prediction) {
            return {
              ...enrollment,
              predicted_grade: prediction.predictedGrade,
              recommended_paper: prediction.recommendedPaper,
              paper_change_reason: prediction.paperChangeReason,
              confidence: prediction.confidence,
              on_track: prediction.onTrack
            };
          }
          return enrollment;
        });
        
        setEnrollments(updatedEnrollments);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }

    // Calculate achievements based on actual data
    const userAchievements = [];
    if (totalCompleted >= 1) userAchievements.push('First Steps');
    if (totalCompleted >= 10) userAchievements.push('Getting Started');
    if (totalCompleted >= 25) userAchievements.push('Quarter Century');
    if (totalCompleted >= 50) userAchievements.push('Half Way There');
    if (totalCompleted >= 100) userAchievements.push('Centurion');
    if (totalTime >= 60) userAchievements.push('Hour Scholar');
    if (totalTime >= 300) userAchievements.push('Time Master');
    if (maxStreak >= 3) userAchievements.push('On Fire 🔥');
    if (maxStreak >= 7) userAchievements.push('Week Warrior');

    setAchievements(userAchievements);
    setIsLoading(false);
  }

  async function handleSaveTargetGrade(
    paper: 'foundation' | 'higher' | 'none',
    grade: number
  ) {
    if (!selectedCourse) return;

    const supabase = createClient();
    
    // Update enrollment in database
    const { error } = await supabase
      .from('enrollments')
      .update({
        target_paper: paper,
        target_grade: grade
      })
      .eq('id', selectedCourse.id);

    if (error) {
      console.error('Error updating target grade:', error);
      throw error;
    }

    // Reload dashboard to refresh predictions
    await loadDashboard();
  }

  async function handleWithdrawCourse() {
    if (!selectedCourse) return;

    try {
      const response = await fetch('/api/withdraw-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: selectedCourse.course_slug })
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw');
      }

      // Reload dashboard to remove withdrawn course
      await loadDashboard();
    } catch (error) {
      console.error('Withdrawal error:', error);
      throw error;
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get display name from user metadata (stored by Supabase Auth)
  const displayName = user?.user_metadata?.display_name 
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0] 
    || 'Student';
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening';

  // No enrollments state
  if (enrollments.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Welcome Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Good {timeOfDay}, {displayName}! 👋
            </h1>
            <p className="text-gray-600 text-lg">Ready to start your GCSE journey?</p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">📚</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No Courses Yet</h2>
              <p className="text-gray-600 text-lg mb-8">
                You haven't enrolled in any courses yet. Start learning today with our comprehensive GCSE courses!
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const overallProgress = Math.round((totalLessonsCompleted / (enrollments.length * 100)) * 100);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Good {timeOfDay}, {displayName}! 👋
              </h1>
              <p className="text-indigo-100 text-lg">
                {currentStreak > 0 ? `🔥 ${currentStreak} day streak! Keep it up!` : "Let's make today count!"}
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold">{totalLessonsCompleted}</div>
                <div className="text-sm text-indigo-100">Lessons Completed</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                <div className="text-3xl font-bold">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</div>
                <div className="text-sm text-indigo-100">Study Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Overall Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Overall Progress</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{overallProgress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-linear-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Study Streak */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Study Streak</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{currentStreak} days</div>
            <p className="text-sm text-gray-500">
              {currentStreak >= 7 ? "Amazing consistency!" : "Keep practicing daily!"}
            </p>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Achievements</h3>
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{achievements.length}</div>
            <p className="text-sm text-gray-500">Badges earned</p>
          </div>

          {/* Active Courses */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-600">Active Courses</h3>
              <span className="text-2xl">📚</span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-2">{enrollments.length}</div>
            <p className="text-sm text-gray-500">
              {enrollments.filter(e => e.subscription_tier === 'premium').length} premium
            </p>
          </div>
        </div>

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏆</span> Your Achievements
            </h2>
            <div className="flex flex-wrap gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-linear-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg px-4 py-2 font-semibold text-gray-800 flex items-center gap-2"
                >
                  <span className="text-xl">🎖️</span>
                  {achievement}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Course Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Courses</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => {
              const progressPercent = Math.round((enrollment.lessons_completed / enrollment.total_lessons) * 100);

              return (
                <div
                  key={enrollment.course_slug}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                >
                  {/* Course Header */}
                  <div
                    className="p-6 text-white"
                    style={{ background: `linear-gradient(135deg, ${enrollment.color} 0%, ${enrollment.color}dd 100%)` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-4xl mb-2">{enrollment.icon}</div>
                        <h3 className="text-2xl font-bold mb-1">{enrollment.course_name}</h3>
                        <p className="text-white/80 text-sm mb-2">
                          {enrollment.subscription_tier === 'premium' ? '⭐ Premium Access' : '🆓 Free Access'}
                        </p>
                        {/* Target Grade */}
                        <button
                          onClick={() => {
                            setSelectedCourse(enrollment);
                            setShowTargetModal(true);
                          }}
                          className="text-sm bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-lg transition-all"
                        >
                          🎯 Target: Grade {enrollment.target_grade}
                          {hasTwoTiers(enrollment.course_slug) && ` (${enrollment.target_paper === 'foundation' ? 'Foundation' : 'Higher'})`}
                        </button>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                        <div className="text-3xl font-bold">
                          {enrollment.predicted_grade !== null ? enrollment.predicted_grade : '?'}
                        </div>
                        <div className="text-xs text-white/80">Predicted</div>
                        {enrollment.confidence && (
                          <div className="text-xs text-white/60 mt-1">
                            {enrollment.confidence === 'high' ? '✓✓✓' : enrollment.confidence === 'medium' ? '✓✓' : '✓'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Paper Recommendation Alert */}
                    {enrollment.recommended_paper && 
                     enrollment.recommended_paper !== enrollment.target_paper && 
                     enrollment.paper_change_reason && (
                      <div className="mt-4 bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-xl">💡</span>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">Recommendation</div>
                            <div className="text-xs text-white/90 mt-1">
                              {enrollment.paper_change_reason}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCourse(enrollment);
                                setShowTargetModal(true);
                              }}
                              className="text-xs font-semibold mt-2 underline hover:no-underline"
                            >
                              Update Target →
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* On Track Indicator */}
                    {enrollment.on_track !== undefined && (
                      <div className={`mt-3 text-sm flex items-center gap-2 ${enrollment.on_track ? 'text-green-200' : 'text-yellow-200'}`}>
                        <span>{enrollment.on_track ? '✓' : '⚠️'}</span>
                        <span>{enrollment.on_track ? 'On track for target grade' : 'Need more practice to reach target'}</span>
                      </div>
                    )}
                  </div>

                  {/* Course Stats */}
                  <div className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-600">Progress</span>
                        <span className="text-sm font-bold text-gray-800">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPercent}%`,
                            background: `linear-gradient(90deg, ${enrollment.color} 0%, ${enrollment.color}dd 100%)`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {enrollment.lessons_completed} / {enrollment.total_lessons} lessons
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.floor(enrollment.time_spent_minutes / 60)}h {enrollment.time_spent_minutes % 60}m studied
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: enrollment.color }}>
                          {enrollment.overall_accuracy}%
                        </div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: enrollment.color }}>
                          {currentStreak}
                        </div>
                        <div className="text-xs text-gray-500">Day Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: enrollment.color }}>
                          {enrollment.total_lessons - enrollment.lessons_completed}
                        </div>
                        <div className="text-xs text-gray-500">Remaining</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/courses/${enrollment.course_slug}`}
                        className="flex-1 py-3 rounded-xl font-bold text-white text-center block transition-all transform hover:scale-105 cursor-pointer"
                        style={{ background: `linear-gradient(135deg, ${enrollment.color} 0%, ${enrollment.color}dd 100%)` }}
                      >
                        Continue Learning →
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedCourse(enrollment);
                          setShowWithdrawModal(true);
                        }}
                        className="w-12 h-12 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer flex items-center justify-center"
                        title="Withdraw from course"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">➕</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Add More Courses</h3>
            <p className="text-gray-600 text-sm">Explore and enroll in more subjects</p>
          </Link>

          <Link
            href="/about"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">📖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Study Tips</h3>
            <p className="text-gray-600 text-sm">Learn effective study strategies</p>
          </Link>

          <Link
            href="/help"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">❓</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm">Get support and answers</p>
          </Link>
        </div>
      </div>

      {/* Target Grade Modal */}
      {selectedCourse && (
        <>
          <SetTargetGradeModal
            isOpen={showTargetModal}
            onClose={() => {
              setShowTargetModal(false);
              setSelectedCourse(null);
            }}
            courseSlug={selectedCourse.course_slug}
            courseName={selectedCourse.course_name}
            currentPaper={selectedCourse.target_paper}
            currentGrade={selectedCourse.target_grade}
            onSave={handleSaveTargetGrade}
          />
          <WithdrawModal
            isOpen={showWithdrawModal}
            onClose={() => {
              setShowWithdrawModal(false);
              setSelectedCourse(null);
            }}
            courseName={selectedCourse.course_name}
            onConfirm={handleWithdrawCourse}
          />
        </>
      )}
    </div>
  );
}
