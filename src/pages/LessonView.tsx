import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Download,
  FileText,
  BookOpen,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Lesson, Course } from "@/types";

export const LessonView = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    courses,
    fetchCourses,
    fetchLessonsByCourse,
    fetchCourseProgress,
    markLessonComplete,
    markLessonIncomplete,
    updateLastAccessed,
    getLessonsByCourse,
    progress: allProgress,
    isLoading,
  } = useStore();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadLessonData = async () => {
      if (!lessonId) return;

      setLocalLoading(true);
      try {
        // Fetch courses if not loaded
        if (courses.length === 0) {
          await fetchCourses();
        }

        // Find lesson in store (might need to fetch first)
        let foundLesson = getLessonsByCourse("").find((l) => l.id === lessonId);

        // If lesson not found, we need to know which course it belongs to
        // For now, try fetching all course lessons
        if (!foundLesson && courses.length > 0) {
          for (const c of courses) {
            const lessons = await fetchLessonsByCourse(c.id);
            foundLesson = lessons.find((l) => l.id === lessonId);
            if (foundLesson) break;
          }
        }

        if (!foundLesson) {
          console.log("Lesson not found with ID:", lessonId);
          setLocalLoading(false);
          return;
        }

        setLesson(foundLesson);

        // Find the course
        const foundCourse = courses.find((c) => c.id === foundLesson!.courseId);
        if (!foundCourse) {
          console.log("Course not found for lesson");
          setLocalLoading(false);
          return;
        }

        setCourse(foundCourse);

        // Fetch all lessons for this course
        const lessons = await fetchLessonsByCourse(foundCourse.id);
        setCourseLessons(lessons.sort((a, b) => a.order - b.order));

        // Fetch progress if user is logged in
        if (currentUser) {
          await fetchCourseProgress(foundCourse.id);

          // Update last accessed
          await updateLastAccessed(foundCourse.id, lessonId);

          // Check if completed
          const lessonProgress = allProgress.find(
            (p) => p.userId === currentUser.id && p.lessonId === lessonId
          );
          setIsCompleted(lessonProgress?.completed || false);
        }
      } catch (error) {
        console.error("Error loading lesson data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadLessonData();
  }, [lessonId, currentUser]);

  // Update completion status when progress changes
  useEffect(() => {
    if (currentUser && lessonId) {
      const lessonProgress = allProgress.find(
        (p) => p.userId === currentUser.id && p.lessonId === lessonId
      );
      setIsCompleted(lessonProgress?.completed || false);
    }
  }, [allProgress, currentUser, lessonId]);

  const handleToggleComplete = async () => {
    if (!currentUser || !lesson) return;

    try {
      if (isCompleted) {
        await markLessonIncomplete(lesson.courseId, lesson.id);
      } else {
        await markLessonComplete(lesson.courseId, lesson.id);
      }
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const handleNavigate = (targetLessonId: string) => {
    navigate(`/lesson/${targetLessonId}`);
  };

  if (isLoading || localLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Lesson not found
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The lesson you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="inline-flex items-center gap-2 bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = courseLessons.findIndex((l) => l.id === lessonId);
  const previousLesson =
    currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : null;

  const completedLessons = allProgress.filter(
    (p) =>
      p.userId === currentUser?.id &&
      p.courseId === lesson.courseId &&
      p.completed
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            {currentUser && (
              <button
                onClick={handleToggleComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isCompleted
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-[#243E36FF] text-white hover:bg-[#243E36FF]/85"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {isCompleted ? "Completed" : "Mark Complete"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {lesson.videoUrl ? (
                  <div className="text-center text-white p-8">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-lg font-semibold mb-2">Video Player</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Duration: {lesson.duration} minutes
                    </p>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      In production, integrate with your video hosting service
                      (YouTube, Vimeo, Cloudflare Stream, or custom HLS player)
                    </p>
                    {lesson.videoUrl.startsWith("http") && (
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm underline"
                      >
                        Open video in new tab
                      </a>
                    )}
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {lesson.title}
                  </h1>
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
                      {lesson.type.charAt(0).toUpperCase() +
                        lesson.type.slice(1)}
                    </span>
                  </div>
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {lesson.description}
              </p>
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
                    ? "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Previous Lesson</span>
                <span className="sm:hidden">Previous</span>
              </button>

              <div className="text-center text-sm text-gray-500">
                {currentIndex + 1} / {courseLessons.length}
              </div>

              <button
                onClick={() => nextLesson && handleNavigate(nextLesson.id)}
                disabled={!nextLesson}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  nextLesson
                    ? "bg-[#243E36FF] text-white hover:bg-[#243E36FF]/85"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="hidden sm:inline">Next Lesson</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Materials & Progress */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Course Materials */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Course Materials
                </h3>

                {!lesson.materials || lesson.materials.length === 0 ? (
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
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#243E36FF] hover:bg-[#243E36FF]/5 transition-colors group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-[#243E36FF]/10 rounded-lg flex items-center justify-center group-hover:bg-[#243E36FF]/20 transition-colors">
                          {material.type === "pdf" ||
                          material.type === "document" ||
                          material.type === "slide" ? (
                            <FileText className="w-5 h-5 text-[#243E36FF]" />
                          ) : (
                            <Download className="w-5 h-5 text-[#243E36FF]" />
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
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-[#243E36FF] transition-colors" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Course Progress Summary */}
              {currentUser && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Your Progress
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Completed Lessons
                      </span>
                      <span className="font-bold text-lg text-gray-900">
                        {completedLessons} / {courseLessons.length}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#243E36FF] h-2.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            courseLessons.length > 0
                              ? (completedLessons / courseLessons.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#243E36FF]">
                        {courseLessons.length > 0
                          ? Math.round(
                              (completedLessons / courseLessons.length) * 100
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Course Completion
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/course/${lesson.courseId}`)}
                      className="w-full text-sm text-[#243E36FF] hover:text-[#243E36FF]/80 font-medium py-2 border border-[#243E36FF] rounded-lg hover:bg-[#243E36FF]/5 transition-colors"
                    >
                      View All Lessons
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
