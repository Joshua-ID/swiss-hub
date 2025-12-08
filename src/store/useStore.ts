import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { Course, Lesson, User, Progress, Enrollment } from "@/types";
import {
  mockCourses,
  mockLessons,
  mockUsers,
  mockProgress,
  mockEnrollments,
} from "../api/mockData";
import type { Course, Enrollment, Lesson, Progress, User } from "@/types";

interface AppState {
  // Current user
  currentUser: User | null;

  // Data
  courses: Course[];
  lessons: Lesson[];
  progress: Progress[];
  enrollments: Enrollment[];
  users: User[];

  // Actions
  setCurrentUser: (user: User | null) => void;

  // Course actions
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;

  // Lesson actions
  addLesson: (lesson: Lesson) => void;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (lessonId: string) => void;

  // Enrollment actions
  enrollCourse: (userId: string, courseId: string) => void;
  unenrollCourse: (userId: string, courseId: string) => void;

  // Progress actions
  markLessonComplete: (
    userId: string,
    courseId: string,
    lessonId: string
  ) => void;
  markLessonIncomplete: (
    userId: string,
    courseId: string,
    lessonId: string
  ) => void;
  updateLastAccessed: (
    userId: string,
    courseId: string,
    lessonId: string
  ) => void;

  // Utility functions
  getCourseProgress: (userId: string, courseId: string) => number;
  isUserEnrolled: (userId: string, courseId: string) => boolean;
  getLessonsByCourse: (courseId: string) => Lesson[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: mockUsers[1], // Default to student user for demo
      courses: mockCourses,
      lessons: mockLessons,
      progress: mockProgress,
      enrollments: mockEnrollments,
      users: mockUsers,

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),

      // Course actions
      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses, course],
        })),

      updateCourse: (courseId, updates) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId
              ? { ...c, ...updates, updatedAt: new Date().toISOString() }
              : c
          ),
        })),

      deleteCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== courseId),
          lessons: state.lessons.filter((l) => l.courseId !== courseId),
          enrollments: state.enrollments.filter((e) => e.courseId !== courseId),
          progress: state.progress.filter((p) => p.courseId !== courseId),
        })),

      // Lesson actions
      addLesson: (lesson) =>
        set((state) => ({
          lessons: [...state.lessons, lesson],
        })),

      updateLesson: (lessonId, updates) =>
        set((state) => ({
          lessons: state.lessons.map((l) =>
            l.id === lessonId ? { ...l, ...updates } : l
          ),
        })),

      deleteLesson: (lessonId) =>
        set((state) => ({
          lessons: state.lessons.filter((l) => l.id !== lessonId),
          progress: state.progress.filter((p) => p.lessonId !== lessonId),
        })),

      // Enrollment actions
      enrollCourse: (userId, courseId) => {
        const existingEnrollment = get().enrollments.find(
          (e) => e.userId === userId && e.courseId === courseId
        );

        if (!existingEnrollment) {
          const newEnrollment: Enrollment = {
            id: `enroll-${Date.now()}`,
            userId,
            courseId,
            enrolledAt: new Date().toISOString(),
            status: "active",
            completionPercentage: 0,
          };

          set((state) => ({
            enrollments: [...state.enrollments, newEnrollment],
          }));
        }
      },

      unenrollCourse: (userId, courseId) =>
        set((state) => ({
          enrollments: state.enrollments.filter(
            (e) => !(e.userId === userId && e.courseId === courseId)
          ),
          progress: state.progress.filter(
            (p) => !(p.userId === userId && p.courseId === courseId)
          ),
        })),

      // Progress actions
      markLessonComplete: (userId, courseId, lessonId) => {
        const state = get();
        const existingProgress = state.progress.find(
          (p) =>
            p.userId === userId &&
            p.courseId === courseId &&
            p.lessonId === lessonId
        );

        if (existingProgress) {
          set((state) => ({
            progress: state.progress.map((p) =>
              p.id === existingProgress.id
                ? {
                    ...p,
                    completed: true,
                    completedAt: new Date().toISOString(),
                  }
                : p
            ),
          }));
        } else {
          const newProgress: Progress = {
            id: `progress-${Date.now()}`,
            userId,
            courseId,
            lessonId,
            completed: true,
            completedAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
          };

          set((state) => ({
            progress: [...state.progress, newProgress],
          }));
        }

        // Update enrollment completion percentage
        const courseProgress = get().getCourseProgress(userId, courseId);
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.userId === userId && e.courseId === courseId
              ? {
                  ...e,
                  completionPercentage: courseProgress,
                  status: courseProgress === 100 ? "completed" : "active",
                }
              : e
          ),
        }));
      },

      markLessonIncomplete: (userId, courseId, lessonId) => {
        set((state) => ({
          progress: state.progress.map((p) =>
            p.userId === userId &&
            p.courseId === courseId &&
            p.lessonId === lessonId
              ? { ...p, completed: false, completedAt: undefined }
              : p
          ),
        }));

        // Update enrollment completion percentage
        const courseProgress = get().getCourseProgress(userId, courseId);
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.userId === userId && e.courseId === courseId
              ? { ...e, completionPercentage: courseProgress, status: "active" }
              : e
          ),
        }));
      },

      updateLastAccessed: (userId, courseId, lessonId) => {
        const state = get();
        const existingProgress = state.progress.find(
          (p) =>
            p.userId === userId &&
            p.courseId === courseId &&
            p.lessonId === lessonId
        );

        if (existingProgress) {
          set((state) => ({
            progress: state.progress.map((p) =>
              p.id === existingProgress.id
                ? { ...p, lastAccessedAt: new Date().toISOString() }
                : p
            ),
          }));
        } else {
          const newProgress: Progress = {
            id: `progress-${Date.now()}`,
            userId,
            courseId,
            lessonId,
            completed: false,
            lastAccessedAt: new Date().toISOString(),
          };

          set((state) => ({
            progress: [...state.progress, newProgress],
          }));
        }
      },

      // Utility functions
      getCourseProgress: (userId, courseId) => {
        const state = get();
        const courseLessons = state.lessons.filter(
          (l) => l.courseId === courseId
        );
        if (courseLessons.length === 0) return 0;

        const completedLessons = state.progress.filter(
          (p) => p.userId === userId && p.courseId === courseId && p.completed
        );

        return Math.round(
          (completedLessons.length / courseLessons.length) * 100
        );
      },

      isUserEnrolled: (userId, courseId) => {
        return get().enrollments.some(
          (e) => e.userId === userId && e.courseId === courseId
        );
      },

      getLessonsByCourse: (courseId) => {
        return get()
          .lessons.filter((l) => l.courseId === courseId)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: "elearning-storage",
    }
  )
);
