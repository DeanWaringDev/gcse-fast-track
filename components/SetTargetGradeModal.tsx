'use client';

import { useState } from 'react';
import { hasTwoTiers, getTargetGradeOptions } from '@/lib/courseConfig';

interface SetTargetGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseSlug: string;
  courseName: string;
  currentPaper?: 'foundation' | 'higher' | 'none';
  currentGrade?: number;
  onSave: (paper: 'foundation' | 'higher' | 'none', grade: number) => Promise<void>;
}

export default function SetTargetGradeModal({
  isOpen,
  onClose,
  courseSlug,
  courseName,
  currentPaper,
  currentGrade,
  onSave
}: SetTargetGradeModalProps) {
  const hasTiers = hasTwoTiers(courseSlug);
  
  const [selectedPaper, setSelectedPaper] = useState<'foundation' | 'higher' | 'none'>(
    currentPaper || (hasTiers ? 'foundation' : 'none')
  );
  const [selectedGrade, setSelectedGrade] = useState<number>(currentGrade || 4);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const availableGrades = getTargetGradeOptions(selectedPaper);

  const handlePaperChange = (paper: 'foundation' | 'higher' | 'none') => {
    setSelectedPaper(paper);
    // Auto-adjust grade if outside new range
    if (paper === 'foundation' && selectedGrade > 5) {
      setSelectedGrade(5);
    } else if (paper === 'higher' && selectedGrade < 4) {
      setSelectedGrade(4);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(selectedPaper, selectedGrade);
      onClose();
    } catch (error) {
      console.error('Failed to save target:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Set Target Grade
        </h2>
        <p className="text-gray-600 mb-6">
          {courseName}
        </p>

        {/* Paper Tier Selection (only for subjects with tiers) */}
        {hasTiers && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Which paper tier are you targeting?
            </label>
            <div className="space-y-2">
              <button
                onClick={() => handlePaperChange('foundation')}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedPaper === 'foundation'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Foundation Paper</div>
                <div className="text-sm text-gray-600">Target Grades 1-5</div>
                <div className="text-xs text-gray-500 mt-1">
                  Recommended for those targeting grades 1, 2, 3, 4, or 5
                </div>
              </button>
              
              <button
                onClick={() => handlePaperChange('higher')}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedPaper === 'higher'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">Higher Paper</div>
                <div className="text-sm text-gray-600">Target Grades 4-9</div>
                <div className="text-xs text-gray-500 mt-1">
                  Recommended for those targeting grades 6, 7, 8, or 9
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Grade Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What grade are you aiming for?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {availableGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`p-3 rounded-lg border-2 font-bold text-lg transition-all ${
                  selectedGrade === grade
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
          
          {/* Grade description */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Grade {selectedGrade}</span>
              {selectedGrade >= 9 && ' - Outstanding! The highest grade possible.'}
              {selectedGrade === 8 && ' - Excellent work! Very high achievement.'}
              {selectedGrade === 7 && ' - Very good! Strong understanding.'}
              {selectedGrade === 6 && ' - Good! Solid achievement.'}
              {selectedGrade === 5 && ' - Strong pass! Good foundation.'}
              {selectedGrade === 4 && ' - Pass! Meets standard requirements.'}
              {selectedGrade === 3 && ' - Near pass. Keep working!'}
              {selectedGrade <= 2 && ' - Foundation level. We\'ll help you improve!'}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Set Target'}
          </button>
        </div>
      </div>
    </div>
  );
}
