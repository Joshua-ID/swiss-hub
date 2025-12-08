// src/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerkId: string;
          email: string;
          name: string;
          role: "admin" | "student";
          created_at: string;
        };
        Insert: {
          id?: string;
          clerkId: string;
          email: string;
          name: string;
          role?: "admin" | "student";
          created_at?: string;
        };
        Update: {
          id?: string;
          clerkId?: string;
          email?: string;
          name?: string;
          role?: "admin" | "student";
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          thumbnail: string;
          category: string;
          prerequisites: string[];
          duration: string;
          level: "beginner" | "intermediate" | "advanced";
          instructor: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          thumbnail: string;
          category: string;
          prerequisites?: string[];
          duration: string;
          level: "beginner" | "intermediate" | "advanced";
          instructor: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          thumbnail?: string;
          category?: string;
          prerequisites?: string[];
          duration?: string;
          level?: "beginner" | "intermediate" | "advanced";
          instructor?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string;
          order_num: number;
          video_url: string;
          materials: Json;
          duration: string;
          type: "video" | "reading" | "quiz";
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description: string;
          order_num: number;
          video_url: string;
          materials?: Json;
          duration: string;
          type: "video" | "reading" | "quiz";
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string;
          order_num?: number;
          video_url?: string;
          materials?: Json;
          duration?: string;
          type?: "video" | "reading" | "quiz";
          created_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
          status: "active" | "completed" | "cancelled";
          completion_percentage: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          enrolled_at?: string;
          status?: "active" | "completed" | "cancelled";
          completion_percentage?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          enrolled_at?: string;
          status?: "active" | "completed" | "cancelled";
          completion_percentage?: number;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
          last_accessed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          lesson_id: string;
          completed?: boolean;
          completed_at?: string | null;
          last_accessed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          lesson_id?: string;
          completed?: boolean;
          completed_at?: string | null;
          last_accessed_at?: string;
        };
      };
    };
  };
}
