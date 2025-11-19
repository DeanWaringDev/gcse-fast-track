-- Lesson Progress table
-- Tracks individual lesson completion and performance

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug VARCHAR(100) NOT NULL,
  lesson_id INTEGER NOT NULL,
  lesson_slug VARCHAR(255) NOT NULL,
  
  -- Completion status
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Performance tracking
  accuracy_score DECIMAL(5, 2), -- Percentage 0-100
  time_spent_minutes INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  
  -- Confidence tracking
  confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 10),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, course_slug, lesson_id)
);

-- Create indexes for performance
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_course_slug ON lesson_progress(course_slug);
CREATE INDEX idx_lesson_progress_user_course ON lesson_progress(user_id, course_slug);
CREATE INDEX idx_lesson_progress_accuracy ON lesson_progress(accuracy_score);
CREATE INDEX idx_lesson_progress_completed ON lesson_progress(is_completed);

-- Enable Row Level Security
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own lesson progress"
  ON lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own lesson progress"
  ON lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at on every update
CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE lesson_progress IS 'Tracks individual lesson completion and performance metrics';
COMMENT ON COLUMN lesson_progress.accuracy_score IS 'Percentage score 0-100 from quiz/questions';
COMMENT ON COLUMN lesson_progress.confidence_level IS 'User self-reported confidence 0-10';
COMMENT ON COLUMN lesson_progress.attempts IS 'Number of times user attempted the lesson';
