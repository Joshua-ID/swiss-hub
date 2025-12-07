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
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Course } from "@/types";

// Remove the import: import { isCourseLockedForUser } from "../api/mockData";

export const CourseCatalog = () => {
  const {
    currentUser,
    courses,
    enrollCourse,
    isUserEnrolled,
    fetchCourses,
    isLoading,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [localLoading, setLocalLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Get unique categories from courses
  const categories = [
    "all",
    ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean))),
  ];

  // Fetch courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        await fetchCourses();
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadCourses();
  }, [fetchCourses]);

  // Filter and sort courses
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
          (course.instructor && course.instructor.toLowerCase().includes(term))
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
      case "popular":
        result.sort(
          (a, b) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0)
        );
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "duration":
        result.sort((a, b) => a.duration - b.duration);
        break;
      case "featured":
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
      default:
        // Default: featured first, then by creation date
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
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
      window.location.href = `/sign-in?redirect=/catalog`;
      return;
    }

    try {
      await enrollCourse(courseId);
      // Show success message (you could add a toast notification here)
      console.log("Successfully enrolled in course!");
    } catch (error) {
      console.error("Error enrolling in course:", error);
      // Show error message
    }
  };

  // Check if course is locked (prerequisites not met)
  const isCourseLocked = (course: Course): boolean => {
    if (!currentUser || course?.prerequisites.length === 0) return false;

    // Get user's completed courses
    const userEnrollments = courses.filter(
      (c) => c.prerequisites.includes(course.id) // This needs to be adjusted based on your actual data structure
    );

    // Check if all prerequisites are completed
    // Note: You'll need to implement this logic based on your actual progress data
    // For now, returning false assuming all prerequisites are met
    return false;
  };

  // Get course progress
  const getCourseProgress = async (courseId: string): Promise<number> => {
    if (!currentUser) return 0;

    try {
      // You might want to add a getCourseProgress function to your store
      // For now, returning 0 as a placeholder
      return 0;
    } catch (error) {
      console.error("Error getting course progress:", error);
      return 0;
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLevel("all");
    setSortBy("featured");
  };

  if (isLoading || localLoading) {
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

          {currentUser && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <Users className="w-4 h-4" />
              <span>Welcome back, {currentUser.name}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
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
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {courses.filter((c) => c.featured).length}
                </div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(
                    courses.reduce((sum, c) => sum + c.duration, 0) /
                      courses.length
                  )}
                  h
                </div>
                <div className="text-sm text-gray-600">Avg Duration</div>
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
                  {courses
                    .reduce((sum, c) => sum + (c.totalEnrollments || 0), 0)
                    .toLocaleString()}
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
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="duration">Shortest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters & Clear Button */}
        {(searchTerm ||
          selectedCategory !== "all" ||
          selectedLevel !== "all" ||
          sortBy !== "featured") && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedLevel !== "all" && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                Level: {selectedLevel}
                <button
                  onClick={() => setSelectedLevel("all")}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== "featured" && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                Sort: {sortBy}
                <button
                  onClick={() => setSortBy("featured")}
                  className="text-purple-600 hover:text-purple-800"
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredCourses.length}
            </span>{" "}
            course{filteredCourses.length !== 1 ? "s" : ""}
            {searchTerm && (
              <span className="ml-2">
                for "<span className="font-medium">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {courses.length > 0 && (
            <span>
              {filteredCourses.length === courses.length
                ? "Showing all courses"
                : `Filtered from ${courses.length} total courses`}
            </span>
          )}
        </div>
      </div>

      {/* Featured Courses Section */}
      {filteredCourses.filter((c) => c.featured).length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses
              .filter((course) => course.featured)
              .map((course) => {
                const enrolled = currentUser
                  ? isUserEnrolled(course.id)
                  : false;
                const locked = isCourseLocked(course);

                return (
                  <div key={course.id}>
                    <CourseCard
                      course={course}
                      progress={0} // You'll need to fetch this separately
                      isLocked={locked}
                      isEnrolled={enrolled}
                      onEnroll={() => handleEnroll(course.id)}
                      onClick={() => {
                        if (!locked) {
                          window.location.href = `/course/${course.id}`;
                        }
                      }}
                      featured={true}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* All Courses Grid */}
      {filteredCourses.filter((c) => !c.featured).length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses
              .filter((course) => !course.featured)
              .map((course) => {
                const enrolled = currentUser
                  ? isUserEnrolled(course.id)
                  : false;
                const locked = isCourseLocked(course);

                return (
                  <div key={course.id}>
                    <CourseCard
                      course={course}
                      progress={0} // You'll need to fetch this separately
                      isLocked={locked}
                      isEnrolled={enrolled}
                      onEnroll={() => handleEnroll(course.id)}
                      onClick={() => {
                        if (!locked) {
                          window.location.href = `/course/${course.id}`;
                        }
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCourses.length === 0 && !isLoading && !localLoading && (
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
                ? "Try adjusting your search or filters to find what you're looking for"
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

      {/* Loading State */}
      {(isLoading || localLoading) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
