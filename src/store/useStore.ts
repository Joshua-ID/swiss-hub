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

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheMetadata {
  coursesLastFetched: number | null;
  enrollmentsLastFetched: number | null;
  usersLastFetched: number | null;
  lessonsLastFetched: { [courseId: string]: number };
}

interface AppState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;

  enrollmentsLoaded: boolean;

  courses: Course[];
  lessons: Lesson[];
  progress: Progress[];
  enrollments: Enrollment[];

  // Cache metadata
  _cache: CacheMetadata;

  // Users for admin dashboard
  users: User[];
  fetchUsers: (force?: boolean) => Promise<void>;

  setCurrentUser: (user: User | null) => void;
  initializeUser: (
    clerkId: string,
    email: string,
    name: string
  ) => Promise<void>;
  logoutUser: () => Promise<void>;

  fetchCourses: (force?: boolean) => Promise<void>;
  addCourse: (
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ) => Promise<Course>;
  updateCourse: (courseId: string, updates: Partial<Course>) => Promise<Course>;
  deleteCourse: (courseId: string) => Promise<void>;

  fetchLessonsByCourse: (
    courseId: string,
    force?: boolean
  ) => Promise<Lesson[]>;
  addLesson: (lesson: Omit<Lesson, "id">) => Promise<Lesson>;
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => Promise<Lesson>;
  deleteLesson: (lessonId: string) => Promise<void>;

  fetchUserEnrollments: (
    userId?: string,
    force?: boolean
  ) => Promise<Enrollment[]>;
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
  getCourseProgress: (userId: string, courseId: string) => Promise<number>;

  getLessonsByCourse: (courseId: string) => Lesson[];
  refreshData: (force?: boolean) => Promise<void>;
  ensureEnrollmentsLoaded: (force?: boolean) => Promise<void>;
  invalidateCache: (type?: "courses" | "enrollments" | "users" | "all") => void;
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

      users: [],

      // Initialize cache metadata
      _cache: {
        coursesLastFetched: null,
        enrollmentsLastFetched: null,
        usersLastFetched: null,
        lessonsLastFetched: {},
      },

      // Helper function to check if cache is valid
      _isCacheValid: (lastFetched: number | null): boolean => {
        if (!lastFetched) return false;
        return Date.now() - lastFetched < CACHE_DURATION;
      },

      // Invalidate cache manually
      invalidateCache: (type = "all") => {
        set((state) => {
          const newCache = { ...state._cache };

          switch (type) {
            case "courses":
              newCache.coursesLastFetched = null;
              break;
            case "enrollments":
              newCache.enrollmentsLastFetched = null;
              break;
            case "users":
              newCache.usersLastFetched = null;
              break;
            case "all":
              newCache.coursesLastFetched = null;
              newCache.enrollmentsLastFetched = null;
              newCache.usersLastFetched = null;
              newCache.lessonsLastFetched = {};
              break;
          }

          return { _cache: newCache };
        });
      },

      // -----------------------------------------------------
      // USERS (ADMIN)
      // -----------------------------------------------------
      fetchUsers: async (force = false) => {
        const state = get();

        // Check cache validity
        if (!force && state._cache.usersLastFetched) {
          const isValid =
            Date.now() - state._cache.usersLastFetched < CACHE_DURATION;
          if (isValid && state.users.length > 0) {
            console.log("Using cached users data");
            return;
          }
        }

        try {
          set({ isLoading: true });
          const users = await userAPI.getAll();
          set((state) => ({
            users,
            _cache: {
              ...state._cache,
              usersLastFetched: Date.now(),
            },
          }));
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
          await get().refreshData(false); // Use cache on initial load
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
          _cache: {
            coursesLastFetched: null,
            enrollmentsLastFetched: null,
            usersLastFetched: null,
            lessonsLastFetched: {},
          },
        });
      },

      // REFRESH ---------------------------------------------
      refreshData: async (force = false) => {
        const { currentUser } = get();
        if (!currentUser) return;

        try {
          set({ isLoading: true });

          await get().fetchCourses(force);
          await get().fetchUserEnrollments(currentUser.id, force);

          // Load users only if admin
          if (currentUser.role === "admin") {
            await get().fetchUsers(force);
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
      ensureEnrollmentsLoaded: async (force = false) => {
        const { currentUser, enrollmentsLoaded, _cache } = get();
        if (!currentUser) return;

        // Check if already loaded and cache is valid
        if (!force && enrollmentsLoaded && _cache.enrollmentsLastFetched) {
          const isValid =
            Date.now() - _cache.enrollmentsLastFetched < CACHE_DURATION;
          if (isValid) {
            console.log("Using cached enrollments data");
            return;
          }
        }

        await get().fetchUserEnrollments(currentUser.id, force);
      },

      // -----------------------------------------------------
      // COURSES
      // -----------------------------------------------------
      fetchCourses: async (force = false) => {
        const state = get();

        // Check cache validity
        if (!force && state._cache.coursesLastFetched) {
          const isValid =
            Date.now() - state._cache.coursesLastFetched < CACHE_DURATION;
          if (isValid && state.courses.length > 0) {
            console.log("Using cached courses data");
            return;
          }
        }

        set({ isLoading: true, error: null });
        try {
          const courses = await courseAPI.getAll();
          set((state) => ({
            courses,
            _cache: {
              ...state._cache,
              coursesLastFetched: Date.now(),
            },
          }));
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
            _cache: {
              ...state._cache,
              coursesLastFetched: Date.now(), // Update cache timestamp
            },
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
            _cache: {
              ...state._cache,
              coursesLastFetched: Date.now(),
            },
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
            _cache: {
              ...state._cache,
              coursesLastFetched: Date.now(),
            },
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      // -----------------------------------------------------
      // LESSONS
      // -----------------------------------------------------
      fetchLessonsByCourse: async (courseId: string, force = false) => {
        const state = get();

        // Check cache validity for this specific course
        if (!force && state._cache.lessonsLastFetched[courseId]) {
          const isValid =
            Date.now() - state._cache.lessonsLastFetched[courseId] <
            CACHE_DURATION;
          const hasLessons = state.lessons.some((l) => l.courseId === courseId);

          if (isValid && hasLessons) {
            console.log(`Using cached lessons for course ${courseId}`);
            return state.lessons.filter((l) => l.courseId === courseId);
          }
        }

        set({ isLoading: true });
        try {
          const lessons = await lessonAPI.getByCourse(courseId);
          set((state) => ({
            lessons: [
              ...state.lessons.filter((l) => l.courseId !== courseId),
              ...lessons,
            ],
            _cache: {
              ...state._cache,
              lessonsLastFetched: {
                ...state._cache.lessonsLastFetched,
                [courseId]: Date.now(),
              },
            },
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
            _cache: {
              ...state._cache,
              lessonsLastFetched: {
                ...state._cache.lessonsLastFetched,
                [lesson.courseId]: Date.now(),
              },
            },
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
            _cache: {
              ...state._cache,
              lessonsLastFetched: {
                ...state._cache.lessonsLastFetched,
                [updatedLesson.courseId]: Date.now(),
              },
            },
          }));
          return updatedLesson;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteLesson: async (lessonId) => {
        set({ isLoading: true });
        try {
          const lesson = get().lessons.find((l) => l.id === lessonId);
          await lessonAPI.delete(lessonId);
          set((state) => ({
            lessons: state.lessons.filter((l) => l.id !== lessonId),
            progress: state.progress.filter((p) => p.lessonId !== lessonId),
            _cache: lesson
              ? {
                  ...state._cache,
                  lessonsLastFetched: {
                    ...state._cache.lessonsLastFetched,
                    [lesson.courseId]: Date.now(),
                  },
                }
              : state._cache,
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      // -----------------------------------------------------
      // ENROLLMENTS
      // -----------------------------------------------------
      fetchUserEnrollments: async (userId?: string, force = false) => {
        const { currentUser, _cache } = get();
        const targetUserId = userId || currentUser?.id;
        if (!targetUserId) return [];

        // Check cache validity
        if (!force && _cache.enrollmentsLastFetched) {
          const isValid =
            Date.now() - _cache.enrollmentsLastFetched < CACHE_DURATION;
          if (isValid && get().enrollments.length > 0) {
            console.log("Using cached enrollments data");
            return get().enrollments;
          }
        }

        set({ isLoading: true });
        try {
          const enrollments = await enrollmentAPI.getByUser(targetUserId);
          set((state) => ({
            enrollments,
            enrollmentsLoaded: true,
            _cache: {
              ...state._cache,
              enrollmentsLastFetched: Date.now(),
            },
          }));
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
            _cache: {
              ...state._cache,
              enrollmentsLastFetched: Date.now(),
            },
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
            _cache: {
              ...state._cache,
              enrollmentsLastFetched: Date.now(),
            },
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

          const completionPercentage = await get().getCourseProgress(
            currentUser.id,
            courseId
          );

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

          const completionPercentage = await get().getCourseProgress(
            currentUser.id,
            courseId
          );

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

      getCourseProgress: async (courseId: string, userId?: string) => {
        const { currentUser } = get();
        const targetUserId = userId || currentUser?.id;
        if (!targetUserId) return 0;

        try {
          return await progressAPI.getCourseCompletion(targetUserId, courseId);
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
      name: "swiss-hub",
      partialize: (state) => ({
        currentUser: state.currentUser,
        courses: state.courses,
        lessons: state.lessons,
        enrollments: state.enrollments,
        enrollmentsLoaded: state.enrollmentsLoaded,
        _cache: state._cache,
      }),
    }
  )
);
