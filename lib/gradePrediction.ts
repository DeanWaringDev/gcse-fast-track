// Grade Prediction Algorithm
// Calculates predicted grades and paper tier recommendations

import { GRADE_BOUNDARIES, hasTwoTiers } from './courseConfig';

export interface PerformanceData {
  lessonsCompleted: number;
  totalLessons: number;
  averageAccuracy: number; // 0-100%
  questionsAttempted: number;
  targetPaper: 'foundation' | 'higher' | 'none';
  targetGrade: number;
  courseSlug: string;
}

export interface PredictionResult {
  predictedGrade: number;
  confidence: 'low' | 'medium' | 'high';
  recommendedPaper?: 'foundation' | 'higher';
  paperChangeReason?: string;
  onTrack: boolean;
}

/**
 * Calculate predicted grade based on performance
 * 
 * Algorithm:
 * 1. Use average accuracy as primary indicator
 * 2. Apply confidence modifier based on progress (more lessons = more confident)
 * 3. For two-tier subjects, recommend paper switch if needed
 */
export function calculatePredictedGrade(data: PerformanceData): PredictionResult {
  const {
    lessonsCompleted,
    totalLessons,
    averageAccuracy,
    questionsAttempted,
    targetPaper,
    targetGrade,
    courseSlug
  } = data;

  // Calculate progress percentage
  const progress = (lessonsCompleted / totalLessons) * 100;
  
  // Determine confidence level
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (progress >= 50 && questionsAttempted >= 100) {
    confidence = 'high';
  } else if (progress >= 20 && questionsAttempted >= 30) {
    confidence = 'medium';
  }

  // Calculate base predicted grade from accuracy
  let predictedGrade: number;
  
  if (hasTwoTiers(courseSlug) && targetPaper !== 'none') {
    // Two-tier system
    if (targetPaper === 'foundation') {
      predictedGrade = getGradeFromBoundaries(averageAccuracy, GRADE_BOUNDARIES.foundation);
    } else {
      predictedGrade = getGradeFromBoundaries(averageAccuracy, GRADE_BOUNDARIES.higher);
    }
  } else {
    // Single tier system
    predictedGrade = getGradeFromBoundaries(averageAccuracy, GRADE_BOUNDARIES.single);
  }

  // Apply confidence adjustment (reduce prediction if low confidence)
  if (confidence === 'low' && progress < 10) {
    // Very early, be conservative
    predictedGrade = Math.max(1, predictedGrade - 2);
  } else if (confidence === 'medium') {
    // Some data, slight conservatism
    predictedGrade = Math.max(1, predictedGrade - 1);
  }

  // Check if on track to meet target
  const onTrack = predictedGrade >= targetGrade;

  // Generate paper recommendation for two-tier subjects
  let recommendedPaper: 'foundation' | 'higher' | undefined;
  let paperChangeReason: string | undefined;

  if (hasTwoTiers(courseSlug)) {
    const recommendation = recommendPaperTier(data, predictedGrade, progress);
    recommendedPaper = recommendation.paper;
    paperChangeReason = recommendation.reason;
  }

  return {
    predictedGrade,
    confidence,
    recommendedPaper,
    paperChangeReason,
    onTrack
  };
}

/**
 * Get grade from accuracy percentage using boundaries
 */
function getGradeFromBoundaries(accuracy: number, boundaries: Record<number, number>): number {
  const grades = Object.keys(boundaries).map(Number).sort((a, b) => b - a);
  
  for (const grade of grades) {
    if (accuracy >= boundaries[grade]) {
      return grade;
    }
  }
  
  return grades[grades.length - 1]; // Return lowest grade if below all boundaries
}

/**
 * Recommend paper tier based on performance
 * 
 * Logic:
 * - Early in course (<15% progress): Recommend based on target grade
 * - Mid course (15-40%): If struggling on Higher, suggest Foundation
 * - Late course (40%+): Only suggest switch if significantly underperforming
 */
function recommendPaperTier(
  data: PerformanceData,
  predictedGrade: number,
  progress: number
): { paper: 'foundation' | 'higher'; reason?: string } {
  const { targetPaper, targetGrade, averageAccuracy } = data;

  // If no tiers, return foundation as default (won't be used)
  if (targetPaper === 'none') {
    return { paper: 'foundation' };
  }

  // Early stage: base on target grade
  if (progress < 15) {
    if (targetGrade >= 6) {
      return { 
        paper: 'higher',
        reason: targetPaper === 'foundation' ? 'Target grade 6+ requires Higher tier' : undefined
      };
    } else if (targetGrade <= 4) {
      return { 
        paper: 'foundation',
        reason: targetPaper === 'higher' ? 'Foundation tier may be more suitable for grade 4 target' : undefined
      };
    }
    return { paper: targetPaper };
  }

  // Mid stage: performance-based recommendation
  if (progress >= 15 && progress < 40) {
    if (targetPaper === 'higher' && averageAccuracy < 40) {
      return {
        paper: 'foundation',
        reason: 'Struggling on Higher tier - Foundation would secure grades 4-5'
      };
    }
    if (targetPaper === 'foundation' && averageAccuracy >= 70 && predictedGrade === 5) {
      return {
        paper: 'higher',
        reason: 'Strong Foundation performance - ready for Higher tier to target grades 6+'
      };
    }
  }

  // Late stage: only recommend switch if significant mismatch
  if (progress >= 40) {
    if (targetPaper === 'higher' && predictedGrade < 4) {
      return {
        paper: 'foundation',
        reason: 'Below grade 4 on Higher - switch to Foundation to secure a pass'
      };
    }
    if (targetPaper === 'foundation' && averageAccuracy >= 80) {
      return {
        paper: 'higher',
        reason: 'Exceptional Foundation performance - consider Higher tier for grades 6-9'
      };
    }
  }

  // Default: stick with current paper
  return { paper: targetPaper };
}

/**
 * Format grade with tier context
 */
export function formatGradeWithTier(
  grade: number,
  paper: 'foundation' | 'higher' | 'none'
): string {
  if (paper === 'none') {
    return `Grade ${grade}`;
  }
  
  const tier = paper === 'foundation' ? 'Foundation' : 'Higher';
  return `Grade ${grade} (${tier})`;
}

/**
 * Get grade description
 */
export function getGradeDescription(grade: number): string {
  if (grade >= 9) return 'Outstanding';
  if (grade >= 8) return 'Excellent';
  if (grade >= 7) return 'Very Good';
  if (grade >= 6) return 'Good';
  if (grade >= 5) return 'Strong Pass';
  if (grade >= 4) return 'Pass';
  if (grade >= 3) return 'Near Pass';
  if (grade >= 2) return 'Developing';
  return 'Beginning';
}
