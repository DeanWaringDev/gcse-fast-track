/**
 * Enrollment Service
 * 
 * Server-side functions for managing course enrollments
 */

import { createClient } from '@/lib/supabase/server';
import type { Enrollment, CreateEnrollmentData, UpdateEnrollmentData } from '@/lib/types/enrollment';

/**
 * Get all enrollments for the current user
 */
export async function getUserEnrollments(): Promise<Enrollment[]> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .order('enrolled_at', { ascending: false });

  if (error) throw error;
  return data as Enrollment[];
}

/**
 * Get a specific enrollment by course slug
 */
export async function getEnrollment(courseSlug: string): Promise<Enrollment | null> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data as Enrollment;
}

/**
 * Check if user is enrolled in a course
 */
export async function isUserEnrolled(courseSlug: string): Promise<boolean> {
  const enrollment = await getEnrollment(courseSlug);
  return enrollment !== null && enrollment.status === 'active';
}

/**
 * Check if user has premium access to a course
 */
export async function hasPremiumAccess(courseSlug: string): Promise<boolean> {
  const enrollment = await getEnrollment(courseSlug);
  return enrollment !== null && 
         enrollment.status === 'active' && 
         enrollment.subscription_tier === 'premium';
}

/**
 * Create a new enrollment (enroll user in course)
 */
export async function createEnrollment(data: CreateEnrollmentData): Promise<Enrollment> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Check if already enrolled
  const existing = await getEnrollment(data.course_slug);
  if (existing && existing.status === 'active') {
    throw new Error('Already enrolled in this course');
  }

  const enrollmentData = {
    user_id: user.id,
    course_slug: data.course_slug,
    subscription_tier: data.subscription_tier || 'free',
    status: 'active',
    enrolled_at: new Date().toISOString(),
  };

  const { data: enrollment, error } = await supabase
    .from('enrollments')
    .insert(enrollmentData)
    .select()
    .single();

  if (error) throw error;
  return enrollment as Enrollment;
}

/**
 * Update an existing enrollment
 */
export async function updateEnrollment(
  courseSlug: string,
  updates: UpdateEnrollmentData
): Promise<Enrollment> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('enrollments')
    .update(updates)
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .select()
    .single();

  if (error) throw error;
  return data as Enrollment;
}

/**
 * Withdraw from a course
 */
export async function withdrawFromCourse(courseSlug: string): Promise<Enrollment> {
  return updateEnrollment(courseSlug, {
    status: 'withdrawn',
    withdrawn_at: new Date().toISOString(),
  });
}

/**
 * Mark course as completed
 */
export async function completeCourse(courseSlug: string): Promise<Enrollment> {
  return updateEnrollment(courseSlug, {
    status: 'completed',
    completed_at: new Date().toISOString(),
  });
}

/**
 * Upgrade to premium access
 */
export async function upgradeToPremium(
  courseSlug: string,
  paymentId: string,
  amountPaid: number
): Promise<Enrollment> {
  return updateEnrollment(courseSlug, {
    subscription_tier: 'premium',
    premium_granted_at: new Date().toISOString(),
    payment_id: paymentId,
    amount_paid: amountPaid,
  });
}

/**
 * Update lesson progress
 */
export async function updateLessonProgress(
  courseSlug: string,
  lessonSlug: string,
  lessonsCompleted: number
): Promise<Enrollment> {
  return updateEnrollment(courseSlug, {
    last_lesson_slug: lessonSlug,
    last_accessed_at: new Date().toISOString(),
    lessons_completed: lessonsCompleted,
  });
}
