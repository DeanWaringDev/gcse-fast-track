/**
 * Lesson Dashboard Component
 * 
 * Displays lesson statistics and progress at the top of lesson page
 */

interface LessonDashboardProps {
  lesson: {
    id: number;
    title: string;
    category: string;
    difficulty: string;
    estimatedMinutes: number;
    topicsCovered: string[];
  };
  progress: {
    is_completed: boolean;
    accuracy_score: number | null;
    time_spent_minutes: number;
    attempts: number;
    last_attempt_at: string | null;
    confidence_level: number | null;
  } | null;
  questionAttempts: Array<{
    question_id: string;
    is_correct: boolean;
    attempt_count: number;
  }>;
}

export default function LessonDashboard({ lesson, progress, questionAttempts }: LessonDashboardProps) {
  const totalQuestions = 30; // Standard question bank size
  const attemptedQuestions = questionAttempts.length;
  const correctQuestions = questionAttempts.filter(q => q.is_correct).length;
  const questionAccuracy = attemptedQuestions > 0 
    ? Math.round((correctQuestions / attemptedQuestions) * 100) 
    : 0;

  const averageAccuracy = progress?.accuracy_score || questionAccuracy || 0;
  const isCompleted = progress?.is_completed || false;
  const attempts = progress?.attempts || 0;
  const timeSpent = progress?.time_spent_minutes || 0;
  const confidence = progress?.confidence_level || 0;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (accuracy >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceEmoji = (level: number) => {
    if (level >= 8) return '🌟';
    if (level >= 6) return '😊';
    if (level >= 4) return '😐';
    if (level >= 2) return '😕';
    return '😰';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
        {isCompleted && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border-2 border-green-200">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Completed</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Average Accuracy */}
        <div className={`p-4 rounded-lg border-2 ${getAccuracyColor(averageAccuracy)}`}>
          <div className="text-sm font-medium mb-1">Average Accuracy</div>
          <div className="text-3xl font-bold">{averageAccuracy}%</div>
          <div className="w-full bg-white/50 rounded-full h-2 mt-2">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${averageAccuracy}%`,
                backgroundColor: averageAccuracy >= 80 ? '#16a34a' : averageAccuracy >= 60 ? '#ca8a04' : '#dc2626'
              }}
            />
          </div>
        </div>

        {/* Questions Attempted */}
        <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
          <div className="text-sm font-medium text-blue-600 mb-1">Questions Attempted</div>
          <div className="text-3xl font-bold text-blue-600">{attemptedQuestions}</div>
          <div className="text-xs text-blue-500 mt-1">of {totalQuestions} total</div>
        </div>

        {/* Time Spent */}
        <div className="p-4 rounded-lg border-2 bg-purple-50 border-purple-200">
          <div className="text-sm font-medium text-purple-600 mb-1">Time Spent</div>
          <div className="text-3xl font-bold text-purple-600">{timeSpent}</div>
          <div className="text-xs text-purple-500 mt-1">minutes</div>
        </div>

        {/* Attempts */}
        <div className="p-4 rounded-lg border-2 bg-orange-50 border-orange-200">
          <div className="text-sm font-medium text-orange-600 mb-1">Practice Attempts</div>
          <div className="text-3xl font-bold text-orange-600">{attempts}</div>
          <div className="text-xs text-orange-500 mt-1">sessions</div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Topics Covered */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Topics in This Lesson</h3>
          <div className="flex flex-wrap gap-2">
            {lesson.topicsCovered.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Confidence Level */}
        {confidence > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Your Confidence Level</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getConfidenceEmoji(confidence)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Confidence</span>
                  <span className="text-sm font-bold text-gray-700">{confidence}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-linear-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${confidence * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last Attempt */}
        {progress?.last_attempt_at && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Last Practice</h3>
            <p className="text-gray-600">
              {new Date(progress.last_attempt_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </div>

      {/* First Time Message */}
      {!progress && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Welcome to this lesson!</h4>
              <p className="text-sm text-blue-700">
                Start with the lesson content to learn the concepts, then practice with questions to build your skills. 
                Your progress will be tracked automatically.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
