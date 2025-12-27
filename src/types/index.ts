export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  createdAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  prerequisites: string[];
  duration: number;
  level: "beginner" | "intermediate" | "advanced";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;

  // Add these optional properties to match Supabase data
  instructor?: string;
  featured?: boolean;
  totalEnrollments?: number;
  rating?: number;
  price?: number;
  shortDescription?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  videoUrl: string;
  materials: Material[];
  duration: number; // in minutes
  type: "video" | "reading" | "quiz";
  updatedAt?: string;
}

export interface Material {
  id: string;
  title: string;
  type: "pdf" | "document" | "slide" | "link";
  url: string;
  size?: string; // in MB
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  lastAccessedAt?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt?: string;
  status: "active" | "completed" | "dropped";
  completionPercentage: number;
}

export interface CourseWithProgress extends Course {
  totalLessons: number;
  completedLessons: number;
  enrollmentStatus?: "enrolled" | "not-enrolled" | "locked";
}
