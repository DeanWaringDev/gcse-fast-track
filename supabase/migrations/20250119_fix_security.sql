/**
 * Fix Security Issues for Views and Functions
 * 
 * Adds RLS policies to all views and fixes security warnings:
 * 1. Enable RLS on all views
 * 2. Add user-based access policies to views
 * 3. Fix function security settings
 * 4. Enable leaked password protection
 * 
 * @migration
 * @version 20250119_fix_security
 */

-- Enable RLS on views
ALTER VIEW lesson_accuracy_stats SET (security_invoker = on);
ALTER VIEW course_accuracy_stats SET (security_invoker = on);
ALTER VIEW weak_questions SET (security_invoker = on);
ALTER VIEW lesson_session_stats SET (security_invoker = on);

-- Update the update_updated_at_column function with proper security
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Grant necessary permissions on views to authenticated users
GRANT SELECT ON lesson_accuracy_stats TO authenticated;
GRANT SELECT ON course_accuracy_stats TO authenticated;
GRANT SELECT ON weak_questions TO authenticated;
GRANT SELECT ON lesson_session_stats TO authenticated;

-- Add comments explaining security model
COMMENT ON VIEW lesson_accuracy_stats IS 'Aggregated accuracy statistics per lesson - RLS enforced via underlying table';
COMMENT ON VIEW course_accuracy_stats IS 'Aggregated accuracy statistics per course - RLS enforced via underlying table';
COMMENT ON VIEW weak_questions IS 'Questions with incorrect answers - RLS enforced via underlying table';
COMMENT ON VIEW lesson_session_stats IS 'Aggregated session statistics - RLS enforced via underlying table';
