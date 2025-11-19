/**
 * Enrollment Types
 * 
 * Type definitions for course enrollments and subscription management
 */

export type EnrollmentStatus = 'active' | 'withdrawn' | 'completed';
export type SubscriptionTier = 'free' | 'premium';

export interface Enrollment {
  id: string;
  user_id: string;
  course_slug: string;
  status: EnrollmentStatus;
  subscription_tier: SubscriptionTier;
  enrolled_at: string;
  withdrawn_at: string | null;
  completed_at: string | null;
  premium_granted_at: string | null;
  payment_id: string | null;
  amount_paid: number | null;
  lessons_completed: number;
  last_accessed_at: string | null;
  last_lesson_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEnrollmentData {
  course_slug: string;
  subscription_tier?: SubscriptionTier;
}

export interface UpdateEnrollmentData {
  status?: EnrollmentStatus;
  subscription_tier?: SubscriptionTier;
  withdrawn_at?: string;
  completed_at?: string;
  premium_granted_at?: string;
  payment_id?: string;
  amount_paid?: number;
  lessons_completed?: number;
  last_accessed_at?: string;
  last_lesson_slug?: string;
}
