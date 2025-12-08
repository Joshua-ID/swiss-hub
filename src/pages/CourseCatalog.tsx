import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Course } from "@/types";

export const CourseCatalog = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    courses,
    enrollCourse,
    fetchCourses,
    isLoading,
    enrollments,
    isUserEnrolled,
    ensureEnrollmentsLoaded,
    enrollmentsLoaded,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [localLoading, setLocalLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const categories = [
    "all",
    ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean))),
  ];

  // Fetch courses and enrollments on mount
  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true);
      try {
        // Fetch courses
        await fetchCourses();

        if (currentUser) {
          await ensureEnrollmentsLoaded();
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadData();
  }, [fetchCourses, ensureEnrollmentsLoaded, currentUser]);

  useEffect(() => {
    let result = [...courses];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term) ||
          (course.category && course.category.toLowerCase().includes(term)) ||
          (course.createdBy && course.createdBy.toLowerCase().includes(term))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((course) => course.category === selectedCategory);
    }

    // Apply level filter
    if (selectedLevel !== "all") {
      result = result.filter((course) => course.level === selectedLevel);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "duration":
        result.sort((a, b) => a.duration - b.duration);
        break;
      case "featured":
      default:
        result.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
    }

    setFilteredCourses(result);
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) {
      // Redirect to sign in
      navigate(`/sign-in?redirect=/catalog`);
      return;
    }

    try {
      await enrollCourse(courseId);
      console.log("Successfully enrolled in course!");
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  // Check if course is locked (prerequisites not met)
  const isCourseLocked = (course: Course): boolean => {
    if (
      !currentUser ||
      !course.prerequisites ||
      course.prerequisites.length === 0
    )
      return false;

    // Check if all prerequisites are met
    const userEnrollments = enrollments.filter(
      (e) => e.userId === currentUser.id
    );
    const completedCourseIds = userEnrollments
      .filter((e) => e.status === "completed")
      .map((e) => e.courseId);

    // Check if all prerequisites are completed
    return !course.prerequisites.every((prereqId) =>
      completedCourseIds.includes(prereqId)
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSortBy("featured");
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  // Show loading while courses OR enrollments are loading
  if (isLoading || localLoading || (currentUser && !enrollmentsLoaded)) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Course Catalog</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Explore our collection of expert-led courses and advance your
              skills
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#243E36FF]/40 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#243E36FF]/70" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {courses.length}
                </div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#47126b]/40 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#47126b]/60" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {courses.length > 0
                    ? Math.round(
                        courses.reduce((sum, c) => sum + c.duration, 0) /
                          courses.length
                      )
                    : 0}
                  h
                </div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {
                    enrollments.filter((e) => e.userId === currentUser?.id)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600">My Enrollments</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {enrollments.length}
                </div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 sticky top-4 z-10 border">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses by title, description, or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF] focus:border-transparent transition-all text-base"
              />
            </div>
          </div>

          {/* Filter Options */}
          <div className="flex flex-col sm:flex-row gap-4 flex-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF] focus:border-transparent bg-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF] focus:border-transparent bg-white"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#243E36FF] focus:border-transparent bg-white"
              >
                <option value="featured">Newest</option>
                <option value="duration">Shortest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm ||
          selectedCategory !== "all" ||
          selectedLevel !== "all") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-[#243E36FF]/40 text-[#243E36FF]/80 text-sm px-3 py-1 rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-[#243E36FF]/70 hover:text-[#243E36FF]/80"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="ml-auto text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredCourses.length}
          </span>{" "}
          course{filteredCourses.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* All Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enrolled = isUserEnrolled(course.id);
            const locked = isCourseLocked(course);
            const enrollment = enrollments.find(
              (e) => e.courseId === course.id && e.userId === currentUser?.id
            );
            const progress = enrollment?.completionPercentage || 0;

            return (
              <CourseCard
                key={course.id}
                course={course}
                progress={progress}
                isLocked={locked}
                isEnrolled={enrolled}
                onEnroll={() => handleEnroll(course.id)}
                onClick={() => handleCourseClick(course.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Courses Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ||
              selectedCategory !== "all" ||
              selectedLevel !== "all"
                ? "Try adjusting your search or filters"
                : "No courses are available yet. Check back soon!"}
            </p>
            {(searchTerm ||
              selectedCategory !== "all" ||
              selectedLevel !== "all") && (
              <button
                onClick={handleClearFilters}
                className="bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
