import { studyData } from '../data/mockData';

const API_BASE_URL = '/api';

// Helper to check if API is available (simple check)
// In a real app, you might have a health check endpoint
const isApiAvailable = async () => {
  try {
    // This is just a placeholder. 
    // If you don't have a backend running yet, this will fail and we fall back to mock data.
    // For now, we'll default to mock data if fetch fails.
    return false; 
  } catch (e) {
    return false;
  }
};

export const fetchClasses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch from API, using mock data');
    return studyData;
  }
};

export const fetchClassById = async (classId: string) => {
  try {
    // In our mock structure, we don't have a direct "get class" endpoint that returns subjects populated
    // But our API design in server/routes/api.ts has /classes/:classId/subjects
    // For simplicity in this hybrid mode, we'll fetch all classes and find the one.
    const classes = await fetchClasses();
    return classes.find((c: any) => c.id === classId);
  } catch (error) {
    return studyData.find(c => c.id === classId);
  }
};

export const fetchSubjects = async (classId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classId}/subjects`);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    const cls = studyData.find(c => c.id === classId);
    return cls?.subjects || [];
  }
};

export const fetchChapters = async (subjectId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects/${subjectId}/chapters`);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    // Find subject in mock data
    for (const cls of studyData) {
      const sub = cls.subjects.find(s => s.id === subjectId);
      if (sub) return sub.chapters;
    }
    return [];
  }
};
