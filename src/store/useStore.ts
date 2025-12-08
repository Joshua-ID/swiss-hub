/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, Enrollment, Lesson, Progress, User } from "@/types";

// Import Supabase APIs
import {
  courseAPI,
  lessonAPI,
  enrollmentAPI,
  progressAPI,
  userAPI,
} from "@/api/backend";

interface AppState {
  // Current user
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  // NEW: Track if enrollments have been loaded
  enrollmentsLoaded: boolean;

  // Data - initially empty, will be fetched from Supabase
  courses: Course[];
  lessons: Lesson[];
  progress: Progress[];
  enrollments: Enrollment[];

  // Actions
  setCurrentUser: (user: User | null) => void;
  initializeUser: (
    clerkId: string,
    email: string,
    name: string
  ) => Promise<void>;
  logoutUser: () => Promise<void>;

  // Course actions
  fetchCourses: () => Promise<void>;
  addCourse: (
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ) => Promise<Course>;
  updateCourse: (courseId: string, updates: Partial<Course>) => Promise<Course>;
  deleteCourse: (courseId: string) => Promise<void>;

  // Lesson actions
  fetchLessonsByCourse: (courseId: string) => Promise<Lesson[]>;
  addLesson: (lesson: Omit<Lesson, "id">) => Promise<Lesson>;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => Promise<Lesson>;
  deleteLesson: (lessonId: string) => Promise<void>;

  // Enrollment actions
  fetchUserEnrollments: (userId?: string) => Promise<Enrollment[]>;
  enrollCourse: (courseId: string) => Promise<Enrollment>;
  unenrollCourse: (courseId: string) => Promise<void>;
  isUserEnrolled: (courseId: string) => boolean; // Changed to synchronous

  // Progress actions
  fetchCourseProgress: (courseId: string) => Promise<Progress[]>;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<Progress>;
  markLessonIncomplete: (
    courseId: string,
    lessonId: string
  ) => Promise<Progress>;
  updateLastAccessed: (courseId: string, lessonId: string) => Promise<Progress>;
  getCourseProgress: (courseId: string, userId?: string) => Promise<number>;

  // Utility functions
  getLessonsByCourse: (courseId: string) => Lesson[];
  refreshData: () => Promise<void>;

  // NEW: Ensure enrollments are loaded
  ensureEnrollmentsLoaded: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state - empty arrays
      currentUser: null,
      isLoading: false,
      courses: [],
      lessons: [],
      progress: [],
      enrollments: [],
      error: null,
      enrollmentsLoaded: false, // NEW

      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),

      // Initialize user with Clerk and fetch their data
      initializeUser: async (clerkId: string, email: string, name: string) => {
        set({ isLoading: true });
        try {
          // Try to get existing user
          let user = await userAPI.getByClerkId(clerkId);

          // If user doesn't exist, create them
          if (!user) {
            user = await userAPI.create({
              clerkId: clerkId,
              email,
              name,
              role: "student", // Default role
            });
          }

          set({ currentUser: user });

          // Fetch initial data for this user
          await get().refreshData();
        } catch (error) {
          console.error("Error initializing user:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout user and clear data
      logoutUser: async () => {
        set({
          currentUser: null,
          courses: [],
          lessons: [],
          progress: [],
          enrollments: [],
          enrollmentsLoaded: false, // Reset flag
        });
      },

      // Refresh all data for current user
      refreshData: async () => {
        const { currentUser } = get();
        if (!currentUser) return;

        try {
          set({ isLoading: true });

          // Fetch courses (all users can see courses)
          const courses = await courseAPI.getAll();
          set({ courses });

          // Fetch user-specific data
          const enrollments = await enrollmentAPI.getByUser(currentUser.id);

          set({ enrollments, enrollmentsLoaded: true }); // Mark as loaded
        } catch (error) {
          console.error("Error refreshing data:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // NEW: Ensure enrollments are loaded before checking
      ensureEnrollmentsLoaded: async () => {
        const { currentUser, enrollmentsLoaded } = get();

        if (!currentUser) return;

        // If already loaded, skip
        if (enrollmentsLoaded) return;

        try {
          const enrollments = await enrollmentAPI.getByUser(currentUser.id);
          set({ enrollments, enrollmentsLoaded: true });
        } catch (error) {
          console.error("Error loading enrollments:", error);
        }
      },

      // Fetch all courses
      fetchCourses: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log("Fetching courses from Supabase...");
          const courses = await courseAPI.getAll();
          console.log("Courses fetched:", courses.length);
          set({ courses });
        } catch (error: any) {
          console.error("Error fetching courses:", error);
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Course actions
      addCourse: async (course) => {
        set({ isLoading: true });
        try {
          const newCourse = await courseAPI.create(course);
          set((state) => ({
            courses: [...state.courses, newCourse],
          }));
          return newCourse;
        } catch (error) {
          console.error("Error creating course:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateCourse: async (courseId, updates) => {
        set({ isLoading: true });
        try {
          const updatedCourse = await courseAPI.update(courseId, updates);
          set((state) => ({
            courses: state.courses.map((c) =>
              c.id === courseId ? updatedCourse : c
            ),
          }));
          return updatedCourse;
        } catch (error) {
          console.error("Error updating course:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteCourse: async (courseId) => {
        set({ isLoading: true });
        try {
          await courseAPI.delete(courseId);
          set((state) => ({
            courses: state.courses.filter((c) => c.id !== courseId),
            lessons: state.lessons.filter((l) => l.courseId !== courseId),
            enrollments: state.enrollments.filter(
              (e) => e.courseId !== courseId
            ),
            progress: state.progress.filter((p) => p.courseId !== courseId),
          }));
        } catch (error) {
          console.error("Error deleting course:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Lesson actions
      fetchLessonsByCourse: async (courseId: string) => {
        set({ isLoading: true });
        try {
          const lessons = await lessonAPI.getByCourse(courseId);
          // Update lessons in state
          set((state) => ({
            lessons: [
              ...state.lessons.filter((l) => l.courseId !== courseId),
              ...lessons,
            ],
          }));
          return lessons;
        } catch (error) {
          console.error("Error fetching lessons:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      addLesson: async (lesson) => {
        set({ isLoading: true });
        try {
          const newLesson = await lessonAPI.create(lesson);
          set((state) => ({
            lessons: [...state.lessons, newLesson],
          }));
          return newLesson;
        } catch (error) {
          console.error("Error creating lesson:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateLesson: async (lessonId, updates) => {
        set({ isLoading: true });
        try {
          const updatedLesson = await lessonAPI.update(lessonId, updates);
          set((state) => ({
            lessons: state.lessons.map((l) =>
              l.id === lessonId ? updatedLesson : l
            ),
          }));
          return updatedLesson;
        } catch (error) {
          console.error("Error updating lesson:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteLesson: async (lessonId) => {
        set({ isLoading: true });
        try {
          await lessonAPI.delete(lessonId);
          set((state) => ({
            lessons: state.lessons.filter((l) => l.id !== lessonId),
            progress: state.progress.filter((p) => p.lessonId !== lessonId),
          }));
        } catch (error) {
          console.error("Error deleting lesson:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Enrollment actions
      fetchUserEnrollments: async (userId?: string) => {
        const { currentUser } = get();
        const targetUserId = userId || currentUser?.id;

        if (!targetUserId) return [];

        set({ isLoading: true });
        try {
          const enrollments = await enrollmentAPI.getByUser(targetUserId);
          set({ enrollments, enrollmentsLoaded: true }); // Mark as loaded
          return enrollments;
        } catch (error) {
          console.error("Error fetching enrollments:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      enrollCourse: async (courseId: string) => {
        const { currentUser } = get();
        if (!currentUser) throw new Error("User not authenticated");

        set({ isLoading: true });
        try {
          const enrollment = await enrollmentAPI.enroll(
            currentUser.id,
            courseId
          );
          set((state) => ({
            enrollments: [...state.enrollments, enrollment],
          }));
          return enrollment;
        } catch (error) {
          console.error("Error enrolling in course:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      unenrollCourse: async (courseId: string) => {
        const { currentUser } = get();
        if (!currentUser) throw new Error("User not authenticated");

        set({ isLoading: true });
        try {
          await enrollmentAPI.unenroll(currentUser.id, courseId);
          set((state) => ({
            enrollments: state.enrollments.filter(
              (e) => !(e.userId === currentUser.id && e.courseId === courseId)
            ),
            progress: state.progress.filter(
              (p) => !(p.userId === currentUser.id && p.courseId === courseId)
            ),
          }));
        } catch (error) {
          console.error("Error unenrolling from course:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // CHANGED: Now synchronous - checks enrollments array directly
      isUserEnrolled: (courseId: string) => {
        const { currentUser, enrollments } = get();
        if (!currentUser) return false;

        return enrollments.some(
          (e) => e.courseId === courseId && e.userId === currentUser.id
        );
      },

      // Progress actions
      fetchCourseProgress: async (courseId: string) => {
        const { currentUser } = get();
        if (!currentUser) return [];

        set({ isLoading: true });
        try {
          const progress = await progressAPI.getByCourse(
            currentUser.id,
            courseId
          );
          // Update progress in state for this course
          set((state) => ({
            progress: [
              ...state.progress.filter(
                (p) => !(p.userId === currentUser.id && p.courseId === courseId)
              ),
              ...progress,
            ],
          }));
          return progress;
        } catch (error) {
          console.error("Error fetching progress:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      markLessonComplete: async (courseId: string, lessonId: string) => {
        const { currentUser } = get();
        if (!currentUser) throw new Error("User not authenticated");

        set({ isLoading: true });
        try {
          const progress = await progressAPI.updateLesson(
            currentUser.id,
            courseId,
            lessonId,
            true
          );

          // Update progress in state
          set((state) => {
            const existingProgress = state.progress.find(
              (p) => p.id === progress.id
            );
            if (existingProgress) {
              return {
                progress: state.progress.map((p) =>
                  p.id === progress.id ? progress : p
                ),
              };
            } else {
              return {
                progress: [...state.progress, progress],
              };
            }
          });

          // Update enrollment completion percentage
          const completionPercentage = await get().getCourseProgress(courseId);
          set((state) => ({
            enrollments: state.enrollments.map((e) =>
              e.userId === currentUser.id && e.courseId === courseId
                ? {
                    ...e,
                    completionPercentage,
                    status:
                      completionPercentage === 100 ? "completed" : "active",
                  }
                : e
            ),
          }));

          return progress;
        } catch (error) {
          console.error("Error marking lesson complete:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      markLessonIncomplete: async (courseId: string, lessonId: string) => {
        const { currentUser } = get();
        if (!currentUser) throw new Error("User not authenticated");

        set({ isLoading: true });
        try {
          const progress = await progressAPI.updateLesson(
            currentUser.id,
            courseId,
            lessonId,
            false
          );

          // Update progress in state
          set((state) => ({
            progress: state.progress.map((p) =>
              p.id === progress.id ? progress : p
            ),
          }));

          // Update enrollment completion percentage
          const completionPercentage = await get().getCourseProgress(courseId);
          set((state) => ({
            enrollments: state.enrollments.map((e) =>
              e.userId === currentUser.id && e.courseId === courseId
                ? {
                    ...e,
                    completionPercentage,
                    status: "active",
                  }
                : e
            ),
          }));

          return progress;
        } catch (error) {
          console.error("Error marking lesson incomplete:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateLastAccessed: async (courseId: string, lessonId: string) => {
        const { currentUser } = get();
        if (!currentUser) throw new Error("User not authenticated");

        try {
          const progress = await progressAPI.updateLesson(
            currentUser.id,
            courseId,
            lessonId,
            false // Not completed, just accessed
          );

          // Update progress in state
          set((state) => {
            const existingProgress = state.progress.find(
              (p) => p.id === progress.id
            );
            if (existingProgress) {
              return {
                progress: state.progress.map((p) =>
                  p.id === progress.id ? progress : p
                ),
              };
            } else {
              return {
                progress: [...state.progress, progress],
              };
            }
          });

          return progress;
        } catch (error) {
          console.error("Error updating last accessed:", error);
          throw error;
        }
      },

      getCourseProgress: async (courseId: string) => {
        const { currentUser } = get();
        if (!currentUser) return 0;

        try {
          return await progressAPI.getCourseCompletion(
            currentUser.id,
            courseId
          );
        } catch (error) {
          console.error("Error getting course progress:", error);
          return 0;
        }
      },

      // Utility functions
      getLessonsByCourse: (courseId: string) => {
        return get()
          .lessons.filter((l) => l.courseId === courseId)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: "elearning-storage",
      partialize: (state) => ({
        // Only persist the current user
        currentUser: state.currentUser,
      }),
    }
  )
);
