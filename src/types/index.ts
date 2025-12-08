export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  prerequisites: string[]; // Array of course IDs
  duration: number; // in hours
  level: "beginner" | "intermediate" | "advanced";
  createdBy: string; // Admin user ID
  createdAt: string;
  updatedAt: string;
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
}

export interface Material {
  id: string;
  title: string;
  type: "pdf" | "document" | "slide" | "link";
  url: string;
  size?: string; // e.g., "2.5 MB"
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  lastAccessedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  status: "active" | "completed" | "dropped";
  completionPercentage: number;
}

export interface CourseWithProgress extends Course {
  totalLessons: number;
  completedLessons: number;
  enrollmentStatus?: "enrolled" | "not-enrolled" | "locked";
}
