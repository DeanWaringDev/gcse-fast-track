'use client';

/**
 * Question Card Component
 * 
 * Interactive question display with answer input and immediate feedback.
 * Features keyboard navigation with auto-focus for seamless user experience.
 * 
 * Features:
 * - Single question display with answer input field
 * - Submit answer with Enter key
 * - Immediate visual feedback (green=correct, red=incorrect)
 * - Auto-focus on input field when question changes
 * - Auto-focus on Next button after submission for keyboard navigation
 * - Loading states during submission
 * - Progress indicator showing current question number
 * 
 * Keyboard Navigation:
 * 1. User types answer → presses Enter to submit
 * 2. Answer is submitted → Next button auto-focuses
 * 3. User presses Enter again → moves to next question
 * 4. Next question loads → input field auto-focuses
 * 
 * @component
 */

import { useState, useRef, useEffect } from 'react';

interface QuestionCardProps {
  question: {
    id: string;
    question: string;
    type?: string;
    options?: string[];
    sectionId?: string;
    sectionTitle?: string;
  };
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answer: string) => Promise<{ isCorrect: boolean; correctAnswer: string }>;
  onNext: () => void;
}

export default function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onSubmit,
  onNext 
}: QuestionCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-focus input on mount and when moving to next question
  useEffect(() => {
    inputRef.current?.focus();
  }, [question.id]);

  // Auto-focus next button after submission
  useEffect(() => {
    if (isSubmitted) {
      nextButtonRef.current?.focus();
    }
  }, [isSubmitted]);

  const handleSubmit = async () => {
    if (!userAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmit(userAnswer);
      setIsCorrect(result.isCorrect);
      setCorrectAnswer(result.correctAnswer);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setUserAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setCorrectAnswer('');
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitted) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          {question.sectionTitle && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {question.sectionTitle}
              </span>
            </>
          )}
        </div>
        <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {question.question}
        </h3>
      </div>

      {/* Answer Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Answer
        </label>
        {question.type === 'multiple_choice' && question.options ? (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isSubmitted) {
                    setUserAnswer(option);
                  }
                }}
                disabled={isSubmitted}
                className={`w-full text-left px-4 py-3 border-2 rounded-lg font-semibold transition-all ${
                  userAnswer === option
                    ? isSubmitted
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-blue-500 bg-blue-50 text-blue-700'
                    : isSubmitted && option === correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSubmitted}
            placeholder="Enter your answer..."
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-semibold transition-colors ${
              isSubmitted
                ? isCorrect
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-300 focus:border-blue-500 focus:outline-none'
            }`}
          />
        )}
      </div>

      {/* Feedback */}
      {isSubmitted && (
        <div className={`mb-6 p-4 rounded-lg ${
          isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <svg className="w-6 h-6 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div className="flex-1">
              <p className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct! 🎉' : 'Not quite right'}
              </p>
              {!isCorrect && (
                <p className="text-gray-700">
                  The correct answer is: <span className="font-bold text-gray-900">{correctAnswer}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!userAnswer || isSubmitting}
            className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Checking...' : 'Submit Answer'}
          </button>
        ) : (
          <button
            ref={nextButtonRef}
            onClick={handleNext}
            className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {questionNumber < totalQuestions ? (
              <>
                Next Question
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                Finish Practice
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hint Text */}
      {!isSubmitted && question.type !== 'multiple_choice' && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Press Enter to submit your answer
        </p>
      )}
    </div>
  );
}
