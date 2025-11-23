
export enum UserSegment {
  KIDS = 'KIDS', // Primary (G1-G6)
  PATHWAYS = 'PATHWAYS', // JSS (G7-G9)
  CAREER = 'CAREER' // Senior (G10-G12)
}

export interface Activity {
  title: string;
  description: string;
  materials: string[];
  duration: string;
}

export interface CareerPath {
  title: string;
  category: string; // New field for Green Economy, Tech, etc.
  description: string;
  requiredSubjects: string[];
  potentialJobs: string[];
  tvetOptions: string[];
  universityPrograms: string[];
}

export interface PathwayRecommendation {
  pathwayName: string; // e.g., STEM, Arts & Sports, Social Sciences
  fitScore: number; // 1-100
  reasoning: string;
  recommendedClubs: string[];
}

export interface Quest {
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  expertise: string[];
}

export enum LoadingState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR
}