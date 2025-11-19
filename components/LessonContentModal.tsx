'use client';

/**
 * Lesson Content Modal
 * 
 * Displays lesson content as a slideshow
 * Loads content from markdown files
 */

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LessonContentModalProps {
  lesson: {
    id: number;
    number: string;
    title: string;
    files?: {
      instructions?: string;
    };
  };
  onClose: () => void;
}

export default function LessonContentModal({ lesson, onClose }: LessonContentModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      // Load markdown content via API route
      const response = await fetch(`/api/lesson-content?file=${lesson.files?.instructions}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      } else {
        setContent(`# ${lesson.title}\n\nContent is being prepared. Please check back soon!`);
      }
    } catch (error) {
      console.error('Error loading lesson content:', error);
      setContent(`# ${lesson.title}\n\nContent is being prepared. Please check back soon!`);
    }
    setIsLoading(false);
  }

  // Split content by "---" separators and clean up
  const slides = content
    .split(/\n---\n/)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('---') && !s.match(/^lessonId:|^lessonNumber:|^title:|^difficulty:|^duration:|^topics:|^totalScreens:/));

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') onClose();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-200 text-sm mb-1">Lesson #{lesson.number}</div>
              <h2 className="text-2xl font-bold">{lesson.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-lg max-w-none"
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 leading-relaxed my-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc ml-6 my-4 space-y-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="text-gray-700">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-blue-700">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-600">{children}</em>
              ),
              code: ({ children }) => (
                <code className="bg-blue-50 border-2 border-blue-200 rounded px-2 py-1 text-sm font-mono text-gray-800">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 my-4 overflow-x-auto">
                  {children}
                </pre>
              ),
            }}
          >
            {slides[currentSlide]}
          </ReactMarkdown>
        </div>

        {/* Navigation */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentSlide === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentSlide === slides.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Use arrow keys to navigate • Press ESC to close
          </div>
        </div>
      </div>
    </div>
  );
}
