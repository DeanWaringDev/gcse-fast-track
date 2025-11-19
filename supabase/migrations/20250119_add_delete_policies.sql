-- Add DELETE policies for withdrawal functionality
-- Allows users to delete their own data when withdrawing from courses

-- Question attempts
CREATE POLICY "Users can delete own question attempts"
  ON question_attempts FOR DELETE
  USING (auth.uid() = user_id);

-- Practice sessions  
CREATE POLICY "Users can delete own practice sessions"
  ON practice_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Lesson progress
CREATE POLICY "Users can delete own lesson progress"
  ON lesson_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Study activity
CREATE POLICY "Users can delete own study activity"
  ON study_activity FOR DELETE
  USING (auth.uid() = user_id);
