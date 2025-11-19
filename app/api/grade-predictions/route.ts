import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { calculatePredictedGrade, type PerformanceData } from '@/lib/gradePrediction';

/**
 * Calculate and update grade predictions for user enrollments
 * GET /api/grade-predictions
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all user enrollments
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (enrollmentsError) {
      return NextResponse.json({ error: enrollmentsError.message }, { status: 500 });
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ predictions: [] });
    }

    // Calculate predictions for each enrollment
    const predictions = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Get practice session stats for this course
        const { data: sessions } = await supabase
          .from('practice_sessions')
          .select('correct_answers, total_questions, completed_at')
          .eq('user_id', user.id)
          .eq('course_slug', enrollment.course_slug)
          .not('completed_at', 'is', null);

        // Calculate average accuracy
        let totalCorrect = 0;
        let totalQuestions = 0;
        
        if (sessions && sessions.length > 0) {
          sessions.forEach((session) => {
            totalCorrect += session.correct_answers || 0;
            totalQuestions += session.total_questions || 0;
          });
        }

        const averageAccuracy = totalQuestions > 0 
          ? (totalCorrect / totalQuestions) * 100 
          : 0;

        // Prepare performance data
        const performanceData: PerformanceData = {
          lessonsCompleted: enrollment.lessons_completed || 0,
          totalLessons: 100, // All courses have 100 lessons
          averageAccuracy,
          questionsAttempted: totalQuestions,
          targetPaper: enrollment.target_paper || 'foundation',
          targetGrade: enrollment.target_grade || 4,
          courseSlug: enrollment.course_slug
        };

        // Calculate prediction
        const prediction = calculatePredictedGrade(performanceData);

        // Update enrollment with prediction
        await supabase
          .from('enrollments')
          .update({
            predicted_grade: prediction.predictedGrade,
            recommended_paper: prediction.recommendedPaper
          })
          .eq('id', enrollment.id);

        return {
          courseSlug: enrollment.course_slug,
          ...prediction,
          stats: {
            lessonsCompleted: performanceData.lessonsCompleted,
            averageAccuracy: Math.round(averageAccuracy),
            questionsAttempted: totalQuestions
          }
        };
      })
    );

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Grade prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate grade predictions' },
      { status: 500 }
    );
  }
}
