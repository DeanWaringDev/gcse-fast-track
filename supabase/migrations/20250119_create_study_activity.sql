-- Create study_activity table to track daily study sessions
-- Used for calculating study streaks accurately

CREATE TABLE IF NOT EXISTS study_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  lessons_practiced INTEGER DEFAULT 0,
  questions_attempted INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per user per course per day
  UNIQUE(user_id, course_slug, activity_date)
);

-- Index for fast lookups
CREATE INDEX idx_study_activity_user_date ON study_activity(user_id, activity_date DESC);
CREATE INDEX idx_study_activity_user_course ON study_activity(user_id, course_slug);

-- Enable RLS
ALTER TABLE study_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own study activity"
  ON study_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study activity"
  ON study_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study activity"
  ON study_activity FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically update study activity
-- Called after completing practice sessions
CREATE OR REPLACE FUNCTION update_study_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only process completed sessions
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- Insert or update study activity for today
    INSERT INTO study_activity (
      user_id,
      course_slug,
      activity_date,
      lessons_practiced,
      questions_attempted,
      time_spent_seconds
    ) VALUES (
      NEW.user_id,
      NEW.course_slug,
      CURRENT_DATE,
      1,
      NEW.questions_attempted,
      NEW.duration_seconds
    )
    ON CONFLICT (user_id, course_slug, activity_date)
    DO UPDATE SET
      lessons_practiced = study_activity.lessons_practiced + 1,
      questions_attempted = study_activity.questions_attempted + NEW.questions_attempted,
      time_spent_seconds = study_activity.time_spent_seconds + NEW.duration_seconds;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-update study activity
CREATE TRIGGER trigger_update_study_activity
  AFTER UPDATE ON practice_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_study_activity();

COMMENT ON TABLE study_activity IS 'Tracks daily study activity for streak calculation and analytics';
