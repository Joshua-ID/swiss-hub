import React, { useState } from "react";
import { useStore } from "../store/useStore";
import type { Course } from "@/types";

interface CourseFormProps {
  course?: Course | null;
  onClose: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, onClose }) => {
  const { addCourse, updateCourse, courses, currentUser, addLesson } =
    useStore();

  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    thumbnail: course?.thumbnail || "",
    category: course?.category || "",
    duration: course?.duration || 0,
    instructor: course?.createdBy || currentUser?.name || "Anonymous",
    level:
      course?.level || ("beginner" as "beginner" | "intermediate" | "advanced"),
    prerequisites: course?.prerequisites || ([] as string[]),
  });

  // Lesson management state - now works for both create and edit
  const [lessons, setLessons] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      videoUrl: string;
      duration: number;
      type: "video" | "reading" | "quiz";
      order: number;
      materials: Array<{
        id: string;
        title: string;
        type: "pdf" | "document" | "slide" | "link";
        url: string;
        size?: string;
      }>;
    }>
  >(
    course ? [] : [] // We'll load existing lessons later if editing
  );

  // State for current lesson form
  const [currentLesson, setCurrentLesson] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    type: "video" as "video" | "reading" | "quiz",
  });

  // State for current material form
  const [currentMaterial, setCurrentMaterial] = useState({
    title: "",
    type: "pdf" as "pdf" | "document" | "slide" | "link",
    url: "",
    size: "",
  });

  // State for which lesson we're adding materials to
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(
    null
  );

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle course form changes
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

  // Handle lesson form changes
  const handleLessonChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentLesson((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  // Handle material form changes
  const handleMaterialChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentMaterial((prev) => ({
      ...prev,
      [name]: value,
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

  // Add a new lesson to the list
  const handleAddLesson = () => {
    if (!currentLesson.title.trim()) {
      alert("Lesson title is required");
      return;
    }

    const newLesson = {
      id: `temp-lesson-${Date.now()}`,
      ...currentLesson,
      order: lessons.length + 1,
      materials: [],
    };

    setLessons([...lessons, newLesson]);
    setCurrentLesson({
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      type: "video",
    });
  };

  // Remove a lesson from the list
  const handleRemoveLesson = (index: number) => {
    if (window.confirm("Are you sure you want to remove this lesson?")) {
      const updatedLessons = lessons.filter((_, i) => i !== index);
      // Update order numbers
      const reorderedLessons = updatedLessons.map((lesson, idx) => ({
        ...lesson,
        order: idx + 1,
      }));
      setLessons(reorderedLessons);
    }
  };

  // Add material to a lesson
  const handleAddMaterial = () => {
    if (selectedLessonIndex === null) return;
    if (!currentMaterial.title.trim() || !currentMaterial.url.trim()) {
      alert("Material title and URL are required");
      return;
    }

    const newMaterial = {
      id: `temp-material-${Date.now()}`,
      ...currentMaterial,
    };

    const updatedLessons = [...lessons];
    updatedLessons[selectedLessonIndex].materials.push(newMaterial);
    setLessons(updatedLessons);
    setCurrentMaterial({
      title: "",
      type: "pdf",
      url: "",
      size: "",
    });
  };

  // Remove material from a lesson
  const handleRemoveMaterial = (lessonIndex: number, materialIndex: number) => {
    if (window.confirm("Are you sure you want to remove this material?")) {
      const updatedLessons = [...lessons];
      updatedLessons[lessonIndex].materials.splice(materialIndex, 1);
      setLessons(updatedLessons);
    }
  };

  // Edit a lesson
  const handleEditLesson = (index: number) => {
    const lesson = lessons[index];
    setCurrentLesson({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      type: lesson.type,
    });
    handleRemoveLesson(index); // Remove old one, will be re-added
  };

  // Main form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.instructor || formData.instructor.trim() === "") {
      alert("Instructor name is required. Please enter an instructor.");
      return;
    }

    setIsSubmitting(true);

    try {
      let courseId: string;

      if (course) {
        // Update existing course
        await updateCourse(course.id, formData);
        courseId = course.id;
      } else {
        // Create new course
        const newCourse: Course = {
          id: `course-${Date.now()}`,
          ...formData,
          createdBy: currentUser?.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addCourse(newCourse);
        courseId = newCourse.id;
      }

      // Add lessons and materials
      for (const lesson of lessons) {
        try {
          const lessonData = {
            courseId,
            title: lesson.title,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            type: lesson.type,
            order: lesson.order,
            materials: lesson.materials,
          };

          await addLesson(lessonData);
        } catch (lessonError) {
          console.error("Error adding lesson:", lessonError);
          // Continue with other lessons even if one fails
        }
      }

      onClose();
    } catch (error: any) {
      console.error("Full error from Supabase:", error);
      alert(
        `Failed to save course. Error: ${
          error.message || error.details || "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const availablePrerequisites = courses.filter((c) => c.id !== course?.id);

  return (
    <div className="space-y-8">
      {/* Course Form */}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Duration and instructor */}
        <div className="grid grid-cols-2 gap-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
              placeholder="e.g., 20"
            />
          </div>
          <div>
            <label
              htmlFor="instructor"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Instructor *
            </label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
              placeholder="instructor"
            />
          </div>
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
                    className="w-4 h-4 text-[#243E36FF] border-gray-300 rounded focus:ring-[#243E36FF]/75"
                  />
                  <span className="text-sm text-gray-700">
                    {prerequisiteCourse.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Lessons Section */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Course Lessons
          </h3>

          {/* Add Lesson Form */}
          <div className="space-y-4 mb-8 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700">Add New Lesson</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentLesson.title}
                  onChange={handleLessonChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                  placeholder="e.g., Introduction to React"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Type *
                </label>
                <select
                  name="type"
                  value={currentLesson.type}
                  onChange={handleLessonChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                >
                  <option value="video">Video</option>
                  <option value="reading">Reading</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={currentLesson.description}
                onChange={handleLessonChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                placeholder="Lesson description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={currentLesson.videoUrl}
                  onChange={handleLessonChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={currentLesson.duration}
                  onChange={handleLessonChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                  placeholder="e.g., 45"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleAddLesson}
                className="px-4 py-2 bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white rounded-lg transition-colors"
              >
                Add Lesson
              </button>
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-4">
            {lessons.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No lessons added yet.
              </p>
            ) : (
              lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Lesson {lesson.order}: {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Type: {lesson.type}</span>
                        <span>Duration: {lesson.duration} min</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditLesson(lessonIndex)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(lessonIndex)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedLessonIndex(
                            selectedLessonIndex === lessonIndex
                              ? null
                              : lessonIndex
                          )
                        }
                        className="px-3 py-1 text-sm bg-green-50 text-green-600 hover:bg-green-100 rounded transition-colors"
                      >
                        {selectedLessonIndex === lessonIndex
                          ? "Close Materials"
                          : "Add Materials"}
                      </button>
                    </div>
                  </div>

                  {/* Materials Section */}
                  {selectedLessonIndex === lessonIndex && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Add Materials for this Lesson
                      </h5>
                      <div className="space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Material Title *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={currentMaterial.title}
                              onChange={handleMaterialChange}
                              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                              placeholder="e.g., Course Slides"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Type *
                            </label>
                            <select
                              name="type"
                              value={currentMaterial.type}
                              onChange={handleMaterialChange}
                              className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                            >
                              <option value="pdf">PDF</option>
                              <option value="document">Document</option>
                              <option value="slide">Slide</option>
                              <option value="link">Link</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            URL *
                          </label>
                          <input
                            type="url"
                            name="url"
                            value={currentMaterial.url}
                            onChange={handleMaterialChange}
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                            placeholder="https://example.com/material.pdf"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Size (Optional)
                          </label>
                          <input
                            type="text"
                            name="size"
                            value={currentMaterial.size}
                            onChange={handleMaterialChange}
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
                            placeholder="e.g., 2.5 MB"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleAddMaterial}
                            className="px-3 py-1 text-sm bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white rounded transition-colors"
                          >
                            Add Material
                          </button>
                        </div>
                      </div>

                      {/* Existing Materials List */}
                      {lesson.materials.length > 0 && (
                        <div className="mt-4">
                          <h6 className="text-xs font-medium text-gray-700 mb-2">
                            Existing Materials:
                          </h6>
                          <div className="space-y-2">
                            {lesson.materials.map((material, materialIndex) => (
                              <div
                                key={material.id}
                                className="flex items-center justify-between bg-white p-2 rounded border"
                              >
                                <div>
                                  <span className="text-sm text-gray-800">
                                    {material.title}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({material.type})
                                  </span>
                                  {material.size && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      • {material.size}
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveMaterial(
                                      lessonIndex,
                                      materialIndex
                                    )
                                  }
                                  className="text-xs text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Course Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : course
              ? "Update Course & Lessons"
              : "Create Course & Lessons"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
