import type { Course, Enrollment, Lesson, Progress, User } from "@/types";
interface AppState {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
    enrollmentsLoaded: boolean;
    courses: Course[];
    lessons: Lesson[];
    progress: Progress[];
    enrollments: Enrollment[];
    users: User[];
    fetchUsers: () => Promise<void>;
    setCurrentUser: (user: User | null) => void;
    initializeUser: (clerkId: string, email: string, name: string) => Promise<void>;
    logoutUser: () => Promise<void>;
    fetchCourses: () => Promise<void>;
    addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt">) => Promise<Course>;
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
    markLessonIncomplete: (courseId: string, lessonId: string) => Promise<Progress>;
    updateLastAccessed: (courseId: string, lessonId: string) => Promise<Progress>;
    getCourseProgress: (userId: string, courseId: string) => Promise<number>;
    getLessonsByCourse: (courseId: string) => Lesson[];
    refreshData: () => Promise<void>;
    ensureEnrollmentsLoaded: () => Promise<void>;
}
export declare const useStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<AppState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<AppState, {
            currentUser: User | null;
        }>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: AppState) => void) => () => void;
        onFinishHydration: (fn: (state: AppState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<AppState, {
            currentUser: User | null;
        }>>;
    };
}>;
export {};
