/**
 * Practice Sessions Table Migration
 * 
 * Creates the practice_sessions table for tracking practice runs as unified sessions.
 * Each practice run (10-15 questions) counts as ONE session, not individual questions.
 * 
 * Table: practice_sessions
 * Purpose: Track practice sessions for session count and time tracking
 * 
 * Session Types & Question Counts:
 * - practice: 10 questions from first 30 = 1 session
 * - timed: 15 questions from first 30 = 1 session
 * - expert: 15 questions from #150-300 = 1 session
 * - weak_areas: 10 questions from incorrect answers = 1 session
 * 
 * Key Fields:
 * - questions_attempted: Total questions in this session
 * - questions_correct: Number answered correctly in this session
 * - accuracy_percentage: Session accuracy (calculated)
 * - duration_seconds: Total time for this session
 * - started_at: Session start timestamp
 * - completed_at: Session completion timestamp (NULL if incomplete)
 * 
 * Related View:
 * - lesson_session_stats: Aggregated session statistics per lesson
 * 
 * Usage:
 * - Dashboard "Practice Attempts" shows COUNT of completed sessions
 * - Dashboard "Time Spent" shows SUM of duration_seconds
 * - lesson_progress.attempts updated with session count (not question count)
 * 
 * @migration
 * @version 20250119
 */

-- Practice Sessions table
-- Tracks each practice session (not individual questions)

CREATE TABLE IF NOT EXISTS practice_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug VARCHAR(100) NOT NULL,
  lesson_id INTEGER NOT NULL,
  lesson_slug VARCHAR(255) NOT NULL,
  
  -- Session details
  practice_mode VARCHAR(50) NOT NULL, -- "practice", "timed", "expert", "weak_areas", "worksheet"
  questions_attempted INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5, 2),
  
  -- Time tracking
  duration_seconds INTEGER, -- Total time for the session
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT practice_sessions_check_questions CHECK (questions_correct <= questions_attempted),
  CONSTRAINT practice_sessions_check_duration CHECK (duration_seconds >= 0)
);

-- Create indexes for performance
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_course_slug ON practice_sessions(course_slug);
CREATE INDEX idx_practice_sessions_lesson_id ON practice_sessions(lesson_id);
CREATE INDEX idx_practice_sessions_user_lesson ON practice_sessions(user_id, lesson_id);
CREATE INDEX idx_practice_sessions_practice_mode ON practice_sessions(practice_mode);
CREATE INDEX idx_practice_sessions_started_at ON practice_sessions(started_at);

-- Enable Row Level Security
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own practice sessions"
  ON practice_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own practice sessions"
  ON practice_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own practice sessions"
  ON practice_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE practice_sessions IS 'Tracks practice sessions, not individual questions';
COMMENT ON COLUMN practice_sessions.practice_mode IS 'Type of practice: practice, timed, expert, weak_areas, worksheet';
COMMENT ON COLUMN practice_sessions.duration_seconds IS 'Total time spent in this session';
COMMENT ON COLUMN practice_sessions.accuracy_percentage IS 'Session accuracy percentage';

-- Create a view for session statistics per lesson
CREATE OR REPLACE VIEW lesson_session_stats AS
SELECT 
  user_id,
  course_slug,
  lesson_id,
  lesson_slug,
  COUNT(*) as total_sessions,
  SUM(questions_attempted) as total_questions_attempted,
  SUM(questions_correct) as total_questions_correct,
  ROUND(
    AVG(accuracy_percentage), 
    2
  ) as average_accuracy,
  SUM(duration_seconds) as total_time_seconds,
  MAX(started_at) as last_session_at
FROM practice_sessions
WHERE completed_at IS NOT NULL
GROUP BY user_id, course_slug, lesson_id, lesson_slug;

COMMENT ON VIEW lesson_session_stats IS 'Aggregated session statistics per lesson for each user';
