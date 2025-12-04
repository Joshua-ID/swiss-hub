import React, { useState } from "react";
import { useStore } from "../store/useStore";
import type { Course } from "@/types";

interface CourseFormProps {
  course?: Course | null;
  onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onClose }) => {
  const { addCourse, updateCourse, courses, currentUser } = useStore();

  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    thumbnail: course?.thumbnail || "",
    category: course?.category || "",
    duration: course?.duration || 0,
    level:
      course?.level || ("beginner" as "beginner" | "intermediate" | "advanced"),
    prerequisites: course?.prerequisites || ([] as string[]),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handlePrerequisiteToggle = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(courseId)
        ? prev.prerequisites.filter((id) => id !== courseId)
        : [...prev.prerequisites, courseId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (course) {
      // Update existing course
      updateCourse(course.id, formData);
    } else {
      // Create new course
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        ...formData,
        createdBy: currentUser?.id || "unknown",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addCourse(newCourse);
    }

    onClose();
  };

  const availablePrerequisites = courses.filter((c) => c.id !== course?.id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Course Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Introduction to Web Development"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe what students will learn in this course..."
        />
      </div>

      {/* Thumbnail URL */}
      <div>
        <label
          htmlFor="thumbnail"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Thumbnail URL
        </label>
        <input
          type="url"
          id="thumbnail"
          name="thumbnail"
          value={formData.thumbnail}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Category and Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Web Development"
          />
        </div>

        <div>
          <label
            htmlFor="level"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Level *
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Duration (hours) *
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., 20"
        />
      </div>

      {/* Prerequisites */}
      {availablePrerequisites.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prerequisites (Optional)
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
            {availablePrerequisites.map((prerequisiteCourse) => (
              <label
                key={prerequisiteCourse.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.prerequisites.includes(
                    prerequisiteCourse.id
                  )}
                  onChange={() =>
                    handlePrerequisiteToggle(prerequisiteCourse.id)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {prerequisiteCourse.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {course ? "Update Course" : "Create Course"}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
