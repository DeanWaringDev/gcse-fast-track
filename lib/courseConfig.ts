// Course configuration with tier information
// Tracks which subjects have Foundation/Higher tiers vs single tier

export interface CourseConfig {
  slug: string;
  name: string;
  hasTiers: boolean; // Does this subject have Foundation/Higher papers?
  icon: string;
  color: string;
  gradient: string;
}

// Subjects with two-tier system (Foundation: 1-5, Higher: 4-9)
export const TWO_TIER_SUBJECTS = [
  'maths',
  'englishlanguage',
  'chemistry',
  'physics',
  'biology',
  'combined-science',
  'english-literature'
];

// All other subjects use single tier (grades 1-9)
export const SINGLE_TIER_SUBJECTS = [
  'computerscience',
  'history',
  'geography',
  'business'
];

export function hasTwoTiers(courseSlug: string): boolean {
  return TWO_TIER_SUBJECTS.includes(courseSlug);
}

// Grade boundaries for predictions
export const GRADE_BOUNDARIES = {
  foundation: {
    1: 0,   // 0-15%
    2: 15,  // 15-28%
    3: 28,  // 28-43%
    4: 43,  // 43-60%
    5: 60   // 60%+
  },
  higher: {
    4: 0,   // 0-20%
    5: 20,  // 20-33%
    6: 33,  // 33-48%
    7: 48,  // 48-63%
    8: 63,  // 63-78%
    9: 78   // 78%+
  },
  single: {
    1: 0,   // 0-10%
    2: 10,  // 10-20%
    3: 20,  // 20-30%
    4: 30,  // 30-40%
    5: 40,  // 40-50%
    6: 50,  // 50-60%
    7: 60,  // 60-70%
    8: 70,  // 70-80%
    9: 80   // 80%+
  }
};

// Target paper options based on subject type
export function getTargetPaperOptions(courseSlug: string) {
  if (hasTwoTiers(courseSlug)) {
    return [
      { value: 'foundation', label: 'Foundation Paper (Grades 1-5)' },
      { value: 'higher', label: 'Higher Paper (Grades 4-9)' }
    ];
  }
  return [];
}

// Target grade options based on paper tier
export function getTargetGradeOptions(paper: 'foundation' | 'higher' | 'none') {
  if (paper === 'foundation') {
    return [1, 2, 3, 4, 5];
  } else if (paper === 'higher') {
    return [4, 5, 6, 7, 8, 9];
  }
  // Single tier subjects
  return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
