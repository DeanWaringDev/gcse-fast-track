/**
 * Lesson Progress Types
 */

export interface LessonProgress {
  id: string;
  user_id: string;
  course_slug: string;
  lesson_id: number;
  lesson_slug: string;
  is_completed: boolean;
  completed_at: string | null;
  accuracy_score: number | null;
  time_spent_minutes: number;
  attempts: number;
  last_attempt_at: string | null;
  confidence_level: number | null;
  created_at: string;
  updated_at: string;
}
