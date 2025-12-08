import { Link } from "react-router-dom";
import { BookOpen, Users, TrendingUp, Award } from "lucide-react";
import { useStore } from "../store/useStore";

export const AdminDashboard = () => {
  const { courses, users, enrollments } = useStore();

  const stats = {
    totalCourses: courses.length,
    totalStudents: users.filter((u) => u.role === "student").length,
    totalEnrollments: enrollments.length,
    completedCourses: enrollments.filter((e) => e.status === "completed")
      .length,
  };

  const recentCourses = courses.slice(-5).reverse();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your e-learning platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalCourses}
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
                Total Students
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalStudents}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Enrollments
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalEnrollments}
              </p>
            </div>
            <div className="bg-[#47126b]/50 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8 text-[#47126b]/85" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.completedCourses}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
          <Link
            to="/admin/courses"
            className="text-[#243E36FF] hover:text-[#243E36FF]/85 font-medium text-sm"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Course
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Level
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Enrollments
                </th>
              </tr>
            </thead>
            <tbody>
              {recentCourses.map((course) => {
                const courseEnrollments = enrollments.filter(
                  (e) => e.courseId === course.id
                ).length;
                return (
                  <tr
                    key={course.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {course.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {course.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {course.category}
                    </td>
                    <td className="py-4 px-4">
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
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {course.duration}h
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {courseEnrollments}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
