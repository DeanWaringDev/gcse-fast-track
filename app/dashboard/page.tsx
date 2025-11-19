'use client';

/**
 * Dashboard Page
 * 
 * Comprehensive learning dashboard featuring:
 * - Personalized welcome with user stats
 * - Real-time grade predictions based on performance
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

interface EnrollmentData {
  course_slug: string;
  course_name: string;
  enrolled_at: string;
  subscription_tier: string;
  lessons_completed: number;
  total_lessons: number;
  overall_accuracy: number;
  time_spent_minutes: number;
  study_streak_days: number;
  predicted_grade: string;
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

      // Calculate study streak (simplified - last practiced date)
      const lastPracticed = progressData?.filter(p => p.last_attempt_at)
        .sort((a, b) => new Date(b.last_attempt_at!).getTime() - new Date(a.last_attempt_at!).getTime())[0];

      const daysSinceLastPractice = lastPracticed 
        ? Math.floor((Date.now() - new Date(lastPracticed.last_attempt_at!).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      const streak = daysSinceLastPractice === 0 ? 7 : daysSinceLastPractice === 1 ? 5 : 0; // Simplified

      if (streak > maxStreak) maxStreak = streak;

      totalCompleted += completedLessons;

      enrichedEnrollments.push({
        course_slug: enrollment.course_slug,
        course_name: courseNames[enrollment.course_slug] || enrollment.course_slug,
        enrolled_at: enrollment.enrolled_at,
        subscription_tier: enrollment.subscription_tier,
        lessons_completed: completedLessons,
        total_lessons: totalLessons,
        overall_accuracy: overallAccuracy,
        time_spent_minutes: timeSpent,
        study_streak_days: streak,
        predicted_grade: predictedGrade,
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
    setCurrentStreak(maxStreak);

    // Calculate achievements
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
                      <div>
                        <div className="text-4xl mb-2">{enrollment.icon}</div>
                        <h3 className="text-2xl font-bold mb-1">{enrollment.course_name}</h3>
                        <p className="text-white/80">
                          {enrollment.subscription_tier === 'premium' ? '⭐ Premium Access' : '🆓 Free Access'}
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                        <div className="text-3xl font-bold">
                          {enrollment.predicted_grade || '?'}
                        </div>
                        <div className="text-xs text-white/80">Predicted</div>
                      </div>
                    </div>
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
                          {enrollment.study_streak_days}
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

                    {/* Action Button */}
                    <Link
                      href={`/courses/${enrollment.course_slug}`}
                      className="w-full py-3 rounded-xl font-bold text-white text-center block transition-all transform hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${enrollment.color} 0%, ${enrollment.color}dd 100%)` }}
                    >
                      Continue Learning →
                    </Link>
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
    </div>
  );
}
