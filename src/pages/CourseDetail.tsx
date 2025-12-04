import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PlayCircle,
  FileText,
  CheckCircle,
  Lock,
  Clock,
} from "lucide-react";
import { useStore } from "../store/useStore";
import ProgressBadge from "../components/ProgressBadge";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    courses,
    currentUser,
    getLessonsByCourse,
    progress,
    getCourseProgress,
    enrollCourse,
    isUserEnrolled,
  } = useStore();

  const course = courses.find((c) => c.id === courseId);
  const lessons = getLessonsByCourse(courseId || "");
  const enrolled = isUserEnrolled(currentUser?.id || "", courseId || "");
  const courseProgress = getCourseProgress(
    currentUser?.id || "",
    courseId || ""
  );

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Course not found
            </h2>
            <button
              onClick={() => navigate("/catalog")}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              ← Back to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    if (currentUser) {
      enrollCourse(currentUser.id, course.id);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    if (enrolled) {
      navigate(`/lesson/${lessonId}`);
    }
  };

  const getLessonStatus = (lessonId: string, lessonOrder: number) => {
    const lessonProgress = progress.find(
      (p) => p.userId === currentUser?.id && p.lessonId === lessonId
    );

    if (lessonProgress?.completed) {
      return "completed";
    }

    // Check if previous lesson is completed (for sequential access)
    if (lessonOrder > 1 && lessons.length > 0) {
      const previousLesson = lessons[lessonOrder - 2]; // -2 because order is 1-based
      const previousProgress = progress.find(
        (p) => p.userId === currentUser?.id && p.lessonId === previousLesson?.id
      );
      if (!previousProgress?.completed) {
        return "locked";
      }
    }

    return "available";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="relative h-64 bg-linear-to-br from-blue-500 to-purple-600">
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
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-500">
                    {course.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === "beginner"
                        ? "bg-green-100 text-green-800"
                        : course.level === "intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h1>
                <p className="text-gray-600 text-lg">{course.description}</p>
              </div>

              {enrolled && (
                <div className="flex items-center gap-4">
                  <ProgressBadge percentage={courseProgress} size="lg" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{course.duration} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                <span>{lessons.length} lessons</span>
              </div>
            </div>

            {!enrolled && (
              <button
                onClick={handleEnroll}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Enroll in Course
              </button>
            )}
          </div>
        </div>

        {/* Course Outline */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Course Outline
          </h2>

          {lessons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No lessons available yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => {
                const status = getLessonStatus(lesson.id, lesson.order);
                const isLocked = status === "locked" || !enrolled;
                const isCompleted = status === "completed";

                return (
                  <div
                    key={lesson.id}
                    onClick={() => !isLocked && handleLessonClick(lesson.id)}
                    className={`border border-gray-200 rounded-lg p-5 transition-all ${
                      isLocked
                        ? "bg-gray-50 cursor-not-allowed opacity-60"
                        : "hover:border-blue-300 hover:shadow-md cursor-pointer"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Lesson Number/Status Icon */}
                      <div
                        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-100"
                            : isLocked
                            ? "bg-gray-200"
                            : "bg-blue-100"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : (
                          <span className="font-semibold text-blue-600">
                            {lesson.order}
                          </span>
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3
                              className={`text-lg font-semibold mb-1 ${
                                isLocked ? "text-gray-500" : "text-gray-900"
                              }`}
                            >
                              {lesson.title}
                            </h3>
                            <p
                              className={`text-sm mb-3 ${
                                isLocked ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <PlayCircle className="w-3 h-3" />
                                <span>{lesson.duration} min</span>
                              </div>
                              {lesson.materials.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  <span>
                                    {lesson.materials.length} material
                                    {lesson.materials.length > 1 ? "s" : ""}
                                  </span>
                                </div>
                              )}
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  lesson.type === "video"
                                    ? "bg-purple-100 text-purple-700"
                                    : lesson.type === "reading"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-orange-100 text-orange-700"
                                }`}
                              >
                                {lesson.type}
                              </span>
                            </div>
                          </div>

                          {isCompleted && (
                            <div className="shrink-0">
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            </div>
                          )}
                        </div>

                        {isLocked && !enrolled && (
                          <div className="mt-3 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded">
                            🔒 Enroll in this course to access lessons
                          </div>
                        )}

                        {isLocked && enrolled && lesson.order > 1 && (
                          <div className="mt-3 text-xs text-gray-500 bg-yellow-50 px-3 py-2 rounded">
                            🔒 Complete previous lesson to unlock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
