import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PlayCircle,
  FileText,
  CheckCircle,
  Lock,
  Clock,
  Users,
  BookOpen,
  Calendar,
  Star,
  BarChart3,
} from "lucide-react";
import { useStore } from "../store/useStore";
import ProgressBadge from "../components/ProgressBadge";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Course, Lesson } from "@/types";

export const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    courses,
    fetchCourses,
    fetchLessonsByCourse,
    fetchCourseProgress,
    enrollCourse,
    getCourseProgress,
    isLoading,
    getLessonsByCourse,
    enrollments,
    progress: allProgress,
  } = useStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseProgress, setCourseProgress] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;

      setLocalLoading(true);
      try {
        // Fetch courses if not loaded
        if (courses.length === 0) {
          await fetchCourses();
        }

        // Find course in store after fetching
        const foundCourse = courses.find((c) => c.id === courseId);

        if (!foundCourse) {
          console.log("Course not found with ID:", courseId);
          setLocalLoading(false);
          return;
        }

        setCourse(foundCourse);

        // Check enrollment
        const isEnrolled = enrollments.some(
          (e) => e.courseId === courseId && e.userId === currentUser?.id
        );
        setEnrolled(isEnrolled);

        // Fetch lessons for this course
        const lessonsData = await fetchLessonsByCourse(courseId);
        setLessons(lessonsData);

        // Get progress if enrolled
        if (isEnrolled && currentUser) {
          await fetchCourseProgress(courseId);
          const progress = await getCourseProgress(courseId);
          setCourseProgress(progress);
        }
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadCourseData();
  }, [courseId, courses.length, currentUser, enrollments]);

  const handleEnroll = async () => {
    if (!currentUser || !courseId) {
      navigate(`/sign-in?redirect=/course/${courseId}`);
      return;
    }

    try {
      await enrollCourse(courseId);
      setEnrolled(true);

      // Refresh progress
      const progress = await getCourseProgress(courseId);
      setCourseProgress(progress);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    if (enrolled) {
      navigate(`/lesson/${lessonId}`);
    } else {
      if (
        window.confirm("You need to enroll in this course first. Enroll now?")
      ) {
        handleEnroll();
      }
    }
  };

  const getLessonStatus = (lessonId: string, lessonOrder: number) => {
    if (!currentUser || !enrolled) return "locked";

    const lessonProgress = allProgress.find(
      (p) => p.userId === currentUser.id && p.lessonId === lessonId
    );

    if (lessonProgress?.completed) {
      return "completed";
    }

    // Check if previous lesson is completed (for sequential access)
    if (lessonOrder > 1 && lessons.length > 0) {
      const previousLesson = lessons[lessonOrder - 2];
      const previousProgress = allProgress.find(
        (p) => p.userId === currentUser.id && p.lessonId === previousLesson?.id
      );
      if (!previousProgress?.completed) {
        return "locked";
      }
    }

    return "available";
  };

  if (isLoading || localLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Course not found
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            The course you're looking for doesn't exist or has been removed.
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => navigate("/catalog")}
          className="hover:text-[#243E36FF] transition-colors"
        >
          Catalog
        </button>
        <span>›</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {course.title}
        </span>
      </nav>

      {/* Course Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-72 bg-gradient-to-br from-[#243E36FF]/80 to-[#47126b]/80">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover mix-blend-overlay"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-24 h-24 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === "beginner"
                        ? "bg-green-500/20 text-green-100"
                        : course.level === "intermediate"
                        ? "bg-yellow-500/20 text-yellow-100"
                        : "bg-red-500/20 text-red-100"
                    }`}
                  >
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </span>
                </div>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-white/90 mb-6">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>By {course.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    <span>{lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Updated {formatDate(course.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[280px]">
                {enrolled ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-sm text-white/80 mb-2">
                        Your Progress
                      </div>
                      <ProgressBadge
                        percentage={courseProgress}
                        size="xl"
                        showPercentage
                      />
                    </div>
                    <button
                      onClick={() =>
                        lessons.length > 0 && handleLessonClick(lessons[0].id)
                      }
                      className="w-full bg-white text-[#243E36FF] hover:bg-gray-100 font-semibold py-3 rounded-lg transition-colors"
                    >
                      {courseProgress > 0
                        ? "Continue Learning"
                        : "Start Learning"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="w-full bg-white text-[#243E36FF] hover:bg-gray-100 font-semibold py-3 rounded-lg transition-colors"
                  >
                    Enroll Now
                  </button>
                )}

                <div className="mt-4 text-xs text-white/60 text-center">
                  Free • Lifetime access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lessons Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Course Content
              </h2>
              <div className="text-sm text-gray-500">
                {lessons.length} lessons • {course.duration} total hours
              </div>
            </div>

            {lessons.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">No lessons available yet</p>
                <p className="text-sm text-gray-400">
                  Check back later or contact the instructor
                </p>
              </div>
            ) : (
              <div className="space-y-4">
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
                          ? "bg-gray-50 cursor-not-allowed opacity-75"
                          : "hover:border-[#243E36FF]/50 hover:shadow-md cursor-pointer"
                      } ${isCompleted ? "bg-green-50 border-green-200" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-green-100"
                              : isLocked
                              ? "bg-gray-200"
                              : "bg-[#243E36FF]/10"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : isLocked ? (
                            <Lock className="w-6 h-6 text-gray-400" />
                          ) : (
                            <span className="font-bold text-[#243E36FF] text-lg">
                              {lesson.order}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3
                                className={`font-semibold mb-2 ${
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
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration} min</span>
                                </div>
                                {lesson.materials?.length > 0 && (
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
                                      ? "bg-purple-100 text-purple-600"
                                      : lesson.type === "reading"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-orange-100 text-orange-600"
                                  }`}
                                >
                                  {lesson.type}
                                </span>
                              </div>
                            </div>

                            {isCompleted && (
                              <div className="shrink-0">
                                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                                  <CheckCircle className="w-4 h-4" />
                                  Completed
                                </span>
                              </div>
                            )}
                          </div>

                          {isLocked && !enrolled && (
                            <div className="mt-3 text-sm text-gray-600 bg-gray-100 px-4 py-2.5 rounded-lg">
                              Enroll in this course to access all lessons
                            </div>
                          )}

                          {isLocked && enrolled && lesson.order > 1 && (
                            <div className="mt-3 text-sm text-gray-600 bg-yellow-50 px-4 py-2.5 rounded-lg">
                              Complete the previous lesson first
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Instructor Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Instructor</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#243E36FF]/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-[#243E36FF]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {course.createdBy}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Expert instructor with industry experience
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Requirements
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">Basic computer skills</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">Internet connection</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600">
                  {course.level === "beginner"
                    ? "No prior experience needed"
                    : course.level === "intermediate"
                    ? "Some basic knowledge recommended"
                    : "Advanced skills required"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
