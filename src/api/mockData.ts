import type { Course, Enrollment, Lesson, Progress, User } from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-admin-1",
    name: "Admin User",
    email: "admin@elearning.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-student-1",
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "user-student-2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    createdAt: "2024-02-15T00:00:00Z",
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Introduction to Web Development",
    description:
      "Learn the fundamentals of HTML, CSS, and JavaScript. Perfect for beginners starting their web development journey.",
    thumbnail: "/assets/web-dev.jpg",
    category: "Web Development",
    prerequisites: [],
    duration: 20,
    level: "beginner",
    createdBy: "user-admin-1",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "course-2",
    title: "Advanced React Patterns",
    description:
      "Master advanced React concepts including hooks, context, performance optimization, and design patterns.",
    thumbnail: "/assets/react.jpg",
    category: "Web Development",
    prerequisites: ["course-1"],
    duration: 30,
    level: "advanced",
    createdBy: "user-admin-1",
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-03-15T00:00:00Z",
  },
  {
    id: "course-3",
    title: "Data Science Fundamentals",
    description:
      "Introduction to data analysis, statistics, and machine learning basics using Python.",
    thumbnail: "/assets/data-science.jpg",
    category: "Data Science",
    prerequisites: [],
    duration: 40,
    level: "beginner",
    createdBy: "user-admin-1",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-04-01T00:00:00Z",
  },
  {
    id: "course-4",
    title: "UI/UX Design Principles",
    description:
      "Learn the fundamentals of user interface and user experience design, including color theory, typography, and user research.",
    thumbnail: "/assets/ui-ux.jpg",
    category: "Design",
    prerequisites: [],
    duration: 25,
    level: "intermediate",
    createdBy: "user-admin-1",
    createdAt: "2024-04-10T00:00:00Z",
    updatedAt: "2024-04-10T00:00:00Z",
  },
];

// Mock Lessons
export const mockLessons: Lesson[] = [
  // Course 1 Lessons
  {
    id: "lesson-1-1",
    courseId: "course-1",
    title: "Introduction to HTML",
    description: "Learn the basics of HTML structure and common tags.",
    order: 1,
    videoUrl: "https://example.com/videos/html-intro.mp4",
    materials: [
      {
        id: "mat-1",
        title: "HTML Cheat Sheet",
        type: "pdf",
        url: "/materials/html-cheatsheet.pdf",
        size: "1.2 MB",
      },
      {
        id: "mat-2",
        title: "HTML Documentation",
        type: "link",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      },
    ],
    duration: 30,
    type: "video",
  },
  {
    id: "lesson-1-2",
    courseId: "course-1",
    title: "CSS Basics",
    description: "Understanding CSS selectors, properties, and styling.",
    order: 2,
    videoUrl: "https://example.com/videos/css-basics.mp4",
    materials: [
      {
        id: "mat-3",
        title: "CSS Reference Guide",
        type: "pdf",
        url: "/materials/css-guide.pdf",
        size: "2.1 MB",
      },
    ],
    duration: 45,
    type: "video",
  },
  {
    id: "lesson-1-3",
    courseId: "course-1",
    title: "JavaScript Fundamentals",
    description:
      "Introduction to JavaScript variables, functions, and control flow.",
    order: 3,
    videoUrl: "https://example.com/videos/js-fundamentals.mp4",
    materials: [],
    duration: 60,
    type: "video",
  },
  // Course 2 Lessons
  {
    id: "lesson-2-1",
    courseId: "course-2",
    title: "React Hooks Deep Dive",
    description:
      "Advanced patterns with useState, useEffect, and custom hooks.",
    order: 1,
    videoUrl: "https://example.com/videos/react-hooks.mp4",
    materials: [
      {
        id: "mat-4",
        title: "Hooks Best Practices",
        type: "document",
        url: "/materials/hooks-practices.docx",
      },
    ],
    duration: 50,
    type: "video",
  },
  {
    id: "lesson-2-2",
    courseId: "course-2",
    title: "Performance Optimization",
    description: "Learn techniques to optimize React application performance.",
    order: 2,
    videoUrl: "https://example.com/videos/react-performance.mp4",
    materials: [],
    duration: 40,
    type: "video",
  },
  // Course 3 Lessons
  {
    id: "lesson-3-1",
    courseId: "course-3",
    title: "Python for Data Analysis",
    description: "Getting started with pandas and numpy.",
    order: 1,
    videoUrl: "https://example.com/videos/python-data.mp4",
    materials: [
      {
        id: "mat-5",
        title: "Pandas Cheat Sheet",
        type: "pdf",
        url: "/materials/pandas-cheatsheet.pdf",
        size: "1.8 MB",
      },
    ],
    duration: 55,
    type: "video",
  },
  // Course 4 Lessons
  {
    id: "lesson-4-1",
    courseId: "course-4",
    title: "Design Thinking Basics",
    description: "Understanding user-centered design principles.",
    order: 1,
    videoUrl: "https://example.com/videos/design-thinking.mp4",
    materials: [],
    duration: 35,
    type: "video",
  },
  {
    id: "lesson-4-2",
    courseId: "course-4",
    title: "Color Theory and Typography",
    description: "Learn how to use color and fonts effectively.",
    order: 2,
    videoUrl: "https://example.com/videos/color-typography.mp4",
    materials: [
      {
        id: "mat-6",
        title: "Color Palette Guide",
        type: "pdf",
        url: "/materials/color-guide.pdf",
        size: "3.2 MB",
      },
    ],
    duration: 40,
    type: "video",
  },
];

// Mock Progress
export const mockProgress: Progress[] = [
  {
    id: "progress-1",
    userId: "user-student-1",
    courseId: "course-1",
    lessonId: "lesson-1-1",
    completed: true,
    completedAt: "2024-05-01T10:00:00Z",
    lastAccessedAt: "2024-05-01T10:00:00Z",
  },
  {
    id: "progress-2",
    userId: "user-student-1",
    courseId: "course-1",
    lessonId: "lesson-1-2",
    completed: true,
    completedAt: "2024-05-02T14:30:00Z",
    lastAccessedAt: "2024-05-02T14:30:00Z",
  },
  {
    id: "progress-3",
    userId: "user-student-1",
    courseId: "course-1",
    lessonId: "lesson-1-3",
    completed: false,
    lastAccessedAt: "2024-05-03T09:15:00Z",
  },
];

// Mock Enrollments
export const mockEnrollments: Enrollment[] = [
  {
    id: "enroll-1",
    userId: "user-student-1",
    courseId: "course-1",
    enrolledAt: "2024-04-25T00:00:00Z",
    status: "active",
    completionPercentage: 66,
  },
  {
    id: "enroll-2",
    userId: "user-student-1",
    courseId: "course-3",
    enrolledAt: "2024-05-01T00:00:00Z",
    status: "active",
    completionPercentage: 0,
  },
];

// Helper function to get lessons by course
export const getLessonsByCourse = (courseId: string): Lesson[] => {
  return mockLessons
    .filter((lesson) => lesson.courseId === courseId)
    .sort((a, b) => a.order - b.order);
};

// Helper function to get progress by user and course
export const getProgressByUserAndCourse = (
  userId: string,
  courseId: string
): Progress[] => {
  return mockProgress.filter(
    (p) => p.userId === userId && p.courseId === courseId
  );
};

// Helper function to check if course is locked (prerequisites not met)
export const isCourseLockedForUser = (
  courseId: string,
  userId: string
): boolean => {
  const course = mockCourses.find((c) => c.id === courseId);
  if (!course || course.prerequisites.length === 0) return false;

  const userEnrollments = mockEnrollments.filter((e) => e.userId === userId);

  for (const prereqId of course.prerequisites) {
    const prereqEnrollment = userEnrollments.find(
      (e) => e.courseId === prereqId
    );
    if (!prereqEnrollment || prereqEnrollment.status !== "completed") {
      return true;
    }
  }

  return false;
};
