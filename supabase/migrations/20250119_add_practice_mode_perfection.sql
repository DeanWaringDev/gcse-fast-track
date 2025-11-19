/**
 * Add Practice Mode Perfection Tracking Migration
 * 
 * Adds fields to lesson_progress table to track when users achieve 100% accuracy
 * in each practice mode (practice, timed, expert).
 * 
 * New Fields:
 * - practice_perfect: User has achieved 100% in Practice Questions mode
 * - timed_perfect: User has achieved 100% in Timed Challenge mode
 * - expert_perfect: User has achieved 100% in Expert Mode
 * 
 * These badges/checkmarks indicate mastery in specific practice modes
 * and are displayed on the lesson page UI.
 * 
 * @migration
 * @version 20250119
 */

-- Add perfection tracking columns to lesson_progress
ALTER TABLE lesson_progress
ADD COLUMN IF NOT EXISTS practice_perfect BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS timed_perfect BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS expert_perfect BOOLEAN DEFAULT false;

-- Add comments for clarity
COMMENT ON COLUMN lesson_progress.practice_perfect IS 'User achieved 100% accuracy in Practice Questions mode';
COMMENT ON COLUMN lesson_progress.timed_perfect IS 'User achieved 100% accuracy in Timed Challenge mode';
COMMENT ON COLUMN lesson_progress.expert_perfect IS 'User achieved 100% accuracy in Expert Mode';
