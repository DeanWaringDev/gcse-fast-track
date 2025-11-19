-- Question Attempts table
-- Tracks individual question answers for accuracy calculations and weak area identification

CREATE TABLE IF NOT EXISTS question_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug VARCHAR(100) NOT NULL,
  lesson_id INTEGER NOT NULL,
  lesson_slug VARCHAR(255) NOT NULL,
  
  -- Question identification
  question_id VARCHAR(50) NOT NULL, -- e.g., "001", "002", etc.
  section_id VARCHAR(50), -- e.g., "warm_up", "brackets", etc.
  
  -- Answer tracking
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  
  -- Context
  practice_mode VARCHAR(50), -- "practice", "timed", "expert", "weak_areas", "worksheet"
  time_taken_seconds INTEGER, -- Time spent on this question
  
  -- Metadata
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  -- Allow multiple attempts per question (user can retry)
  -- No unique constraint so users can attempt same question multiple times
  CONSTRAINT question_attempts_check_time CHECK (time_taken_seconds >= 0)
);

-- Create indexes for performance
CREATE INDEX idx_question_attempts_user_id ON question_attempts(user_id);
CREATE INDEX idx_question_attempts_course_slug ON question_attempts(course_slug);
CREATE INDEX idx_question_attempts_lesson_id ON question_attempts(lesson_id);
CREATE INDEX idx_question_attempts_user_lesson ON question_attempts(user_id, lesson_id);
CREATE INDEX idx_question_attempts_user_course ON question_attempts(user_id, course_slug);
CREATE INDEX idx_question_attempts_question_id ON question_attempts(question_id);
CREATE INDEX idx_question_attempts_is_correct ON question_attempts(is_correct);
CREATE INDEX idx_question_attempts_attempted_at ON question_attempts(attempted_at);

-- Enable Row Level Security
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own question attempts"
  ON question_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own question attempts"
  ON question_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own question attempts"
  ON question_attempts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments
COMMENT ON TABLE question_attempts IS 'Tracks every question attempt for accuracy and progress calculations';
COMMENT ON COLUMN question_attempts.question_id IS 'Question identifier from JSON (e.g., "001", "002")';
COMMENT ON COLUMN question_attempts.section_id IS 'Section identifier for grouping questions';
COMMENT ON COLUMN question_attempts.is_correct IS 'Whether the user answered correctly';
COMMENT ON COLUMN question_attempts.practice_mode IS 'Which practice mode was used (practice, timed, expert, weak_areas, worksheet)';
COMMENT ON COLUMN question_attempts.time_taken_seconds IS 'Time spent answering this specific question';

-- Create a view for lesson accuracy calculation
CREATE OR REPLACE VIEW lesson_accuracy_stats AS
SELECT 
  user_id,
  course_slug,
  lesson_id,
  lesson_slug,
  COUNT(*) as total_attempts,
  COUNT(DISTINCT question_id) as unique_questions_attempted,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
  ROUND(
    (SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 
    2
  ) as accuracy_percentage,
  MAX(attempted_at) as last_attempt_at
FROM question_attempts
GROUP BY user_id, course_slug, lesson_id, lesson_slug;

COMMENT ON VIEW lesson_accuracy_stats IS 'Aggregated accuracy statistics per lesson for each user';

-- Create a view for course accuracy calculation
CREATE OR REPLACE VIEW course_accuracy_stats AS
SELECT 
  user_id,
  course_slug,
  COUNT(*) as total_attempts,
  COUNT(DISTINCT lesson_id) as lessons_attempted,
  COUNT(DISTINCT question_id) as unique_questions_attempted,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
  ROUND(
    (SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 
    2
  ) as accuracy_percentage,
  MAX(attempted_at) as last_attempt_at
FROM question_attempts
GROUP BY user_id, course_slug;

COMMENT ON VIEW course_accuracy_stats IS 'Aggregated accuracy statistics per course for each user';

-- Create a view for weak areas (questions answered incorrectly)
CREATE OR REPLACE VIEW weak_questions AS
WITH latest_attempts AS (
  SELECT DISTINCT ON (user_id, question_id)
    user_id,
    course_slug,
    lesson_id,
    lesson_slug,
    question_id,
    section_id,
    is_correct,
    attempted_at
  FROM question_attempts
  ORDER BY user_id, question_id, attempted_at DESC
)
SELECT 
  user_id,
  course_slug,
  lesson_id,
  lesson_slug,
  question_id,
  section_id,
  attempted_at
FROM latest_attempts
WHERE is_correct = false;

COMMENT ON VIEW weak_questions IS 'Questions where the user last answer was incorrect (for weak areas practice)';
