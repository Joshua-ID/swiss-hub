import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useStore } from "../store/useStore";
import Modal from "../components/Modal";
import type { Course } from "@/types";
import CourseForm from "./CourseForm";

export const AdminCourses = () => {
  const { courses, deleteCourse, getLessonsByCourse } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      deleteCourse(courseId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  return (
    <>
      <div className="max-w-[1700px] mx-auto p-3 md:p-4">
        {/* Header */}
        <div className="flex  justify-between items-start sm:items-center gap-5 mb-8">
          <div>
            <h1 className="sm:text-4xl text-2xl  font-bold ">
              Course Management
            </h1>
            <p className="text-gray-600 sm:text-lg text-xs">
              Create and manage course content
            </p>
          </div>
          <button
            onClick={handleAddCourse}
            className="flex items-center gap-2 bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white font-semibold px-3 py-3 md:rounded-lg rounded-full transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden md:flex">Add New Course</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 max-w-5xl w-full mx-auto ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF]/75 focus:border-transparent"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 gap-x-2 gap-y-5">
          {filteredCourses.map((course) => {
            const lessonCount = getLessonsByCourse(course.id).length;
            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-linear-to-br from-[#243E36FF]/75 to-[#47126b]/85">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="bg-white hover:bg-gray-100 p-2 rounded-lg shadow-md transition-colors"
                      title="Edit Course"
                    >
                      <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="bg-white hover:bg-red-50 p-2 rounded-lg shadow-md transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      {course.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.level === "beginner"
                          ? "bg-green-100 text-green-800"
                          : course.level === "intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{course.duration}h duration</span>
                    <span>
                      {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
                    </span>
                    <span>
                      {course.prerequisites.length} prerequisite
                      {course.prerequisites.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-gray-500 text-center py-12 text-lg">
            No courses found
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCourse ? "Edit Course" : "Create New Course"}
        size="lg"
      >
        <CourseForm course={editingCourse} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};
