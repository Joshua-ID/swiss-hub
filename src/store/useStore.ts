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
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  enrollmentsLoaded: boolean;

  courses: Course[];
  lessons: Lesson[];
  progress: Progress[];
  enrollments: Enrollment[];

  // ✅ USERS FOR ADMIN DASHBOARD
  users: User[];
  fetchUsers: () => Promise<void>;

  setCurrentUser: (user: User | null) => void;
  initializeUser: (
    clerkId: string,
    email: string,
    name: string
  ) => Promise<void>;
  logoutUser: () => Promise<void>;

  fetchCourses: () => Promise<void>;
  addCourse: (
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ) => Promise<Course>;
  updateCourse: (courseId: string, updates: Partial<Course>) => Promise<Course>;
  deleteCourse: (courseId: string) => Promise<void>;

  fetchLessonsByCourse: (courseId: string) => Promise<Lesson[]>;
  addLesson: (lesson: Omit<Lesson, "id">) => Promise<Lesson>;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => Promise<Lesson>;
  deleteLesson: (lessonId: string) => Promise<void>;

  fetchUserEnrollments: (userId?: string) => Promise<Enrollment[]>;
  enrollCourse: (courseId: string) => Promise<Enrollment>;
  unenrollCourse: (courseId: string) => Promise<void>;
  isUserEnrolled: (courseId: string) => boolean;

  fetchCourseProgress: (courseId: string) => Promise<Progress[]>;
  markLessonComplete: (courseId: string, lessonId: string) => Promise<Progress>;
  markLessonIncomplete: (
    courseId: string,
    lessonId: string
  ) => Promise<Progress>;
  updateLastAccessed: (courseId: string, lessonId: string) => Promise<Progress>;
  getCourseProgress: (courseId: string) => Promise<number>;

  getLessonsByCourse: (courseId: string) => Lesson[];
  refreshData: () => Promise<void>;
  ensureEnrollmentsLoaded: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: false,
      courses: [],
      lessons: [],
      progress: [],
      enrollments: [],
      error: null,
      enrollmentsLoaded: false,

      // ✅ INIT USERS ARRAY
      users: [],

      // -----------------------------------------------------
      // USERS (ADMIN)
      // -----------------------------------------------------
      fetchUsers: async () => {
        try {
          set({ isLoading: true });
          const users = await userAPI.getAll();
          set({ users });
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // USER LOGIC ------------------------------------------
      setCurrentUser: (user) => set({ currentUser: user }),

      initializeUser: async (clerkId: string, email: string, name: string) => {
        set({ isLoading: true });
        try {
          let user = await userAPI.getByClerkId(clerkId);

          if (!user) {
            user = await userAPI.create({
              clerkId,
              email,
              name,
              role: "student",
            });
          }

          set({ currentUser: user });
          await get().refreshData();
        } catch (error) {
          console.error("Error initializing user:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logoutUser: async () => {
        set({
          currentUser: null,
          courses: [],
          lessons: [],
          progress: [],
          enrollments: [],
          users: [],
          enrollmentsLoaded: false,
        });
      },

      // REFRESH ---------------------------------------------
      refreshData: async () => {
        const { currentUser } = get();
        if (!currentUser) return;

        try {
          set({ isLoading: true });

          const courses = await courseAPI.getAll();
          set({ courses });

          const enrollments = await enrollmentAPI.getByUser(currentUser.id);
          set({ enrollments, enrollmentsLoaded: true });

          // ✅ LOAD USERS ONLY IF ADMIN
          if (currentUser.role === "admin") {
            const users = await userAPI.getAll();
            set({ users });
          }
        } catch (error) {
          console.error("Error refreshing data:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // -----------------------------------------------------
      // ENSURE ENROLLMENTS
      // -----------------------------------------------------
      ensureEnrollmentsLoaded: async () => {
        const { currentUser, enrollmentsLoaded } = get();
        if (!currentUser) return;
        if (enrollmentsLoaded) return;

        try {
          const enrollments = await enrollmentAPI.getByUser(currentUser.id);
          set({ enrollments, enrollmentsLoaded: true });
        } catch (error) {
          console.error("Error loading enrollments:", error);
        }
      },

      // -----------------------------------------------------
      // COURSES
      // -----------------------------------------------------
      fetchCourses: async () => {
        set({ isLoading: true, error: null });
        try {
          const courses = await courseAPI.getAll();
          set({ courses });
        } catch (error: any) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      addCourse: async (course) => {
        set({ isLoading: true });
        try {
          const newCourse = await courseAPI.create(course);
          set((state) => ({
            courses: [...state.courses, newCourse],
          }));
          return newCourse;
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
        } finally {
          set({ isLoading: false });
        }
      },

      // -----------------------------------------------------
      // LESSONS
      // -----------------------------------------------------
      fetchLessonsByCourse: async (courseId: string) => {
        set({ isLoading: true });
        try {
          const lessons = await lessonAPI.getByCourse(courseId);
          set((state) => ({
            lessons: [
              ...state.lessons.filter((l) => l.courseId !== courseId),
              ...lessons,
            ],
          }));
          return lessons;
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
        } finally {
          set({ isLoading: false });
        }
      },

      // -----------------------------------------------------
      // ENROLLMENTS
      // -----------------------------------------------------
      fetchUserEnrollments: async (userId?: string) => {
        const { currentUser } = get();
        const targetUserId = userId || currentUser?.id;
        if (!targetUserId) return [];

        set({ isLoading: true });
        try {
          const enrollments = await enrollmentAPI.getByUser(targetUserId);
          set({ enrollments, enrollmentsLoaded: true });
          return enrollments;
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
        } finally {
          set({ isLoading: false });
        }
      },

      isUserEnrolled: (courseId: string) => {
        const { currentUser, enrollments } = get();
        if (!currentUser) return false;

        return enrollments.some(
          (e) => e.courseId === courseId && e.userId === currentUser.id
        );
      },

      // -----------------------------------------------------
      // PROGRESS
      // -----------------------------------------------------
      fetchCourseProgress: async (courseId: string) => {
        const { currentUser } = get();
        if (!currentUser) return [];

        set({ isLoading: true });
        try {
          const progress = await progressAPI.getByCourse(
            currentUser.id,
            courseId
          );
          set((state) => ({
            progress: [
              ...state.progress.filter(
                (p) => !(p.userId === currentUser.id && p.courseId === courseId)
              ),
              ...progress,
            ],
          }));
          return progress;
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

          set((state) => {
            const exists = state.progress.find((p) => p.id === progress.id);
            return {
              progress: exists
                ? state.progress.map((p) =>
                    p.id === progress.id ? progress : p
                  )
                : [...state.progress, progress],
            };
          });

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

          set((state) => ({
            progress: state.progress.map((p) =>
              p.id === progress.id ? progress : p
            ),
          }));

          const completionPercentage = await get().getCourseProgress(courseId);

          set((state) => ({
            enrollments: state.enrollments.map((e) =>
              e.userId === currentUser.id && e.courseId === courseId
                ? { ...e, completionPercentage, status: "active" }
                : e
            ),
          }));

          return progress;
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
            false
          );

          set((state) => {
            const exists = state.progress.find((p) => p.id === progress.id);
            return {
              progress: exists
                ? state.progress.map((p) =>
                    p.id === progress.id ? progress : p
                  )
                : [...state.progress, progress],
            };
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

      // -----------------------------------------------------
      // UTILITIES
      // -----------------------------------------------------
      getLessonsByCourse: (courseId: string) => {
        return get()
          .lessons.filter((l) => l.courseId === courseId)
          .sort((a, b) => a.order - b.order);
      },
    }),
    {
      name: "elearning-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
