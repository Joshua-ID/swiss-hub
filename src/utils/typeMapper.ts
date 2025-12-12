/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/typeMapper.ts

import type { Database } from "@/types/database";
import type {
  User,
  Course,
  Lesson,
  Enrollment,
  Progress,
  Material,
} from "@/types";

type DbUser = Database["public"]["Tables"]["users"]["Row"];
type DbCourse = Database["public"]["Tables"]["courses"]["Row"];
type DbLesson = Database["public"]["Tables"]["lessons"]["Row"];
type DbEnrollment = Database["public"]["Tables"]["enrollments"]["Row"];
type DbProgress = Database["public"]["Tables"]["progress"]["Row"];

// Enums for app domain
export type UserRole = "admin" | "student";
export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type EnrollmentStatus = "active" | "completed" | "dropped";
export type LessonType = "video" | "reading" | "quiz";

// ---------------- USER ----------------
export function mapDbUserToApp(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as UserRole,
    createdAt: dbUser.created_at ?? undefined,
  };
}

// ---------------- COURSE ----------------
export function mapDbCourseToApp(dbCourse: DbCourse): Course {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    thumbnail: dbCourse.thumbnail,
    category: dbCourse.category,
    prerequisites: dbCourse.prerequisites ?? [],
    duration: Number(dbCourse.duration) || 0,
    level: dbCourse.level as CourseLevel,
    createdBy: dbCourse.instructor,
    createdAt: dbCourse.created_at ?? undefined,
    updatedAt: dbCourse.updated_at ?? undefined,
  };
}

export function mapAppCourseToDb(
  course: Omit<Course, "id" | "createdAt" | "updatedAt">
): Database["public"]["Tables"]["courses"]["Insert"] {
  return {
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    category: course.category,
    prerequisites: course.prerequisites,
    duration: String(course.duration),
    level: course.level,
    instructor: course.createdBy,
  };
}

// ---------------- LESSON ----------------
export function mapDbLessonToApp(dbLesson: DbLesson): Lesson {
  return {
    id: dbLesson.id,
    courseId: dbLesson.course_id,
    title: dbLesson.title,
    description: dbLesson.description,
    order: dbLesson.order_num,
    videoUrl: dbLesson.video_url,
    materials: (dbLesson.materials as any as Material[]) ?? [],
    duration: Number(dbLesson.duration) || 0,
    type: dbLesson.type as LessonType,
  };
}

export function mapAppLessonToDb(
  lesson: Omit<Lesson, "id">
): Database["public"]["Tables"]["lessons"]["Insert"] {
  return {
    course_id: lesson.courseId,
    title: lesson.title,
    description: lesson.description,
    order_num: lesson.order,
    video_url: lesson.videoUrl,
    materials: lesson.materials as any,
    duration: String(lesson.duration),
    type: lesson.type,
  };
}

// ---------------- ENROLLMENT ----------------
export function mapDbEnrollmentToApp(dbEnrollment: DbEnrollment): Enrollment {
  return {
    id: dbEnrollment.id,
    userId: dbEnrollment.user_id,
    courseId: dbEnrollment.course_id,
    enrolledAt: dbEnrollment.enrolled_at ?? undefined,
    status: (dbEnrollment.status === "cancelled"
      ? "dropped"
      : dbEnrollment.status) as EnrollmentStatus,
    completionPercentage: dbEnrollment.completion_percentage ?? 0,
  };
}

// ---------------- PROGRESS ----------------
export function mapDbProgressToApp(dbProgress: DbProgress): Progress {
  return {
    id: dbProgress.id,
    userId: dbProgress.user_id,
    courseId: dbProgress.course_id,
    lessonId: dbProgress.lesson_id,
    completed: dbProgress.completed ?? false,
    completedAt: dbProgress.completed_at ?? undefined,
    lastAccessedAt: dbProgress.last_accessed_at ?? undefined,
  };
}
