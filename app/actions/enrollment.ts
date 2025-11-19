/**
 * Enrollment Actions
 * 
 * Server actions for course enrollment operations
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { createEnrollment } from '@/lib/services/enrollment';
import { revalidatePath } from 'next/cache';
import type { CreateEnrollmentData } from '@/lib/types/enrollment';

export interface EnrollmentActionResult {
  success: boolean;
  message: string;
  redirectTo?: string;
  enrollment?: any;
}

/**
 * Enroll user in a course
 * Returns success status and redirect URL
 */
export async function enrollInCourse(
  courseSlug: string,
  subscriptionTier: 'free' | 'premium' = 'free'
): Promise<EnrollmentActionResult> {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        message: 'Please log in to enroll in this course',
        redirectTo: '/login',
      };
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug)
      .eq('status', 'active')
      .single();

    if (existingEnrollment) {
      return {
        success: true,
        message: 'You are already enrolled in this course',
        redirectTo: `/courses/${courseSlug}`,
        enrollment: existingEnrollment,
      };
    }

    // Create new enrollment
    const enrollmentData: CreateEnrollmentData = {
      course_slug: courseSlug,
      subscription_tier: subscriptionTier,
    };

    const enrollment = await createEnrollment(enrollmentData);

    // Revalidate relevant paths
    revalidatePath('/');
    revalidatePath(`/courses/${courseSlug}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Successfully enrolled in course! ${subscriptionTier === 'free' ? 'You have access to 25 free lessons.' : 'You have premium access to all lessons.'}`,
      redirectTo: `/courses/${courseSlug}`,
      enrollment,
    };
  } catch (error) {
    console.error('Enrollment error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to enroll in course',
    };
  }
}

/**
 * Check enrollment status for a course
 */
export async function checkEnrollmentStatus(courseSlug: string): Promise<{
  isEnrolled: boolean;
  isPremium: boolean;
  enrollment: any | null;
}> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { isEnrolled: false, isPremium: false, enrollment: null };
    }

    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_slug', courseSlug)
      .eq('status', 'active')
      .single();

    return {
      isEnrolled: !!enrollment,
      isPremium: enrollment?.subscription_tier === 'premium',
      enrollment,
    };
  } catch (error) {
    console.error('Check enrollment error:', error);
    return { isEnrolled: false, isPremium: false, enrollment: null };
  }
}
