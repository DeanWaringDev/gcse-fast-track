'use client';

/**
 * Practice Session Component
 * 
 * Full-screen modal managing practice question sessions with progress tracking.
 * Handles question loading, answer submission, session timing, and results display.
 * 
 * Practice Modes:
 * - practice: 10 random questions from first 30 (foundation level)
 * - timed: 15 random questions from first 30 (timed challenge)
 * - expert: 15 random questions from #150-300 (advanced level)
 * - weak_areas: 10 questions from previously incorrect answers
 * 
 * Session Flow:
 * 1. Load questions and answers from JSON files
 * 2. Create practice session record in database (tracks as 1 session)
 * 3. Present questions one at a time with QuestionCard component
 * 4. Track correct answers count throughout session
 * 5. Submit each answer to question_attempts table
 * 6. Complete session record with final stats when finished
 * 7. Update lesson progress with new accuracy data
 * 8. Trigger refresh callback to update dashboard
 * 
 * Database Integration:
 * - practice_sessions: Records session start/completion (one record per practice run)
 * - question_attempts: Records each individual answer
 * - lesson_progress: Updated with aggregated statistics
 * 
 * @component
 */

import { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

interface Question {
  id: string;
  question: string;
  sectionId?: string;
  sectionTitle?: string;
}

interface Answer {
  id: string;
  question: string;
  answer: string;
  sectionId?: string;
  sectionTitle?: string;
}

interface PracticeSessionProps {
  courseSlug: string;
  lessonId: number;
  lessonSlug: string;
  lessonTitle: string;
  questionsFile: string;
  answersFile: string;
  practiceMode: 'practice' | 'timed' | 'expert' | 'weak_areas';
  onComplete: () => void;
  onClose: () => void;
}

export default function PracticeSession({
  courseSlug,
  lessonId,
  lessonSlug,
  lessonTitle,
  questionsFile,
  answersFile,
  practiceMode,
  onComplete,
  onClose
}: PracticeSessionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null);
  const [sessionStartTime] = useState(Date.now());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    // Start practice session when questions are loaded
    if (questions.length > 0 && !sessionId) {
      startPracticeSession();
    }
  }, [questions]);

  async function loadQuestions() {
    try {
      // Load questions JSON
      const questionsResponse = await fetch(`/data/${courseSlug}/questions/${questionsFile}`);
      const questionsData = await questionsResponse.json();

      // Load answers JSON
      const answersResponse = await fetch(`/data/${courseSlug}/answers/${answersFile}`);
      const answersData = await answersResponse.json();

      // Create answer lookup map
      const answerMap = new Map<string, Answer>();
      answersData.answers.forEach((ans: any) => {
        answerMap.set(ans.id.toString(), {
          id: ans.id.toString(),
          question: ans.question,
          answer: ans.answer.toString(),
          sectionId: ans.sectionId,
          sectionTitle: ans.sectionTitle,
        });
      });
      setAnswers(answerMap);

      // Flatten questions from sections
      const allQuestions: Question[] = [];
      questionsData.sections.forEach((section: any) => {
        section.questions.forEach((q: any) => {
          allQuestions.push({
            id: q.id.toString(),
            question: q.question,
            sectionId: section.sectionId,
            sectionTitle: section.sectionTitle,
          });
        });
      });

      // Select questions based on mode
      let selectedQuestions: Question[] = [];
      
      if (practiceMode === 'practice') {
        // Practice: 10 random from first 30 questions
        const firstThirty = allQuestions.slice(0, 30);
        selectedQuestions = getRandomQuestions(firstThirty, 10);
      } else if (practiceMode === 'timed') {
        // Timed: 15 random from first 30
        const firstThirty = allQuestions.slice(0, 30);
        selectedQuestions = getRandomQuestions(firstThirty, 15);
      } else if (practiceMode === 'expert') {
        // Expert: 15 random from questions 150-300
        const expertQuestions = allQuestions.slice(149, 300);
        selectedQuestions = getRandomQuestions(expertQuestions, 15);
      } else if (practiceMode === 'weak_areas') {
        // Weak areas: Will need to fetch from question_attempts
        // For now, use random 10 from first 30
        const firstThirty = allQuestions.slice(0, 30);
        selectedQuestions = getRandomQuestions(firstThirty, 10);
      }

      setQuestions(selectedQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
      onClose();
    }
  }

  /**
   * Creates a practice session record in the database
   * Tracks this practice run as a single session
   */
  async function startPracticeSession() {
    try {
      const response = await fetch('/api/start-practice-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug,
          lessonId,
          practiceMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start session: ${response.statusText}`);
      }

      const data = await response.json();
      setSessionId(data.sessionId);
    } catch (error) {
      console.error('Error starting practice session:', error);
      // Continue without session tracking if API fails
      // User can still practice questions
    }
  }

  /**
   * Selects random questions from a pool
   * Uses Fisher-Yates shuffle algorithm
   * 
   * @param pool - Array of questions to select from
   * @param count - Number of questions to select
   * @returns Array of randomly selected questions
   */
  function getRandomQuestions(pool: Question[], count: number): Question[] {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, pool.length));
  }

  async function handleSubmitAnswer(userAnswer: string) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = answers.get(currentQuestion.id);

    if (!correctAnswer) {
      throw new Error('Answer not found');
    }

    const timeTaken = Math.floor((Date.now() - sessionStartTime) / 1000);

    // Submit to API
    const response = await fetch('/api/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseSlug,
        lessonId,
        lessonSlug,
        questionId: currentQuestion.id,
        sectionId: currentQuestion.sectionId,
        userAnswer,
        correctAnswer: correctAnswer.answer,
        practiceMode,
        timeTakenSeconds: timeTaken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answer');
    }

    const result = await response.json();
    
    // Track correct answers for session
    if (result.isCorrect) {
      setQuestionsCorrect(prev => prev + 1);
    }
    
    return {
      isCorrect: result.isCorrect,
      correctAnswer: result.correctAnswer,
    };
  }

  function handleNext() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Session complete - show results
      showResults();
    }
  }

  async function showResults() {
    // Complete practice session
    if (sessionId) {
      try {
        const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
        await fetch('/api/complete-practice-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            questionsAttempted: questions.length,
            questionsCorrect,
            durationSeconds,
          }),
        });
      } catch (error) {
        console.error('Error completing practice session:', error);
      }
    }

    // Update lesson progress with new accuracy
    try {
      const response = await fetch('/api/update-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug,
          lessonId,
          lessonSlug,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults({
          correct: data.stats.correctAnswers,
          total: data.stats.totalAttempts,
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
    
    onComplete();
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">No Questions Available</h3>
          <p className="text-gray-600 mb-6">No questions found for this lesson.</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl my-8">
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{lessonTitle}</h2>
              <p className="text-gray-600 capitalize">{practiceMode.replace('_', ' ')} Mode</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-gray-50 p-6 rounded-b-2xl shadow-lg">
          <QuestionCard
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onSubmit={handleSubmitAnswer}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
}
