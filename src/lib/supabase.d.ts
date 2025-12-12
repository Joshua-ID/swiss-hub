import type { Database } from "@/types/database";
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        courses: {
            Row: {
                category: string;
                created_at: string | null;
                description: string;
                duration: string;
                id: string;
                instructor: string;
                level: string;
                prerequisites: string[] | null;
                thumbnail: string;
                title: string;
                updated_at: string | null;
            };
            Insert: {
                category: string;
                created_at?: string | null;
                description: string;
                duration: string;
                id?: string;
                instructor: string;
                level: string;
                prerequisites?: string[] | null;
                thumbnail: string;
                title: string;
                updated_at?: string | null;
            };
            Update: {
                category?: string;
                created_at?: string | null;
                description?: string;
                duration?: string;
                id?: string;
                instructor?: string;
                level?: string;
                prerequisites?: string[] | null;
                thumbnail?: string;
                title?: string;
                updated_at?: string | null;
            };
            Relationships: [];
        };
        enrollments: {
            Row: {
                completion_percentage: number | null;
                course_id: string;
                enrolled_at: string | null;
                id: string;
                status: string;
                user_id: string;
            };
            Insert: {
                completion_percentage?: number | null;
                course_id: string;
                enrolled_at?: string | null;
                id?: string;
                status?: string;
                user_id: string;
            };
            Update: {
                completion_percentage?: number | null;
                course_id?: string;
                enrolled_at?: string | null;
                id?: string;
                status?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "enrollments_course_id_fkey";
                columns: ["course_id"];
                isOneToOne: false;
                referencedRelation: "courses";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "enrollments_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        lessons: {
            Row: {
                course_id: string;
                created_at: string | null;
                description: string;
                duration: string;
                id: string;
                materials: import("@/types/database").Json | null;
                order_num: number;
                title: string;
                type: string;
                video_url: string;
            };
            Insert: {
                course_id: string;
                created_at?: string | null;
                description: string;
                duration: string;
                id?: string;
                materials?: import("@/types/database").Json | null;
                order_num: number;
                title: string;
                type: string;
                video_url: string;
            };
            Update: {
                course_id?: string;
                created_at?: string | null;
                description?: string;
                duration?: string;
                id?: string;
                materials?: import("@/types/database").Json | null;
                order_num?: number;
                title?: string;
                type?: string;
                video_url?: string;
            };
            Relationships: [{
                foreignKeyName: "lessons_course_id_fkey";
                columns: ["course_id"];
                isOneToOne: false;
                referencedRelation: "courses";
                referencedColumns: ["id"];
            }];
        };
        progress: {
            Row: {
                completed: boolean | null;
                completed_at: string | null;
                course_id: string;
                id: string;
                last_accessed_at: string | null;
                lesson_id: string;
                user_id: string;
            };
            Insert: {
                completed?: boolean | null;
                completed_at?: string | null;
                course_id: string;
                id?: string;
                last_accessed_at?: string | null;
                lesson_id: string;
                user_id: string;
            };
            Update: {
                completed?: boolean | null;
                completed_at?: string | null;
                course_id?: string;
                id?: string;
                last_accessed_at?: string | null;
                lesson_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "progress_course_id_fkey";
                columns: ["course_id"];
                isOneToOne: false;
                referencedRelation: "courses";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "progress_lesson_id_fkey";
                columns: ["lesson_id"];
                isOneToOne: false;
                referencedRelation: "lessons";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "progress_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        users: {
            Row: {
                clerk_id: string;
                created_at: string | null;
                email: string;
                id: string;
                name: string;
                role: string;
            };
            Insert: {
                clerk_id: string;
                created_at?: string | null;
                email: string;
                id?: string;
                name: string;
                role?: string;
            };
            Update: {
                clerk_id?: string;
                created_at?: string | null;
                email?: string;
                id?: string;
                name?: string;
                role?: string;
            };
            Relationships: [];
        };
    };
    Views: { [_ in never]: never; };
    Functions: { [_ in never]: never; };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}, {
    PostgrestVersion: "13.0.5";
}>;
