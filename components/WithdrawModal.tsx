'use client';

import { useState } from 'react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  onConfirm: () => Promise<void>;
}

export default function WithdrawModal({
  isOpen,
  onClose,
  courseName,
  onConfirm
}: WithdrawModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleWithdraw = async () => {
    if (confirmText !== 'WITHDRAW') {
      setError('Please type WITHDRAW exactly as shown');
      return;
    }

    setIsWithdrawing(true);
    setError('');

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError('Failed to withdraw. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Withdraw from Course</h2>
            <p className="text-sm text-gray-500">{courseName}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold mb-2">⚠️ Warning: This action cannot be undone!</p>
            <p className="text-red-700 text-sm mb-2">
              Withdrawing from this course will permanently delete:
            </p>
            <ul className="text-red-700 text-sm list-disc list-inside space-y-1">
              <li>All lesson progress</li>
              <li>Practice session history</li>
              <li>Question attempts and scores</li>
              <li>Study time and streak data</li>
              <li>Weak areas tracking</li>
            </ul>
            <p className="text-red-700 text-sm mt-2 font-semibold">
              You will need to start from scratch if you re-enroll.
            </p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold text-red-600">WITHDRAW</span> to confirm:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="WITHDRAW"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-center font-bold text-lg"
            disabled={isWithdrawing}
          />
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isWithdrawing}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing || confirmText !== 'WITHDRAW'}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWithdrawing ? 'Withdrawing...' : 'Withdraw from Course'}
          </button>
        </div>
      </div>
    </div>
  );
}
