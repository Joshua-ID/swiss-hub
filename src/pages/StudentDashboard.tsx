import { Link } from "react-router-dom";
import { BookOpen, Clock, Award, TrendingUp, Users } from "lucide-react";
import { useStore } from "../store/useStore";
import CourseCard from "../components/CourseCard";

export const StudentDashboard = () => {
  const { currentUser, enrollments, courses, getCourseProgress } = useStore();

  const userEnrollments = enrollments.filter(
    (e) => e.userId === currentUser?.id
  );

  const enrolledCourses = userEnrollments
    .map((enrollment) => {
      const course = courses.find((c) => c.id === enrollment.courseId);
      const progress = getCourseProgress(
        currentUser?.id || "",
        enrollment.courseId
      );
      return {
        ...course!,
        enrollmentId: enrollment.id,
        progress,
        status: enrollment.status,
      };
    })
    .filter((course) => course);

  const activeCourses = enrolledCourses.filter((c) => c.status === "active");
  const completedCourses = enrolledCourses.filter(
    (c) => c.status === "completed"
  );

  const stats = {
    enrolled: userEnrollments.length,
    completed: completedCourses.length,
    inProgress: activeCourses.length,
    avgProgress:
      userEnrollments.length > 0
        ? Math.round(
            userEnrollments.reduce(
              (sum, e) => sum + e.completionPercentage,
              0
            ) / userEnrollments.length
          )
        : 0,
  };

  const isOnline = window.navigator.onLine;

  return (
    <>
      {isOnline ? (
        <div className="flex max-w-[1700px] p-3 md:p-6 mx-auto  gap-7 md:gap-14 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between ">
            {currentUser && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                <Users className="w-4 h-4" />
                <span>Welcome back, {currentUser.name}</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-right">
                Student Dashboard
              </h1>
              <p className="text-gray-600 text-right">
                Track your progress and continue learning
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Enrolled Courses
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.enrolled}
                  </p>
                </div>
                <div className="bg-[#243E36FF]/50 p-3 rounded-lg">
                  <BookOpen className="w-8 h-8 text-[#243E36FF]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.completed}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Avg. Progress
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.avgProgress}%
                  </p>
                </div>
                <div className="bg-[#47126b]/50 p-3 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-[#47126b]/85" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Courses */}
          {activeCourses.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Continue Learning
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {activeCourses.map((course) => (
                  <Link key={course.id} to={`/course/${course.id}`}>
                    <CourseCard
                      course={course}
                      progress={Number(course.progress)}
                      isEnrolled={true}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Completed Courses
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <Link key={course.id} to={`/course/${course.id}`}>
                    <CourseCard
                      course={course}
                      progress={100}
                      isEnrolled={true}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {enrolledCourses.length === 0 && (
            <div className="bg-white rounded-xl w-full shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Enrolled Courses Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your learning journey by browsing our course catalog
              </p>
              <Link
                to="/catalog"
                className="inline-block bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="min-h-[70dvh] flex flex-col gap-5  text-center p-6">
          <span className="text-red-500 md:text-3xl text-lg">
            You're offline
          </span>
          <span className="text-gray-700 md:text-lg text-xs">
            Please check your network connection and try again. If the issue
            persists, contact our support team.
          </span>
        </div>
      )}
    </>
  );
};
