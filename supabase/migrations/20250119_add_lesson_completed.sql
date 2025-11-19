-- Add lesson_completed column to track when users complete viewing lesson content
-- This is separate from is_completed which tracks overall lesson mastery

ALTER TABLE lesson_progress
ADD COLUMN IF NOT EXISTS lesson_completed BOOLEAN DEFAULT false;

-- Add index for querying completed lessons
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_completed 
  ON lesson_progress(lesson_completed);

-- Add timestamp for when lesson content was completed
ALTER TABLE lesson_progress
ADD COLUMN IF NOT EXISTS lesson_completed_at TIMESTAMP WITH TIME ZONE;

-- Comment
COMMENT ON COLUMN lesson_progress.lesson_completed IS 'True when user has viewed all lesson content slides';
COMMENT ON COLUMN lesson_progress.lesson_completed_at IS 'Timestamp when lesson content was completed';
