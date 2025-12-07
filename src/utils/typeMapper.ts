/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/typeMapper.ts
// Converts between Supabase database types and your app types

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

// User mappers
export function mapDbUserToApp(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
    createdAt: dbUser.created_at,
  };
}

// Course mappers
export function mapDbCourseToApp(dbCourse: DbCourse): Course {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    thumbnail: dbCourse.thumbnail,
    category: dbCourse.category,
    prerequisites: dbCourse.prerequisites || [], // Array from DB
    duration: Number(dbCourse.duration) || 0, // Convert string to number
    level: dbCourse.level,
    createdBy: dbCourse.instructor, // Map instructor to createdBy
    createdAt: dbCourse.created_at,
    updatedAt: dbCourse.updated_at,
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
    prerequisites: course.prerequisites || [],
    duration: String(course.duration ?? 0), // Convert number to string
    level: course.level,
    instructor: course.createdBy || "", // Map createdBy to instructor
  };
}

// Lesson mappers
export function mapDbLessonToApp(dbLesson: DbLesson): Lesson {
  return {
    id: dbLesson.id,
    courseId: dbLesson.course_id,
    title: dbLesson.title,
    description: dbLesson.description,
    order: dbLesson.order_num,
    videoUrl: dbLesson.video_url,
    materials: (dbLesson.materials as any as Material[]) || [], // Parse JSONB
    duration: Number(dbLesson.duration) || 0, // Convert string to number
    type: dbLesson.type,
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
    materials: lesson.materials as any, // Convert to JSONB
    duration: String(lesson.duration ?? 0), // Convert number to string
    type: lesson.type,
  };
}

// Enrollment mappers
export function mapDbEnrollmentToApp(dbEnrollment: DbEnrollment): Enrollment {
  return {
    id: dbEnrollment.id,
    userId: dbEnrollment.user_id,
    courseId: dbEnrollment.course_id,
    enrolledAt: dbEnrollment.enrolled_at,
    // Map "cancelled" to "dropped" for app types
    status: (dbEnrollment.status === "cancelled"
      ? "dropped"
      : dbEnrollment.status) as Enrollment["status"],
    completionPercentage: dbEnrollment.completion_percentage,
  };
}

// Progress mappers
export function mapDbProgressToApp(dbProgress: DbProgress): Progress {
  return {
    id: dbProgress.id,
    userId: dbProgress.user_id,
    courseId: dbProgress.course_id,
    lessonId: dbProgress.lesson_id,
    completed: dbProgress.completed,
    completedAt: dbProgress.completed_at || undefined,
    lastAccessedAt: dbProgress.last_accessed_at,
  };
}
