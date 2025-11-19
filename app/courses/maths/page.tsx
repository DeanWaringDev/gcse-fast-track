/**
 * Maths Course Page
 * 
 * Displays course progress and lesson cards
 * Only accessible to enrolled users
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import lessonsData from '@/data/maths/lessons.json';
import CourseProgressBanner from '@/components/CourseProgressBanner';
import LessonCard from '@/components/LessonCard';

export default function MathsCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const supabase = createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      router.push('/login?redirect=/courses/maths');
      return;
    }

    setUser(user);

    // Check enrollment
    const { data: enrollmentData } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', 'maths')
      .eq('status', 'active')
      .single();

    if (!enrollmentData) {
      router.push('/?error=not-enrolled');
      return;
    }

    setEnrollment(enrollmentData);

    // Get lesson progress
    const { data: progressData } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', 'maths');

    setLessonProgress(progressData || []);
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return null;
  }

  // Calculate progress stats
  const totalLessons = lessonsData.totalLessons;
  const completedLessons = lessonProgress?.filter(p => p.is_completed).length || 0;
  const completionPercent = Math.round((completedLessons / totalLessons) * 100);

  // Find strongest area (highest accuracy)
  const completedWithScores = lessonProgress?.filter(p => p.accuracy_score !== null) || [];
  const strongestLesson = completedWithScores.sort((a, b) => {
    if (b.accuracy_score === a.accuracy_score) {
      return b.lesson_id - a.lesson_id; // Higher lesson number if tied
    }
    return b.accuracy_score - a.accuracy_score;
  })[0];

  // Find weakest area (lowest accuracy)
  const weakestLesson = [...completedWithScores].sort((a, b) => {
    if (a.accuracy_score === b.accuracy_score) {
      return b.lesson_id - a.lesson_id; // Higher lesson number if tied
    }
    return a.accuracy_score - b.accuracy_score;
  })[0];

  // Find recommended next lesson (first incomplete lesson)
  const progressMap = new Map(lessonProgress?.map(p => [p.lesson_id, p]) || []);
  const nextLesson = lessonsData.lessons.find(lesson => {
    const progress = progressMap.get(lesson.id);
    return !progress || !progress.is_completed;
  });

  const isPremium = enrollment.subscription_tier === 'premium';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">📐 GCSE Maths</h1>
          <p className="text-blue-100">100 comprehensive lessons to master your GCSE</p>
        </div>
      </div>

      {/* Progress Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CourseProgressBanner
          completionPercent={completionPercent}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
          strongestLesson={strongestLesson ? {
            title: lessonsData.lessons.find(l => l.id === strongestLesson.lesson_id)?.title || '',
            category: lessonsData.lessons.find(l => l.id === strongestLesson.lesson_id)?.category || '',
            accuracy: strongestLesson.accuracy_score
          } : null}
          weakestLesson={weakestLesson ? {
            title: lessonsData.lessons.find(l => l.id === weakestLesson.lesson_id)?.title || '',
            category: lessonsData.lessons.find(l => l.id === weakestLesson.lesson_id)?.category || '',
            accuracy: weakestLesson.accuracy_score
          } : null}
          recommendedNext={nextLesson ? {
            title: nextLesson.title,
            slug: nextLesson.slug,
            number: nextLesson.number
          } : null}
        />
      </div>

      {/* Lessons Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lessonsData.lessons.map((lesson) => {
            const progress = progressMap.get(lesson.id);
            const isLocked = !lesson.isFree && !isPremium;
            
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progress}
                isLocked={isLocked}
                courseSlug="maths"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
