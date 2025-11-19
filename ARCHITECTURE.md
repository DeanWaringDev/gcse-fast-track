# GCSE FastTrack - Code Architecture Documentation

## Project Overview

Educational platform for GCSE exam preparation with interactive lessons and practice questions.

**Tech Stack**:
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Language**: TypeScript

---

## Directory Structure

```
gcse-fast-track/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes (server-side)
│   │   ├── submit-answer/        # POST: Record question answer
│   │   ├── complete-lesson/      # POST: Mark lesson content complete
│   │   ├── update-progress/      # POST: Update lesson statistics
│   │   ├── start-practice-session/    # POST: Create session record
│   │   ├── complete-practice-session/ # POST: Finalize session stats
│   │   └── lesson-content/       # GET: Serve markdown content
│   ├── courses/                  # Course pages
│   │   └── maths/                # Maths course
│   │       └── lessons/          # Dynamic lesson pages
│   │           └── [slug]/       # Individual lesson page
│   ├── dashboard/                # User dashboard
│   ├── login/                    # Login page
│   ├── signup/                   # Registration page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── Header.tsx                # Site header with nav
│   ├── Footer.tsx                # Site footer
│   ├── LessonCard.tsx            # Lesson grid item
│   ├── LessonDashboard.tsx       # Lesson stats display
│   ├── LessonContentModal.tsx    # Lesson slide viewer
│   ├── PracticeSession.tsx       # Practice modal container
│   ├── QuestionCard.tsx          # Single question display
│   └── EnrollButton.tsx          # Course enrollment
├── lib/                          # Shared utilities
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server client
│   └── types/                    # TypeScript definitions
│       ├── enrollment.ts         # Enrollment types
│       ├── lesson-progress.ts    # Progress types
│       └── practice-session.ts   # Practice types
├── public/                       # Static assets
│   └── data/                     # Course content
│       └── maths/                # Maths course data
│           ├── lessons.json      # Lesson metadata
│           ├── courses.json      # Course metadata
│           ├── instructions/     # Markdown lesson content
│           ├── questions/        # Question JSON files
│           └── answers/          # Answer JSON files
└── supabase/                     # Database migrations
    └── migrations/               # SQL migration files
```

---

## Database Schema

### Tables Overview

```
┌─────────────────┐
│   auth.users    │  (Managed by Supabase Auth)
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
┌────────▼────────┐  ┌─────▼──────────────┐
│  enrollments    │  │  lesson_progress   │
│  - user_id      │  │  - user_id         │
│  - course_slug  │  │  - lesson_id       │
│  - subscription │  │  - accuracy_score  │
│  - status       │  │  - attempts        │
└─────────────────┘  └──────┬─────────────┘
                            │
                ┌───────────┴──────────────┐
                │                          │
      ┌─────────▼─────────┐    ┌──────────▼──────────┐
      │ question_attempts │    │ practice_sessions   │
      │ - question_id     │    │ - practice_mode     │
      │ - is_correct      │    │ - questions_correct │
      │ - user_answer     │    │ - duration_seconds  │
      └───────────────────┘    └─────────────────────┘
```

### Detailed Schema

#### **enrollments**
Tracks which courses users have enrolled in and their subscription tier.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users |
| course_slug | VARCHAR(100) | Course identifier (e.g., 'maths') |
| status | VARCHAR(20) | 'active', 'withdrawn', 'completed' |
| subscription_tier | VARCHAR(20) | 'free' (25 lessons) or 'premium' (all) |
| enrolled_at | TIMESTAMP | When user enrolled |
| lessons_completed | INTEGER | Count of completed lessons |

**Indexes**: user_id, course_slug, user_id+course_slug (unique)
**RLS**: Users can only view/modify their own enrollments

---

#### **lesson_progress**
Aggregated statistics for each lesson per user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users |
| lesson_id | INTEGER | Lesson number (1-100) |
| lesson_slug | VARCHAR(255) | Lesson slug identifier |
| is_completed | BOOLEAN | Overall lesson mastery |
| lesson_completed | BOOLEAN | Content viewing completion |
| accuracy_score | DECIMAL(5,2) | Percentage 0-100 |
| attempts | INTEGER | Number of practice sessions |
| time_spent_minutes | INTEGER | Total time across sessions |
| confidence_level | INTEGER | User self-reported (0-10) |

**Important**: 
- `attempts` = COUNT of practice_sessions (not questions)
- `accuracy_score` = Calculated from question_attempts
- Updated via API after each practice session

**Indexes**: user_id, lesson_id, user_id+lesson_id (unique)
**RLS**: Users can only view/modify their own progress

---

#### **question_attempts**
Records EVERY individual question answer (allows multiple attempts).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users |
| lesson_id | INTEGER | Lesson number |
| question_id | VARCHAR(50) | Question identifier (e.g., "001") |
| section_id | VARCHAR(50) | Section grouping |
| user_answer | TEXT | User's submitted answer |
| correct_answer | TEXT | Correct answer |
| is_correct | BOOLEAN | Whether answer was correct |
| practice_mode | VARCHAR(50) | practice, timed, expert, weak_areas |
| time_taken_seconds | INTEGER | Time spent on question |
| attempted_at | TIMESTAMP | When answered |

**No Unique Constraint**: Users can attempt same question multiple times
**Used For**: 
- Calculating lesson accuracy (most recent attempt per question)
- Identifying weak areas
- Progress tracking over time

**Indexes**: user_id, lesson_id, question_id, attempted_at
**RLS**: Users can only view/modify their own attempts

---

#### **practice_sessions**
Tracks each practice run as a single unified session.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to auth.users |
| lesson_id | INTEGER | Lesson number |
| practice_mode | VARCHAR(50) | practice, timed, expert, weak_areas |
| questions_attempted | INTEGER | Questions in this session (10-15) |
| questions_correct | INTEGER | Correct answers in session |
| accuracy_percentage | DECIMAL(5,2) | Session accuracy |
| duration_seconds | INTEGER | Total session time |
| started_at | TIMESTAMP | Session start time |
| completed_at | TIMESTAMP | Session end time (NULL if incomplete) |

**Purpose**: Count practice sessions separately from individual questions
**Usage**: 
- Dashboard "Practice Attempts" = COUNT(WHERE completed_at NOT NULL)
- Dashboard "Time Spent" = SUM(duration_seconds)
- lesson_progress.attempts = session count

**Indexes**: user_id, lesson_id, practice_mode, started_at
**RLS**: Users can only view/modify their own sessions

---

## Data Flow & Architecture

### User Journey: Answering Practice Questions

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Practice Questions" on lesson page          │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 2. PracticeSession component loads                          │
│    - Fetches questions JSON from /public/data/              │
│    - Fetches answers JSON from /public/data/                │
│    - Selects 10 random questions (practice mode)            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 3. Start practice session                                   │
│    POST /api/start-practice-session                         │
│    - Creates practice_sessions record                       │
│    - Returns sessionId                                      │
│    - Sets started_at timestamp                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 4. Display first question (QuestionCard)                    │
│    - Auto-focus on input field                              │
│    - User types answer                                      │
│    - User presses Enter                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 5. Submit answer                                            │
│    POST /api/submit-answer                                  │
│    - Compares user answer to correct answer                 │
│    - Creates question_attempts record                       │
│    - Returns isCorrect and correctAnswer                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 6. Show feedback                                            │
│    - Green checkmark if correct                             │
│    - Red X if incorrect                                     │
│    - Display correct answer                                 │
│    - Auto-focus Next button                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 7. User presses Enter again → Next question                 │
│    - Repeat steps 4-7 for questions 2-10                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 8. Complete practice session (after question 10)            │
│    POST /api/complete-practice-session                      │
│    - Updates practice_sessions record                       │
│    - Sets completed_at timestamp                            │
│    - Calculates accuracy_percentage                         │
│    - Records duration_seconds                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 9. Update lesson progress                                   │
│    POST /api/update-progress                                │
│    - Queries lesson_accuracy_stats view                     │
│    - Updates lesson_progress.accuracy_score                 │
│    - Updates lesson_progress.attempts (session count)       │
│    - Updates lesson_progress.last_attempt_at                │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ 10. Refresh lesson page                                     │
│    - Dashboard stats update                                 │
│    - Shows new practice attempt count                       │
│    - Shows updated accuracy                                 │
│    - Shows updated time spent                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### Decision 1: Session vs Question Tracking

**Problem**: Should we count individual questions or practice sessions?

**Solution**: Track BOTH separately
- **question_attempts**: Every individual answer (for accuracy)
- **practice_sessions**: Each practice run (for session count)

**Rationale**:
- Users think in terms of "practice sessions" (10 questions = 1 session)
- Need individual answers for accuracy calculation
- Prevents confusion where 10 questions = 10 "attempts" in dashboard

---

### Decision 2: Answer Validation Location

**Current**: Client-side comparison after server records answer
**Reason**: 
- Simpler implementation
- Answers already sent to client (from JSON)
- Server still records all attempts
- Future enhancement: Move validation server-side

---

### Decision 3: Question JSON Structure

**Chosen Structure**:
```json
{
  "sections": [
    {
      "sectionId": "warm_up",
      "sectionTitle": "Warm-Up Questions",
      "questions": [
        { "id": 1, "question": "Simplify: 3x + 5x" }
      ]
    }
  ]
}
```

**Rationale**:
- Organized by topic sections
- Easy to filter questions by difficulty
- Supports future section-specific practice
- IDs are numeric but converted to strings in code

---

### Decision 4: Practice Modes

| Mode | Questions | Source | Purpose |
|------|-----------|--------|---------|
| practice | 10 | #1-30 | Foundation practice |
| timed | 15 | #1-30 | Timed challenge |
| expert | 15 | #150-300 | Advanced difficulty |
| weak_areas | 10 | Incorrect answers | Targeted review |

**Rationale**:
- Progressive difficulty (foundation → expert)
- Different challenge levels
- Adaptive learning (weak areas)

---

### Decision 5: Auto-Focus Flow

**Implementation**: useRef + useEffect
```typescript
// Auto-focus input when question changes
useEffect(() => {
  inputRef.current?.focus();
}, [question.id]);

// Auto-focus Next button after submission
useEffect(() => {
  if (isSubmitted) {
    nextButtonRef.current?.focus();
  }
}, [isSubmitted]);
```

**Result**: Complete keyboard navigation
1. Type answer → Enter (submit)
2. Enter again (next question)
3. Repeat

**Rationale**: Faster user experience, accessibility

---

## API Design Patterns

### Pattern 1: Authentication Check

**Every protected route**:
```typescript
const supabase = await createClient();
const { data: { user }, error: authError } = await supabase.auth.getUser();

if (authError || !user) {
  return NextResponse.json(
    { error: 'Unauthorized - Please login' },
    { status: 401 }
  );
}
```

### Pattern 2: Input Validation

**Detailed validation with helpful errors**:
```typescript
if (!courseSlug || !lessonId || !questionId) {
  const missingFields = [];
  if (!courseSlug) missingFields.push('courseSlug');
  if (!lessonId) missingFields.push('lessonId');
  if (!questionId) missingFields.push('questionId');
  
  return NextResponse.json(
    { error: `Missing required fields: ${missingFields.join(', ')}` },
    { status: 400 }
  );
}
```

### Pattern 3: Error Handling

**Try-catch with logging**:
```typescript
try {
  // ... operation
} catch (error) {
  console.error('Error in API route:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## Component Architecture

### Pattern 1: Data Fetching (Lesson Page)

**Server-side authentication + RLS data fetching**:
```typescript
// 1. Check authentication
const { data: { user } } = await supabase.auth.getUser();

// 2. Check enrollment (RLS auto-filters by user_id)
const { data: enrollment } = await supabase
  .from('enrollments')
  .eq('course_slug', 'maths')
  .eq('status', 'active')
  .single();

// 3. Verify lesson access
if (!lesson.isFree && enrollment.subscription_tier !== 'premium') {
  router.push('/courses/maths?error=premium-required');
}

// 4. Fetch progress data (RLS auto-filters)
const { data: progress } = await supabase
  .from('lesson_progress')
  .eq('lesson_id', lesson.id)
  .single();
```

### Pattern 2: Modal Management

**State-based modal rendering**:
```typescript
const [showContentModal, setShowContentModal] = useState(false);
const [activeMode, setActiveMode] = useState<string | null>(null);

// Show lesson content
{showContentModal && (
  <LessonContentModal 
    onClose={() => setShowContentModal(false)}
  />
)}

// Show practice session
{activeMode === 'practice' && (
  <PracticeSession
    practiceMode="practice"
    onClose={() => setActiveMode(null)}
  />
)}
```

---

## Performance Optimizations

### Database Indexes

**High-performance queries via indexes**:
```sql
CREATE INDEX idx_question_attempts_user_lesson 
  ON question_attempts(user_id, lesson_id);

CREATE INDEX idx_practice_sessions_user_lesson 
  ON practice_sessions(user_id, lesson_id);
```

### Aggregate Views

**Pre-calculated statistics**:
```sql
CREATE VIEW lesson_accuracy_stats AS
SELECT 
  user_id,
  lesson_id,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
  ROUND((SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2) 
    as accuracy_percentage
FROM question_attempts
GROUP BY user_id, lesson_id;
```

**Usage**: API queries view instead of aggregating on-the-fly

---

## Testing Strategy

### Unit Tests (Future)
- API route handlers
- Utility functions
- Component logic

### Integration Tests (Manual - See TESTING_GUIDE.md)
- Complete user flows
- Database integrity
- RLS policy verification

### E2E Tests (Future)
- Playwright/Cypress
- Full user journeys
- Cross-browser testing

---

## Deployment Checklist

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

### Vercel Settings
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 18.x or higher

### Supabase Settings
- RLS enabled on all tables
- Email verification enabled (optional)
- Rate limiting configured
- API keys secured

---

## Future Enhancements

### Phase 2 Features
- [ ] Worksheet generation (PDF export)
- [ ] Progress charts and analytics
- [ ] Leaderboards (optional)
- [ ] Parent dashboard
- [ ] Teacher accounts

### Phase 3 Features
- [ ] Video lessons
- [ ] Live tutoring
- [ ] Study groups
- [ ] Mobile app

---

**Last Updated**: January 19, 2025
**Version**: 1.0.0
**Status**: Ready for comprehensive testing
