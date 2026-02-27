import { LucideIcon } from 'lucide-react';

export interface ContentItem {
  id: string;
  title: string;
  type: 'book' | 'solution' | 'paper';
  url: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: ContentItem[];
}

export interface Subject {
  id: string;
  name: string;
  icon?: LucideIcon;
  chapters: Chapter[];
}

export interface ClassLevel {
  id: string;
  name: string;
  subjects: Subject[];
  hasSolutions: boolean;
  hasSamplePapers: boolean;
}

// Helper to generate mock chapters
const generateChapters = (subjectName: string, count: number): Chapter[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ch-${i + 1}`,
    title: `${subjectName} Chapter ${i + 1}`,
    content: [
      {
        id: `book-${i + 1}`,
        title: 'Textbook PDF',
        type: 'book',
        url: `https://example.com/book-${i + 1}.pdf`
      },
      {
        id: `sol-${i + 1}`,
        title: 'Solution PDF',
        type: 'solution',
        url: `https://example.com/solution-${i + 1}.pdf`
      }
    ]
  }));
};

const getSubjectsForClass = (classNum: number) => {
  // Common subjects for all classes
  const baseSubjects = [
    { id: 'odia', name: 'Odia (Sahitya)' },
    { id: 'english', name: 'English' },
    { id: 'math', name: 'Mathematics' },
  ];

  // Class 1-2: Basic subjects
  if (classNum <= 2) {
    return baseSubjects;
  }

  // Class 3-5: Add General Science and Social Science
  if (classNum <= 5) {
    return [
      ...baseSubjects,
      { id: 'science', name: 'General Science' },
      { id: 'social', name: 'Social Science' },
    ];
  }

  // Class 6-10: Split subjects + Languages
  return [
    ...baseSubjects,
    { id: 'hindi', name: 'Hindi' },
    { id: 'sanskrit', name: 'Sanskrit' },
    { id: 'physical-science', name: 'Physical Science' },
    { id: 'life-science', name: 'Life Science' },
    { id: 'history', name: 'History' },
    { id: 'political-science', name: 'Political Science' },
    { id: 'geography', name: 'Geography' },
  ];
};

export const studyData: ClassLevel[] = Array.from({ length: 10 }, (_, i) => {
  const classNum = i + 1;
  const isHighSchool = classNum >= 6;
  const isClass10 = classNum === 10;

  const subjectsList = getSubjectsForClass(classNum);

  return {
    id: classNum.toString(),
    name: `Class ${classNum}`,
    hasSolutions: isHighSchool,
    hasSamplePapers: isClass10,
    subjects: subjectsList.map(sub => ({
      ...sub,
      chapters: generateChapters(sub.name, 8)
    }))
  };
});

export const samplePapers: ContentItem[] = [
  { id: 'sp-1', title: 'Model Paper Set 1', type: 'paper', url: '#' },
  { id: 'sp-2', title: 'Model Paper Set 2', type: 'paper', url: '#' },
  { id: 'sp-3', title: 'Model Paper Set 3', type: 'paper', url: '#' },
  { id: 'pyq-2023', title: 'Previous Year Questions 2023', type: 'paper', url: '#' },
  { id: 'imp-q', title: 'Important Questions', type: 'paper', url: '#' },
];
