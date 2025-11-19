# GCSE FastTrack - Testing Guide

## Pre-Testing Database Reset

Before starting comprehensive testing, reset your Supabase database:

### 1. Clear Existing Data (Supabase Dashboard)

Navigate to **Table Editor** and delete all rows from:
- `practice_sessions`
- `question_attempts`
- `lesson_progress`
- `enrollments`

**Note**: Do NOT delete from `auth.users` - this is managed by Supabase Auth

### 2. Verify Migrations Are Applied

Check **SQL Editor** → **Run migration history** to ensure all migrations are applied:
- ✅ `20250118_create_enrollments.sql`
- ✅ `20250118_create_lesson_progress.sql`
- ✅ `20250119_add_lesson_completed.sql`
- ✅ `20250119_create_question_attempts.sql`
- ✅ `20250119_create_practice_sessions.sql`

---

## Comprehensive Testing Checklist

### Phase 1: Authentication Flow ✓

#### Test 1.1: User Registration
- [ ] Go to `/signup` page
- [ ] Fill in email, username, password, confirm password
- [ ] Submit form
- [ ] **Expected**: Success message → Redirect to dashboard
- [ ] **Verify**: Check `auth.users` table in Supabase
- [ ] **Verify**: User metadata includes username

#### Test 1.2: User Login
- [ ] Log out if logged in
- [ ] Go to `/login` page
- [ ] Enter email and password
- [ ] Submit form
- [ ] **Expected**: Redirect to dashboard
- [ ] **Verify**: Session cookie is set

#### Test 1.3: Invalid Login
- [ ] Try logging in with wrong password
- [ ] **Expected**: Error message displayed
- [ ] Try logging in with non-existent email
- [ ] **Expected**: Error message displayed

#### Test 1.4: Password Reset (Optional)
- [ ] Click "Forgot Password" on login page
- [ ] Enter email
- [ ] **Expected**: Reset email sent confirmation
- [ ] Check email inbox for reset link

---

### Phase 2: Course Enrollment ✓

#### Test 2.1: View Available Courses
- [ ] Navigate to home page `/`
- [ ] **Expected**: See Maths and Computer Science courses
- [ ] Click "Learn More" on Maths course
- [ ] **Expected**: See course details modal

#### Test 2.2: Enroll in Course (Free Tier)
- [ ] Click "Enroll Now" on Maths course
- [ ] **Expected**: Success message
- [ ] **Expected**: Redirect to `/courses/maths`
- [ ] **Verify Database**: Check `enrollments` table
  - `subscription_tier` should be `'free'`
  - `status` should be `'active'`
  - `lessons_completed` should be `0`

#### Test 2.3: View Course Dashboard
- [ ] Should be on `/courses/maths` page
- [ ] **Expected**: See "Your Progress" section
- [ ] **Expected**: See 100 lessons in grid
- [ ] **Expected**: First 25 lessons accessible (Free tier)
- [ ] **Expected**: Lessons 26-100 show lock icon

#### Test 2.4: Premium Access Check
- [ ] Click on lesson #50 (premium)
- [ ] **Expected**: Redirect to course page with error
- [ ] **Expected**: Modal prompting upgrade to premium

---

### Phase 3: Lesson Content Viewing ✓

#### Test 3.1: Access Free Lesson
- [ ] Click on Lesson #001 (Simplifying Expressions)
- [ ] **Expected**: Load lesson page
- [ ] **Expected**: See lesson dashboard with 0 stats
- [ ] Click "View Lesson Content" button
- [ ] **Expected**: Modal opens with lesson slides

#### Test 3.2: Navigate Lesson Slides
- [ ] Click "Next Slide" button
- [ ] **Expected**: Progress to next slide
- [ ] Continue through all slides
- [ ] On last slide, click "Complete Lesson"
- [ ] **Expected**: Modal closes
- [ ] **Expected**: Success message
- [ ] **Verify Database**: Check `lesson_progress` table
  - `lesson_completed` should be `true`
  - `lesson_completed_at` should have timestamp

#### Test 3.3: View Lesson After Completion
- [ ] Refresh page or navigate away and back
- [ ] **Expected**: "Content Completed" badge visible
- [ ] **Expected**: "View Lesson Content" still accessible

---

### Phase 4: Practice Questions ✓

#### Test 4.1: Start Practice Session
- [ ] On lesson page, click "Practice Questions" button
- [ ] **Expected**: Full-screen practice modal opens
- [ ] **Expected**: Loading spinner briefly shows
- [ ] **Expected**: Question #1 displays with input field
- [ ] **Expected**: Input field is auto-focused
- [ ] **Verify Database**: Check `practice_sessions` table
  - Should have new record with `started_at` timestamp
  - `completed_at` should be `NULL`
  - `questions_attempted` should be `0`

#### Test 4.2: Submit Correct Answer
- [ ] Type correct answer in input field
- [ ] Press Enter or click "Submit Answer"
- [ ] **Expected**: Green checkmark appears
- [ ] **Expected**: "Correct!" message shows
- [ ] **Expected**: Next button is auto-focused
- [ ] **Verify Database**: Check `question_attempts` table
  - Should have new record
  - `is_correct` should be `true`
  - `user_answer` matches your input
  - `time_taken_seconds` has value

#### Test 4.3: Submit Wrong Answer
- [ ] Press Enter to go to next question
- [ ] Type wrong answer
- [ ] Press Enter to submit
- [ ] **Expected**: Red X appears
- [ ] **Expected**: "Incorrect" message shows
- [ ] **Expected**: Correct answer is displayed
- [ ] **Verify Database**: Check `question_attempts` table
  - New record with `is_correct` = `false`

#### Test 4.4: Complete Practice Session (10 Questions)
- [ ] Continue answering questions
- [ ] Keep track of correct vs incorrect answers
- [ ] Answer all 10 questions
- [ ] **Expected**: Modal closes after question #10
- [ ] **Expected**: Return to lesson dashboard
- [ ] **Verify Database**: Check `practice_sessions` table
  - `completed_at` should now have timestamp
  - `questions_attempted` should be `10`
  - `questions_correct` should match your correct count
  - `accuracy_percentage` should be calculated correctly
  - `duration_seconds` should reflect time spent

#### Test 4.5: Verify Dashboard Updates
- [ ] Check lesson dashboard stats
- [ ] **Expected**: "Questions Attempted" shows unique question count
- [ ] **Expected**: "Average Accuracy" shows percentage
- [ ] **Expected**: "Practice Attempts" shows `1`
- [ ] **Expected**: "Time Spent" shows minutes
- [ ] **Verify Database**: Check `lesson_progress` table
  - `attempts` should be `1` (session count)
  - `accuracy_score` updated
  - `last_attempt_at` has timestamp

---

### Phase 5: Multiple Practice Sessions ✓

#### Test 5.1: Second Practice Session
- [ ] Click "Practice Questions" again
- [ ] **Expected**: New set of 10 random questions
- [ ] Complete all 10 questions
- [ ] **Verify Database**: `practice_sessions` should have 2 records
- [ ] **Expected**: Dashboard "Practice Attempts" shows `2`

#### Test 5.2: Answer Same Question Differently
- [ ] Start new practice session
- [ ] If you encounter a question you answered before:
  - Answer it differently this time
  - **Verify Database**: Check `question_attempts` table
    - Should have MULTIPLE records for same question_id
    - Each with different `attempted_at` timestamp
- [ ] **Expected**: Dashboard shows most recent attempt result

#### Test 5.3: Unique Questions Count
- [ ] Complete several practice sessions
- [ ] **Expected**: "Questions Attempted" counts unique questions
- [ ] **Expected**: Max should be 30 (practice mode uses first 30)
- [ ] **Verify Calculation**: Count DISTINCT question_id in database
  - Should match dashboard display

---

### Phase 6: Different Practice Modes ✓

#### Test 6.1: Timed Challenge
- [ ] Click "Timed Challenge" button
- [ ] **Expected**: 15 questions (not 10)
- [ ] **Expected**: Timer or time tracking visible (if implemented)
- [ ] Complete session
- [ ] **Verify Database**: `practice_sessions` record
  - `practice_mode` should be `'timed'`
  - `questions_attempted` should be `15`

#### Test 6.2: Expert Mode
- [ ] Click "Expert Mode" button
- [ ] **Expected**: 15 harder questions (#150-300 range)
- [ ] **Expected**: Questions noticeably more difficult
- [ ] Complete session
- [ ] **Verify Database**: `practice_mode` should be `'expert'`

#### Test 6.3: Weak Areas Practice
- [ ] Ensure you have some incorrect answers from previous sessions
- [ ] Click "Weak Areas" button
- [ ] **Expected**: 10 questions from previously incorrect answers
- [ ] **Verify**: Questions should be ones you got wrong before
- [ ] Complete session
- [ ] **Verify Database**: `practice_mode` should be `'weak_areas'`

---

### Phase 7: Multiple Lessons ✓

#### Test 7.1: Complete Multiple Lessons
- [ ] Go to course dashboard `/courses/maths`
- [ ] Access Lesson #002
- [ ] View lesson content and complete it
- [ ] Do practice questions
- [ ] Repeat for Lesson #003
- [ ] **Verify Database**: `lesson_progress` has records for all 3 lessons
- [ ] **Verify Database**: `enrollments.lessons_completed` increments

#### Test 7.2: Course Progress Tracking
- [ ] Return to `/courses/maths`
- [ ] **Expected**: Completed lessons show completion badge
- [ ] **Expected**: "Your Progress" section shows overall stats
- [ ] **Expected**: "Continue Learning" shows next incomplete lesson

---

### Phase 8: Edge Cases & Error Handling ✓

#### Test 8.1: Direct URL Access
- [ ] Log out
- [ ] Try accessing `/courses/maths/lessons/001_simplifying_expressions` directly
- [ ] **Expected**: Redirect to login with return URL
- [ ] Log in
- [ ] **Expected**: Redirect back to lesson page

#### Test 8.2: Unenrolled Course Access
- [ ] Log in with account NOT enrolled in Maths
- [ ] Try accessing `/courses/maths/lessons/001_simplifying_expressions`
- [ ] **Expected**: Redirect to home with error message

#### Test 8.3: Premium Lesson Access (Free User)
- [ ] As free tier user, try accessing lesson #50 URL directly
- [ ] **Expected**: Redirect to course page
- [ ] **Expected**: Error message about premium required

#### Test 8.4: Invalid Lesson Slug
- [ ] Try accessing `/courses/maths/lessons/invalid_lesson`
- [ ] **Expected**: Redirect to course dashboard
- [ ] **Expected**: 404 or "lesson not found" message

#### Test 8.5: Network Errors
- [ ] Open browser DevTools → Network tab
- [ ] Throttle to "Slow 3G"
- [ ] Start practice session
- [ ] **Expected**: Loading states show properly
- [ ] Submit answer
- [ ] **Expected**: Button shows loading state
- [ ] **Expected**: No errors or crashes

#### Test 8.6: Empty Answer Submission
- [ ] Start practice session
- [ ] Leave answer field empty
- [ ] Try to submit
- [ ] **Expected**: Validation prevents submission OR
- [ ] **Expected**: Counted as incorrect with empty string

---

### Phase 9: Data Integrity Checks ✓

#### Test 9.1: Session Counting Accuracy
- [ ] Complete exactly 5 practice sessions
- [ ] **Verify Database Query**:
  ```sql
  SELECT COUNT(*) FROM practice_sessions 
  WHERE user_id = '<your-user-id>' 
  AND lesson_id = 1 
  AND completed_at IS NOT NULL;
  ```
- [ ] **Expected**: Result should be `5`
- [ ] Check dashboard
- [ ] **Expected**: "Practice Attempts" shows `5`
- [ ] **Verify**: `lesson_progress.attempts` = `5`

#### Test 9.2: Accuracy Calculation
- [ ] Review your question_attempts in database
- [ ] Calculate expected accuracy manually:
  ```
  Unique questions: Count DISTINCT question_id
  Correct: Count WHERE is_correct = true (most recent attempt per question)
  Accuracy = (Correct / Unique) * 100
  ```
- [ ] Compare with dashboard display
- [ ] **Expected**: Should match within 1% (rounding)

#### Test 9.3: Time Tracking
- [ ] Note start time before beginning session
- [ ] Complete session
- [ ] Note end time
- [ ] **Verify Database**: `duration_seconds` in `practice_sessions`
- [ ] **Expected**: Should be approximately actual time spent
- [ ] Check dashboard "Time Spent"
- [ ] **Expected**: Sum of all session durations

#### Test 9.4: Data Consistency Across Tables
- [ ] Run SQL query to check consistency:
  ```sql
  -- Session count should match lesson_progress.attempts
  SELECT 
    lp.attempts as progress_attempts,
    COUNT(ps.id) as actual_sessions
  FROM lesson_progress lp
  LEFT JOIN practice_sessions ps 
    ON ps.user_id = lp.user_id 
    AND ps.lesson_id = lp.lesson_id
    AND ps.completed_at IS NOT NULL
  WHERE lp.user_id = '<your-user-id>'
  AND lp.lesson_id = 1
  GROUP BY lp.attempts;
  ```
- [ ] **Expected**: `progress_attempts` = `actual_sessions`

---

### Phase 10: Security & RLS Testing ✓

#### Test 10.1: Row Level Security (RLS)
- [ ] Create second test user account
- [ ] Enroll in Maths course
- [ ] Do some practice on Lesson #001
- [ ] **Verify**: User 1 cannot see User 2's data
- [ ] **Database Check**: Try querying as User 2:
  ```sql
  -- Should return ONLY User 2's data, not User 1
  SELECT * FROM question_attempts WHERE lesson_id = 1;
  ```

#### Test 10.2: API Authentication
- [ ] Open browser DevTools → Network tab
- [ ] Log out
- [ ] Try calling `/api/submit-answer` directly:
  ```javascript
  fetch('/api/submit-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ... })
  })
  ```
- [ ] **Expected**: 401 Unauthorized response

#### Test 10.3: Premium Content Access
- [ ] As free user, try forcing access to lesson 50:
  - Modify URL directly
  - Use browser DevTools to modify UI
- [ ] **Expected**: Server-side check prevents access
- [ ] **Expected**: Redirect or error message

---

## Database Verification Queries

### Check Session Counts
```sql
SELECT 
  user_id,
  lesson_id,
  COUNT(*) as total_sessions,
  SUM(questions_attempted) as total_questions,
  SUM(questions_correct) as total_correct,
  AVG(accuracy_percentage) as avg_accuracy,
  SUM(duration_seconds) as total_seconds
FROM practice_sessions
WHERE completed_at IS NOT NULL
GROUP BY user_id, lesson_id;
```

### Check Unique Questions Attempted
```sql
SELECT 
  user_id,
  lesson_id,
  COUNT(DISTINCT question_id) as unique_questions,
  COUNT(*) as total_attempts
FROM question_attempts
GROUP BY user_id, lesson_id;
```

### Check Accuracy Calculation
```sql
WITH latest_attempts AS (
  SELECT DISTINCT ON (user_id, question_id)
    user_id,
    lesson_id,
    question_id,
    is_correct
  FROM question_attempts
  ORDER BY user_id, question_id, attempted_at DESC
)
SELECT 
  user_id,
  lesson_id,
  COUNT(*) as unique_questions,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_count,
  ROUND(
    (SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100,
    2
  ) as accuracy_percentage
FROM latest_attempts
GROUP BY user_id, lesson_id;
```

---

## Expected Results Summary

After completing all tests, you should have:

### Database Records
- ✅ 1-2 records in `auth.users`
- ✅ 1-2 records in `enrollments` (one per test user)
- ✅ 3+ records in `lesson_progress` (one per lesson tested)
- ✅ 10+ records in `practice_sessions` (multiple sessions per lesson)
- ✅ 50+ records in `question_attempts` (10-15 per session)

### Dashboard Accuracy
- ✅ "Questions Attempted" = COUNT(DISTINCT question_id)
- ✅ "Average Accuracy" = Calculated from most recent attempt per question
- ✅ "Practice Attempts" = COUNT(completed practice_sessions)
- ✅ "Time Spent" = SUM(duration_seconds) converted to minutes

### Functional Features
- ✅ Complete keyboard navigation (Tab + Enter)
- ✅ Auto-focus on input and buttons
- ✅ Real-time feedback on answers
- ✅ Session tracking (not question tracking)
- ✅ Multiple attempts allowed per question
- ✅ Different practice modes working
- ✅ Premium vs Free tier enforcement
- ✅ RLS preventing cross-user data access

---

## Common Issues & Troubleshooting

### Issue: Dashboard shows 0 practice attempts
**Solution**: Check `practice_sessions.completed_at` - must be NOT NULL

### Issue: Accuracy not updating
**Solution**: Verify `lesson_accuracy_stats` view exists and has data

### Issue: Questions repeat immediately
**Solution**: Check question selection logic - should be randomized

### Issue: Session not created
**Solution**: Check browser console for API errors, verify migrations applied

### Issue: RLS blocking own data access
**Solution**: Check `auth.uid()` in RLS policies matches user token

---

## Performance Benchmarks

Expected load times (on good connection):
- **Lesson page load**: < 1 second
- **Practice modal open**: < 500ms
- **Answer submission**: < 300ms
- **Database query (stats)**: < 200ms

If significantly slower, check:
- Database indexes are applied
- RLS policies are optimized
- No N+1 query problems

---

## Sign-Off Checklist

Before deploying to production:
- [ ] All Phase 1-10 tests passed
- [ ] Database queries optimized
- [ ] RLS policies verified secure
- [ ] Error messages are user-friendly
- [ ] Loading states show appropriately
- [ ] Mobile responsive (test on phone)
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Performance benchmarks met
- [ ] No console errors in production build
- [ ] Environment variables configured
- [ ] Supabase RLS enabled on all tables

---

**Happy Testing! 🎉**

After completing this checklist, you'll have confidence that the entire practice question system is working correctly with proper session tracking, accurate statistics, and secure data access.
