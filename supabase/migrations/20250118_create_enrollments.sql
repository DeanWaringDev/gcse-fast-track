-- Enrollments table
-- Tracks user course enrollments and subscription status

CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_slug VARCHAR(100) NOT NULL,
  
  -- Enrollment status
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'completed')),
  
  -- Subscription tier
  subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  
  -- Timestamps
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  premium_granted_at TIMESTAMP WITH TIME ZONE,
  
  -- Payment tracking
  payment_id VARCHAR(255), -- Stripe payment ID or other payment processor
  amount_paid DECIMAL(10, 2), -- Amount paid for premium access
  
  -- Progress tracking
  lessons_completed INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  last_lesson_slug VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, course_slug)
);

-- Create indexes for performance
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_slug ON enrollments(course_slug);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_slug);

-- Enable Row Level Security
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments"
  ON enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own enrollments (enroll in courses)
CREATE POLICY "Users can create own enrollments"
  ON enrollments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollments (withdraw, update progress)
CREATE POLICY "Users can update own enrollments"
  ON enrollments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on every update
CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE enrollments IS 'Tracks user course enrollments and subscription status';
COMMENT ON COLUMN enrollments.user_id IS 'Reference to auth.users';
COMMENT ON COLUMN enrollments.course_slug IS 'Course identifier matching courses.json slug';
COMMENT ON COLUMN enrollments.status IS 'Enrollment status: active, withdrawn, or completed';
COMMENT ON COLUMN enrollments.subscription_tier IS 'Access level: free (25 lessons) or premium (full access)';
COMMENT ON COLUMN enrollments.withdrawn_at IS 'Timestamp when user withdrew from course';
COMMENT ON COLUMN enrollments.completed_at IS 'Timestamp when user completed all lessons';
COMMENT ON COLUMN enrollments.premium_granted_at IS 'Timestamp when premium access was granted';
COMMENT ON COLUMN enrollments.payment_id IS 'External payment processor transaction ID';
COMMENT ON COLUMN enrollments.amount_paid IS 'Amount paid for premium access in the base currency';
COMMENT ON COLUMN enrollments.lessons_completed IS 'Number of lessons marked as complete';
COMMENT ON COLUMN enrollments.last_accessed_at IS 'Last time user accessed this course';
COMMENT ON COLUMN enrollments.last_lesson_slug IS 'Slug of last lesson accessed for resume functionality';
