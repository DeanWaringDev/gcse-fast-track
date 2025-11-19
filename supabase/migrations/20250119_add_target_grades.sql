-- Add target grade and paper tier tracking to enrollments
-- Enables personalized grade predictions and paper tier recommendations

-- Add new columns for target setting and current prediction
ALTER TABLE enrollments
ADD COLUMN IF NOT EXISTS target_paper VARCHAR(20) DEFAULT 'foundation' CHECK (target_paper IN ('foundation', 'higher', 'none')),
ADD COLUMN IF NOT EXISTS target_grade INTEGER DEFAULT 4 CHECK (target_grade >= 1 AND target_grade <= 9),
ADD COLUMN IF NOT EXISTS predicted_grade INTEGER,
ADD COLUMN IF NOT EXISTS recommended_paper VARCHAR(20);

-- Index for filtering by target grade ranges
CREATE INDEX idx_enrollments_target ON enrollments(user_id, target_paper, target_grade);

-- Comments
COMMENT ON COLUMN enrollments.target_paper IS 'Target exam tier: foundation (grades 1-5), higher (grades 4-9), or none (no tiers for this subject)';
COMMENT ON COLUMN enrollments.target_grade IS 'Student target grade (1-9)';
COMMENT ON COLUMN enrollments.predicted_grade IS 'System-calculated predicted grade based on performance and progress';
COMMENT ON COLUMN enrollments.recommended_paper IS 'System recommendation for paper tier based on performance (foundation/higher)';
