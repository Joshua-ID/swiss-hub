/**
 * Backend API Service with Supabase
 * Handles all communication with Supabase backend
 */
import type { User, Course, Lesson, Enrollment, Progress } from "@/types";
export declare const userAPI: {
    getByClerkId(clerkId: string): Promise<User | null>;
    create(userData: {
        clerkId: string;
        email: string;
        name: string;
        role: "admin" | "student";
    }): Promise<User>;
    updateRole(userId: string, role: "admin" | "student"): Promise<User>;
    getAll(): Promise<User[]>;
};
export declare const courseAPI: {
    getAll(): Promise<Course[]>;
    getById(id: string): Promise<Course | null>;
    create(course: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course>;
    update(id: string, updates: Partial<Course>): Promise<Course>;
    delete(id: string): Promise<boolean>;
};
export declare const lessonAPI: {
    getByCourse(courseId: string): Promise<Lesson[]>;
    create(lesson: Omit<Lesson, "id">): Promise<Lesson>;
    update(id: string, updates: Partial<Lesson>): Promise<Lesson>;
    delete(id: string): Promise<boolean>;
};
export declare const enrollmentAPI: {
    getByUser(userId: string): Promise<Enrollment[]>;
    enroll(userId: string, courseId: string): Promise<Enrollment>;
    unenroll(userId: string, courseId: string): Promise<boolean>;
    isEnrolled(userId: string, courseId: string): Promise<boolean>;
};
export declare const progressAPI: {
    getByCourse(userId: string, courseId: string): Promise<Progress[]>;
    updateLesson(userId: string, courseId: string, lessonId: string, completed: boolean): Promise<Progress>;
    getCourseCompletion(userId: string, courseId: string): Promise<number>;
};
export declare const statsAPI: {
    getDashboard(): Promise<{
        totalCourses: number;
        totalUsers: number;
        totalEnrollments: number;
    }>;
};
