/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Backend API Service
 * Handles all communication with the backend API
 */

const API_URL = "https://backend.youware.com";

// Helper function to make API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// User API
export const userAPI = {
  // Get current user
  async getMe() {
    const data = await apiCall("/api/user/me");
    return data.user;
  },

  // Update user role
  async updateRole(role: "admin" | "student") {
    const data = await apiCall("/api/user/role", {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
    return data.user;
  },
};

// Course API
export const courseAPI = {
  // Get all courses
  async getAll() {
    const data = await apiCall("/api/courses");
    return data.courses;
  },

  // Get single course
  async getById(id: number) {
    const data = await apiCall(`/api/courses/${id}`);
    return data.course;
  },

  // Create course
  async create(course: any) {
    const data = await apiCall("/api/courses", {
      method: "POST",
      body: JSON.stringify(course),
    });
    return data.course;
  },

  // Update course
  async update(id: number, course: any) {
    const data = await apiCall(`/api/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(course),
    });
    return data.course;
  },

  // Delete course
  async delete(id: number) {
    const data = await apiCall(`/api/courses/${id}`, {
      method: "DELETE",
    });
    return data.success;
  },
};

// Lesson API
export const lessonAPI = {
  // Get lessons for a course
  async getByCourse(courseId: number) {
    const data = await apiCall(`/api/courses/${courseId}/lessons`);
    return data.lessons;
  },
};

// Enrollment API
export const enrollmentAPI = {
  // Get user enrollments
  async getAll() {
    const data = await apiCall("/api/enrollments");
    return data.enrollments;
  },

  // Enroll in course
  async enroll(courseId: number) {
    const data = await apiCall("/api/enrollments", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
    return data.enrollment;
  },
};

// Progress API
export const progressAPI = {
  // Get progress for a course
  async getByCourse(courseId: number) {
    const data = await apiCall(`/api/progress/course/${courseId}`);
    return data.progress;
  },

  // Mark lesson complete/incomplete
  async updateLesson(courseId: number, lessonId: number, completed: boolean) {
    const data = await apiCall("/api/progress", {
      method: "POST",
      body: JSON.stringify({ courseId, lessonId, completed }),
    });
    return data.progress;
  },
};

// Stats API
export const statsAPI = {
  // Get dashboard stats (admin only)
  async getDashboard() {
    const data = await apiCall("/api/stats");
    return data.stats;
  },
};
