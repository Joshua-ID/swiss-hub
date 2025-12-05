import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Download,
  FileText,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { useEffect } from "react";

export const LessonView = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const {
    lessons,
    currentUser,
    progress,
    markLessonComplete,
    markLessonIncomplete,
    updateLastAccessed,
    courses,
  } = useStore();

  const lesson = lessons.find((l) => l.id === lessonId);
  const course = lesson ? courses.find((c) => c.id === lesson.courseId) : null;
  const courseLessons = lesson
    ? lessons
        .filter((l) => l.courseId === lesson.courseId)
        .sort((a, b) => a.order - b.order)
    : [];

  const currentLessonProgress = progress.find(
    (p) => p.userId === currentUser?.id && p.lessonId === lessonId
  );
  const isCompleted = currentLessonProgress?.completed || false;

  const currentIndex = courseLessons.findIndex((l) => l.id === lessonId);
  const previousLesson =
    currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : null;

  useEffect(() => {
    if (currentUser && lessonId && lesson) {
      updateLastAccessed(currentUser.id, lesson.courseId, lessonId);
    }
  }, [currentUser, lessonId, lesson]);

  if (!lesson || !course) {
    return (
      <div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Lesson not found</h2>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const handleToggleComplete = () => {
    if (currentUser) {
      if (isCompleted) {
        markLessonIncomplete(currentUser.id, lesson.courseId, lesson.id);
      } else {
        markLessonComplete(currentUser.id, lesson.courseId, lesson.id);
      }
    }
  };

  const handleNavigate = (targetLessonId: string) => {
    navigate(`/lesson/${targetLessonId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/course/${lesson.courseId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Course</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Lesson {lesson.order} of {courseLessons.length}
            </span>
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isCompleted
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {isCompleted ? "Completed" : "Mark Complete"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video and Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Context */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-blue-900 mb-1">
                {course.title}
              </h2>
              <p className="text-xs text-blue-700">{course.category}</p>
            </div>

            {/* Video Player */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-video bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {lesson.videoUrl ? (
                  <div className="text-center text-white p-8">
                    <p className="text-lg mb-4">Video Player</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Video URL: {lesson.videoUrl}
                    </p>
                    <p className="text-xs text-gray-500">
                      In production, integrate with video hosting service
                      (YouTube, Vimeo, or custom HLS player)
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <FileText className="w-16 h-16 mx-auto mb-4" />
                    <p>No video available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {lesson.title}
              </h1>
              <p className="text-gray-600 mb-4">{lesson.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{lesson.duration} minutes</span>
                <span>•</span>
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

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() =>
                  previousLesson && handleNavigate(previousLesson.id)
                }
                disabled={!previousLesson}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  previousLesson
                    ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Lesson
              </button>

              <button
                onClick={() => nextLesson && handleNavigate(nextLesson.id)}
                disabled={!nextLesson}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  nextLesson
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next Lesson
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Materials */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Course Materials
              </h3>

              {lesson.materials.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No materials available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lesson.materials.map((material) => (
                    <a
                      key={material.id}
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        {material.type === "pdf" ||
                        material.type === "document" ||
                        material.type === "slide" ? (
                          <FileText className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Download className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {material.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {material.type.toUpperCase()}
                          {material.size && ` • ${material.size}`}
                        </p>
                      </div>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </a>
                  ))}
                </div>
              )}

              {/* Course Progress Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Your Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lessons Completed</span>
                    <span className="font-medium text-gray-900">
                      {
                        progress.filter(
                          (p) =>
                            p.userId === currentUser?.id &&
                            p.courseId === lesson.courseId &&
                            p.completed
                        ).length
                      }{" "}
                      / {courseLessons.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
