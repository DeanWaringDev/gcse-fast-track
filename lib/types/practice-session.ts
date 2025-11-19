/**
 * Practice Session Type Definitions
 * 
 * Type definitions for practice session functionality including
 * questions, answers, sessions, and API responses.
 */

/**
 * Practice Mode Types
 * - practice: 10 random questions from first 30 (foundation)
 * - timed: 15 random questions from first 30 (timed challenge)
 * - expert: 15 random questions from #150-300 (advanced)
 * - weak_areas: 10 questions from previously incorrect answers
 */
export type PracticeMode = 'practice' | 'timed' | 'expert' | 'weak_areas';

/**
 * Question object from JSON files
 */
export interface Question {
  id: string;
  question: string;
  sectionId?: string;
  sectionTitle?: string;
}

/**
 * Answer object from JSON files
 */
export interface Answer {
  id: string;
  question: string;
  answer: string;
  sectionId?: string;
  sectionTitle?: string;
}

/**
 * Questions JSON file structure
 */
export interface QuestionsData {
  sections: Array<{
    sectionId: string;
    sectionTitle: string;
    questions: Array<{
      id: number;
      question: string;
    }>;
  }>;
}

/**
 * Answers JSON file structure
 */
export interface AnswersData {
  answers: Array<{
    id: number;
    question: string;
    answer: number | string;
    sectionId: string;
    sectionTitle: string;
  }>;
}

/**
 * Practice session record (database)
 */
export interface PracticeSession {
  id: string;
  user_id: string;
  course_slug: string;
  lesson_id: number;
  lesson_slug: string;
  practice_mode: PracticeMode;
  questions_attempted: number;
  questions_correct: number;
  accuracy_percentage: number;
  duration_seconds: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

/**
 * Question attempt record (database)
 */
export interface QuestionAttempt {
  id: string;
  user_id: string;
  course_slug: string;
  lesson_id: number;
  lesson_slug: string;
  question_id: string;
  section_id: string | null;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  practice_mode: PracticeMode;
  time_taken_seconds: number | null;
  attempted_at: string;
}

/**
 * API request body for starting a practice session
 */
export interface StartSessionRequest {
  courseSlug: string;
  lessonId: number;
  practiceMode: PracticeMode;
}

/**
 * API response for starting a practice session
 */
export interface StartSessionResponse {
  sessionId: string;
}

/**
 * API request body for completing a practice session
 */
export interface CompleteSessionRequest {
  sessionId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  durationSeconds: number;
}

/**
 * API response for completing a practice session
 */
export interface CompleteSessionResponse {
  success: boolean;
}

/**
 * API request body for submitting an answer
 */
export interface SubmitAnswerRequest {
  courseSlug: string;
  lessonId: number;
  lessonSlug: string;
  questionId: string;
  sectionId?: string;
  userAnswer: string;
  correctAnswer: string;
  practiceMode: PracticeMode;
  timeTakenSeconds?: number;
}

/**
 * API response for submitting an answer
 */
export interface SubmitAnswerResponse {
  success: boolean;
  isCorrect: boolean;
  correctAnswer: string;
}
