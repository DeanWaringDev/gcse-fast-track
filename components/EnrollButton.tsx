/**
 * Enroll Button Component
 * 
 * Client component for handling course enrollment
 * Checks auth status and enrolls user in course
 * Shows "Study Now" if already enrolled
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { enrollInCourse, checkEnrollmentStatus } from '@/app/actions/enrollment';

interface EnrollButtonProps {
  courseSlug: string;
  courseName: string;
  courseColor?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: 'card' | 'modal';
}

export default function EnrollButton({
  courseSlug,
  courseName,
  courseColor,
  className,
  children,
  variant = 'card',
}: EnrollButtonProps) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check enrollment status on mount
  useEffect(() => {
    checkEnrollment();
  }, [courseSlug]);

  const checkEnrollment = async () => {
    try {
      const status = await checkEnrollmentStatus(courseSlug);
      setIsEnrolled(status.isEnrolled);
    } catch (error) {
      console.error('Failed to check enrollment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    // If already enrolled, go to course
    if (isEnrolled) {
      router.push(`/courses/${courseSlug}`);
      return;
    }

    // Otherwise, enroll
    setIsEnrolling(true);

    try {
      const result = await enrollInCourse(courseSlug, 'free');

      if (result.success) {
        // Show success message (you can add a toast notification here)
        console.log(result.message);
        
        // Redirect to course or login page
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        // Show error message
        console.error(result.message);
        
        // If not authenticated, redirect to login
        if (result.redirectTo === '/login') {
          router.push(`/login?redirect=/courses/${courseSlug}`);
        }
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
    } finally {
      setIsEnrolling(false);
    }
  };

  // Get button text based on state
  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (isEnrolling) return 'Enrolling...';
    if (isEnrolled) return 'Study Now';
    if (children) return children;
    return variant === 'card' ? 'Enroll Now' : "Enroll Now - It's Free!";
  };

  // Default card variant styling
  if (variant === 'card') {
    return (
      <button
        onClick={handleClick}
        disabled={isEnrolling || isLoading}
        className={className || 'w-full py-2.5 rounded-lg font-bold text-sm transition-all text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'}
        style={courseColor ? { backgroundColor: courseColor } : {}}
      >
        {getButtonText()}
      </button>
    );
  }

  // Modal variant styling
  return (
    <button
      onClick={handleClick}
      disabled={isEnrolling || isLoading}
      className={className || 'w-full py-4 rounded-xl font-bold text-lg text-white bg-cyan-600 hover:bg-cyan-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'}
    >
      {getButtonText()}
    </button>
  );
}
