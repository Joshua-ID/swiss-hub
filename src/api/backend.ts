/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Backend API Service with Supabase
 * Handles all communication with Supabase backend
 */

import { supabase } from "@/lib/supabase";
import type { User, Course, Lesson, Enrollment, Progress } from "@/types";
import {
  mapDbUserToApp,
  mapDbCourseToApp,
  mapDbLessonToApp,
  mapDbEnrollmentToApp,
  mapDbProgressToApp,
  mapAppCourseToDb,
  mapAppLessonToDb,
} from "@/utils/typeMapper";

// User API
export const userAPI = {
  // Get current user by Clerk ID
  async getByClerkId(clerkId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkId) // snake_case
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return mapDbUserToApp(data);
  },

  // Create user (called after Clerk signup)
  async create(userData: {
    clerkId: string;
    email: string;
    name: string;
    role: "admin" | "student";
  }): Promise<User> {
    // Map from camelCase to snake_case
    const dbUserData = {
      clerk_id: userData.clerkId,
      email: userData.email,
      name: userData.name,
      role: userData.role,
    };

    const { data, error } = await supabase
      .from("users")
      .insert(dbUserData)
      .select()
      .single();

    if (error) {
      console.error("Failed to create user:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return mapDbUserToApp(data);
  },

  // Update user role
  async updateRole(userId: string, role: "admin" | "student"): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update role: ${error.message}`);
    }

    return mapDbUserToApp(data);
  },
};

// Course API
export const courseAPI = {
  // Get all courses
  async getAll(): Promise<Course[]> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false }); // snake_case

    if (error) {
      throw new Error(`Failed to fetch courses: ${error.message}`);
    }

    return (data || []).map(mapDbCourseToApp);
  },

  // Get single course
  async getById(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching course:", error);
      return null;
    }

    return mapDbCourseToApp(data);
  },

  // Create course
  async create(
    course: Omit<Course, "id" | "createdAt" | "updatedAt">
  ): Promise<Course> {
    const dbCourse = mapAppCourseToDb(course);

    const { data, error } = await supabase
      .from("courses")
      .insert(dbCourse)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create course: ${error.message}`);
    }

    return mapDbCourseToApp(data);
  },

  // Update course
  async update(id: string, updates: Partial<Course>): Promise<Course> {
    // Map app updates to DB format
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined)
      dbUpdates.description = updates.description;
    if (updates.thumbnail !== undefined)
      dbUpdates.thumbnail = updates.thumbnail;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.prerequisites !== undefined)
      dbUpdates.prerequisites = updates.prerequisites;
    if (updates.duration !== undefined)
      dbUpdates.duration = String(updates.duration);
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.createdBy !== undefined)
      dbUpdates.instructor = updates.createdBy;

    dbUpdates.updated_at = new Date().toISOString(); // snake_case

    const { data, error } = await supabase
      .from("courses")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update course: ${error.message}`);
    }

    return mapDbCourseToApp(data);
  },

  // Delete course
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete course: ${error.message}`);
    }

    return true;
  },
};

// Lesson API
export const lessonAPI = {
  // Get lessons for a course
  async getByCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId) // snake_case
      .order("order_num", { ascending: true }); // snake_case

    if (error) {
      throw new Error(`Failed to fetch lessons: ${error.message}`);
    }

    return (data || []).map(mapDbLessonToApp);
  },

  // Create lesson
  async create(lesson: Omit<Lesson, "id">): Promise<Lesson> {
    const dbLesson = mapAppLessonToDb(lesson);

    const { data, error } = await supabase
      .from("lessons")
      .insert(dbLesson)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create lesson: ${error.message}`);
    }

    return mapDbLessonToApp(data);
  },

  // Update lesson
  async update(id: string, updates: Partial<Lesson>): Promise<Lesson> {
    // Map app updates to DB format
    const dbUpdates: any = {};
    if (updates.courseId !== undefined) dbUpdates.course_id = updates.courseId;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined)
      dbUpdates.description = updates.description;
    if (updates.order !== undefined) dbUpdates.order_num = updates.order;
    if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
    if (updates.materials !== undefined)
      dbUpdates.materials = updates.materials;
    if (updates.duration !== undefined)
      dbUpdates.duration = String(updates.duration);
    if (updates.type !== undefined) dbUpdates.type = updates.type;

    const { data, error } = await supabase
      .from("lessons")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update lesson: ${error.message}`);
    }

    return mapDbLessonToApp(data);
  },

  // Delete lesson
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("lessons").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete lesson: ${error.message}`);
    }

    return true;
  },
};

// Enrollment API
export const enrollmentAPI = {
  // Get user enrollments
  async getByUser(userId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", userId) // snake_case
      .order("enrolled_at", { ascending: false }); // snake_case

    if (error) {
      throw new Error(`Failed to fetch enrollments: ${error.message}`);
    }

    return (data || []).map(mapDbEnrollmentToApp);
  },

  // Enroll in course
  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: userId, // snake_case
        course_id: courseId, // snake_case
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to enroll: ${error.message}`);
    }

    return mapDbEnrollmentToApp(data);
  },

  // Unenroll from course
  async unenroll(userId: string, courseId: string): Promise<boolean> {
    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("user_id", userId) // snake_case
      .eq("course_id", courseId); // snake_case

    if (error) {
      throw new Error(`Failed to unenroll: ${error.message}`);
    }

    return true;
  },

  // Check if user is enrolled
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", userId) // snake_case
      .eq("course_id", courseId) // snake_case
      .single();

    return !error && !!data;
  },
};

// Progress API
export const progressAPI = {
  // Get progress for a course
  async getByCourse(userId: string, courseId: string): Promise<Progress[]> {
    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId) // snake_case
      .eq("course_id", courseId); // snake_case

    if (error) {
      throw new Error(`Failed to fetch progress: ${error.message}`);
    }

    return (data || []).map(mapDbProgressToApp);
  },

  // Update lesson progress
  async updateLesson(
    userId: string,
    courseId: string,
    lessonId: string,
    completed: boolean
  ): Promise<Progress> {
    // Check if progress exists
    const { data: existing } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", userId) // snake_case
      .eq("course_id", courseId) // snake_case
      .eq("lesson_id", lessonId) // snake_case
      .single();

    if (existing) {
      // Update existing progress
      const { data, error } = await supabase
        .from("progress")
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null, // snake_case
          last_accessed_at: new Date().toISOString(), // snake_case
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update progress: ${error.message}`);
      }

      return mapDbProgressToApp(data);
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from("progress")
        .insert({
          user_id: userId, // snake_case
          course_id: courseId, // snake_case
          lesson_id: lessonId, // snake_case
          completed,
          completed_at: completed ? new Date().toISOString() : null, // snake_case
          last_accessed_at: new Date().toISOString(), // snake_case
        } as any)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create progress: ${error.message}`);
      }

      return mapDbProgressToApp(data);
    }
  },

  // Calculate course completion percentage
  async getCourseCompletion(userId: string, courseId: string): Promise<number> {
    // Get total lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId); // snake_case

    if (lessonsError || !lessons || lessons.length === 0) return 0;

    // Get completed lessons
    const { data: completed, error: progressError } = await supabase
      .from("progress")
      .select("id")
      .eq("user_id", userId) // snake_case
      .eq("course_id", courseId) // snake_case
      .eq("completed", true);

    if (progressError) return 0;

    return Math.round(((completed?.length || 0) / lessons.length) * 100);
  },
};

// Stats API (Admin only)
export const statsAPI = {
  // Get dashboard stats
  async getDashboard() {
    const [coursesResult, usersResult, enrollmentsResult] = await Promise.all([
      supabase.from("courses").select("id", { count: "exact" }),
      supabase.from("users").select("id", { count: "exact" }),
      supabase.from("enrollments").select("id", { count: "exact" }),
    ]);

    return {
      totalCourses: coursesResult.count || 0,
      totalUsers: usersResult.count || 0,
      totalEnrollments: enrollmentsResult.count || 0,
    };
  },
};
