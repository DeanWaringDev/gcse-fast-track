# ✅ Pre-Testing Checklist

**Complete these items before starting comprehensive testing**

---

## 1. Environment Verification

### Local Development Server
- [ ] Run `npm run dev` successfully
- [ ] Navigate to `http://localhost:3000`
- [ ] Home page loads without errors
- [ ] No console errors in browser DevTools

### Supabase Connection
- [ ] Supabase project accessible
- [ ] Environment variables set correctly:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Can access Supabase Dashboard

---

## 2. Database Setup

### Tables Verified
- [ ] `auth.users` exists (managed by Supabase)
- [ ] `enrollments` table exists
- [ ] `lesson_progress` table exists
- [ ] `question_attempts` table exists
- [ ] `practice_sessions` table exists

### Clear Old Data
- [ ] Delete all rows from `practice_sessions`
- [ ] Delete all rows from `question_attempts`
- [ ] Delete all rows from `lesson_progress`
- [ ] Delete all rows from `enrollments`
- [ ] Optionally: Delete test users from `auth.users`

### Migrations Applied
- [ ] ✅ `20250118_create_enrollments.sql`
- [ ] ✅ `20250118_create_lesson_progress.sql`
- [ ] ✅ `20250119_add_lesson_completed.sql`
- [ ] ✅ `20250119_create_question_attempts.sql`
- [ ] ✅ `20250119_create_practice_sessions.sql`

### Views Exist
- [ ] `lesson_accuracy_stats` view
- [ ] `course_accuracy_stats` view
- [ ] `weak_questions` view
- [ ] `lesson_session_stats` view

### RLS Enabled
- [ ] `enrollments` - RLS enabled ✓
- [ ] `lesson_progress` - RLS enabled ✓
- [ ] `question_attempts` - RLS enabled ✓
- [ ] `practice_sessions` - RLS enabled ✓

---

## 3. Static Files Check

### Data Files Exist
- [ ] `/public/data/maths/lessons.json`
- [ ] `/public/data/maths/courses.json`
- [ ] `/public/data/maths/instructions/001_maths_lesson.md`
- [ ] `/public/data/maths/questions/001_maths_questions.json`
- [ ] `/public/data/maths/answers/001_maths_answers.json`

### Sample Data Check
Open `001_maths_questions.json`:
- [ ] Has `sections` array
- [ ] Each section has `questions` array
- [ ] Questions have `id` and `question` fields

Open `001_maths_answers.json`:
- [ ] Has `answers` array
- [ ] Each answer has `id`, `question`, `answer` fields
- [ ] IDs match questions file

---

## 4. Code Review (Quick Verification)

### No Build Errors
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No ESLint errors

### API Routes Accessible
Test with curl or browser:
```bash
# Should return 401 Unauthorized (correct - needs auth)
curl http://localhost:3000/api/submit-answer -X POST

# Should work (public endpoint)
curl "http://localhost:3000/api/lesson-content?file=001_maths_lesson.md"
```
- [ ] Protected routes require auth (401)
- [ ] Public routes return data

---

## 5. Documentation Ready

### Review Documents
- [ ] Read `START_HERE.md` (quick overview)
- [ ] Skim `TESTING_GUIDE.md` (know what's coming)
- [ ] Check `SUMMARY.md` (understand what changed)

### Testing Materials Prepared
- [ ] `TESTING_GUIDE.md` open in editor
- [ ] Notepad ready for issue tracking
- [ ] Screenshot tool ready
- [ ] Supabase Dashboard open in browser tab

---

## 6. Browser Setup

### DevTools Ready
- [ ] Open browser DevTools (F12)
- [ ] Console tab visible (for errors)
- [ ] Network tab accessible (for API calls)
- [ ] Application tab accessible (for cookies/storage)

### Clear Cache
- [ ] Clear browser cache
- [ ] Clear cookies for localhost
- [ ] Clear local storage
- [ ] Start fresh session

---

## 7. Testing Account Plan

### User Accounts
Plan to create:
- [ ] User 1: Primary testing account
- [ ] User 2: Cross-user security testing

### Account Details to Record
For each test user, note:
- Email: ___________________________
- Password: ________________________
- User ID (from Supabase): __________

---

## 8. Time & Focus

### Schedule
- [ ] Clear 2-4 hours for testing
- [ ] No interruptions planned
- [ ] Good internet connection
- [ ] Coffee/tea ready ☕

### Mindset
- [ ] Ready to test systematically
- [ ] Will note ALL issues (even minor)
- [ ] Won't skip steps
- [ ] Will verify database after each phase

---

## 9. Backup & Safety

### Git Status
```bash
git status
```
- [ ] All changes committed
- [ ] Working directory clean
- [ ] Pushed to GitHub

### Branch (Optional but Recommended)
```bash
git checkout -b testing-phase-1
```
- [ ] Create testing branch (optional)
- [ ] Main branch preserved

---

## 10. Final Checks

### Application Running
- [ ] Dev server running (`npm run dev`)
- [ ] No startup errors
- [ ] Can access home page
- [ ] Can access login page

### Database Accessible
- [ ] Supabase Dashboard loads
- [ ] Can view tables
- [ ] Can run SQL queries
- [ ] RLS policies visible

### Documentation Open
- [ ] `TESTING_GUIDE.md` open
- [ ] `START_HERE.md` read
- [ ] Ready to follow checklist

---

## 🎯 Ready to Start?

When ALL items above are checked:

### Step 1: Start Fresh
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Ready for git commands
git status
```

### Step 2: Open Testing Guide
```bash
code TESTING_GUIDE.md
```

### Step 3: Begin Phase 1
Follow `TESTING_GUIDE.md` → Phase 1: Authentication Flow

---

## 📝 Issue Tracking Template

When you find an issue, note:

```
Issue #X: [Short Description]
Phase: [1-10]
Test: [Specific test number]

What I Did:
1. 
2. 
3. 

Expected:
- 

Actual:
- 

Console Error:
```
[paste error if any]
```

Database State:
[SQL query result if relevant]

Screenshot: [yes/no]
```

---

## 🚀 You're Ready!

Everything is prepared:
- ✅ Code reviewed and documented
- ✅ Database ready
- ✅ Testing guide created
- ✅ Documentation comprehensive
- ✅ No build errors
- ✅ All migrations applied

**Time to make today count!** 🎉

---

**When all checkboxes above are ticked, you're ready to begin comprehensive testing.**

**Next:** Open `TESTING_GUIDE.md` and start with Phase 1 ✨
