'use client';

/**
 * Computer Science Course Page
 * 
 * Protected course page - requires authentication and enrollment
 * Displays progress banner and all 100 lessons
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import CourseProgressBanner from '@/components/CourseProgressBanner';
import LessonCard from '@/components/LessonCard';
import lessonsData from '@/public/data/computerscience/computerscience_lessons.json';

interface LessonProgress {
  lesson_id: number;
  lesson_slug: string;
  is_completed: boolean;
  accuracy_score: number | null;
  confidence_level: number | null;
}

export default function ComputerSciencePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const courseSlug = 'computer-science';

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/courses/computer-science');
        return;
      }

      // Check enrollment
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_slug', courseSlug)
        .eq('status', 'active')
        .single();

      if (!enrollmentData) {
        router.push('/');
        return;
      }

      setEnrollment(enrollmentData);

      // Load lesson progress
      const { data: progressData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_slug', courseSlug);

      setLessonProgress(progressData || []);
      setIsLoading(false);
    }

    checkAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  // Calculate progress statistics
  const totalLessons = lessonsData.lessons.length;
  const completedLessons = lessonProgress.filter(p => p.is_completed).length;
  const completionPercent = Math.round((completedLessons / totalLessons) * 100);

  // Find strongest lesson (highest accuracy)
  const completedWithScores = lessonProgress.filter(p => p.accuracy_score !== null);
  const strongestLesson = completedWithScores.sort((a, b) => {
    if (b.accuracy_score === a.accuracy_score) {
      return b.lesson_id - a.lesson_id;
    }
    return (b.accuracy_score || 0) - (a.accuracy_score || 0);
  })[0];

  // Find weakest lesson (lowest accuracy)
  const weakestLesson = [...completedWithScores].sort((a, b) => {
    if (a.accuracy_score === b.accuracy_score) {
      return b.lesson_id - a.lesson_id;
    }
    return (a.accuracy_score || 0) - (b.accuracy_score || 0);
  })[0];

  // Find recommended next lesson (first incomplete)
  const progressMap = new Map(lessonProgress.map(p => [p.lesson_id, p]));
  const nextLesson = lessonsData.lessons.find(lesson => {
    const progress = progressMap.get(lesson.id);
    return !progress || !progress.is_completed;
  });

  const isPremium = enrollment?.subscription_tier === 'premium';

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-linear-to-r from-cyan-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">GCSE Computer Science</h1>
          <p className="text-cyan-100 text-lg">
            Master all {totalLessons} lessons and ace your exam
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Banner */}
        <CourseProgressBanner
          completionPercent={completionPercent}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
          strongestLesson={strongestLesson ? {
            title: lessonsData.lessons.find(l => l.id === strongestLesson.lesson_id)?.title || '',
            category: lessonsData.lessons.find(l => l.id === strongestLesson.lesson_id)?.category || '',
            accuracy: strongestLesson.accuracy_score!
          } : null}
          weakestLesson={weakestLesson ? {
            title: lessonsData.lessons.find(l => l.id === weakestLesson.lesson_id)?.title || '',
            category: lessonsData.lessons.find(l => l.id === weakestLesson.lesson_id)?.category || '',
            accuracy: weakestLesson.accuracy_score!
          } : null}
          recommendedNext={nextLesson ? {
            title: nextLesson.title,
            slug: nextLesson.slug,
            number: nextLesson.number
          } : null}
        />

        {/* Lessons Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lessonsData.lessons.map((lesson) => {
              const progress = lessonProgress.find(p => p.lesson_id === lesson.id);
              const isLocked = !lesson.isFree && !isPremium;

              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={progress ? {
                    is_completed: progress.is_completed,
                    accuracy_score: progress.accuracy_score
                  } : null}
                  isLocked={isLocked}
                  courseSlug={courseSlug}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
