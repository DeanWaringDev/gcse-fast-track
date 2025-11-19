/**
 * Calculate Study Streak API Route
 * 
 * Calculates consecutive days of study activity
 * Returns the current streak count
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all study activity dates for this user, ordered by date descending
    const { data: activities, error } = await supabase
      .from('study_activity')
      .select('activity_date')
      .eq('user_id', user.id)
      .order('activity_date', { ascending: false });

    if (error) {
      console.error('Error fetching study activity:', error);
      return NextResponse.json({ error: 'Failed to fetch study activity' }, { status: 500 });
    }

    if (!activities || activities.length === 0) {
      return NextResponse.json({ streak: 0 });
    }

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if user practiced today or yesterday
    const latestDate = new Date(activities[0].activity_date);
    latestDate.setHours(0, 0, 0, 0);

    // If latest activity is not today or yesterday, streak is broken
    if (latestDate.getTime() < yesterday.getTime()) {
      return NextResponse.json({ streak: 0 });
    }

    // Count consecutive days
    let currentDate = new Date(latestDate);
    for (const activity of activities) {
      const activityDate = new Date(activity.activity_date);
      activityDate.setHours(0, 0, 0, 0);

      if (activityDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (activityDate.getTime() < currentDate.getTime()) {
        // Gap found - streak broken
        break;
      }
    }

    return NextResponse.json({ streak });
  } catch (error) {
    console.error('Error calculating streak:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
