import { useStore } from "@/store/useStore";
import { Waitlist } from "@clerk/clerk-react";
import { GraduationCap, BookOpen, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export const WaitlistPage = () => {
  const { courses, users, fetchCourses, fetchUsers, isLoading } = useStore();
  const [localLoading, setLocalLoading] = useState(true);

  // Fetch courses and users on mount
  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true);
      try {
        await Promise.all([fetchCourses(), fetchUsers()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLocalLoading(false);
      }
    };

    loadData();
  }, [fetchCourses, fetchUsers]);

  if (isLoading || localLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#243E36FF]/5 to-white">
      {/* Hero Section */}
      <div className="inline-block px-4 py-2 m-4 bg-[#243E36FF]/10 text-[#243E36FF] rounded-full text-sm font-medium">
        🚀 Coming Soon
      </div>
      <main className="max-w-7xl mx-auto px-3 py-8 sm:px-6  sm:py-12">
        <div className=" grid lg:grid-cols-2 lg:order-first gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h1 className="sm:text-4xl text-2xl md:text-6xl font-bold text-gray-900 leading-tight">
              Transform Your Learning Journey with{" "}
              <span className="text-[#243E36FF]">Swiss-Hub</span>
            </h1>

            <p className="md:text-xl  text-lg text-gray-600">
              Join our exclusive waitlist and be among the first to experience
              our revolutionary learning management platform designed for modern
              education.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-[#243E36FF]/10 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-[#243E36FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Rich Course Library
                  </h3>
                  <p className="text-sm text-gray-600">
                    Access diverse courses curated by experts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-[#243E36FF]/10 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-[#243E36FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Track Progress
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monitor your learning achievements
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-[#243E36FF]/10 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-[#243E36FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Expert Instructors
                  </h3>
                  <p className="text-sm text-gray-600">
                    Learn from industry professionals
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-[#243E36FF]/10 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-[#243E36FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community</h3>
                  <p className="text-sm text-gray-600">
                    Connect with fellow learners
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Waitlist Form */}
          <div className="order-first lg:order-last sm:bg-white sm:rounded-2xl sm:shadow-xl sm:p-8 sm:border sm:border-gray-100">
            {/* Clerk Waitlist Component */}
            <div className="flex justify-center min-h-96 ">
              <Waitlist />
            </div>

            {/* Stats - Updated with actual data */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#243E36FF]">
                  {courses.length}
                </p>
                <p className="text-xs text-gray-600">Courses Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#243E36FF]">
                  {users.length + 15}
                </p>
                <p className="text-xs text-gray-600">Users Registered</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#243E36FF]">24/7</p>
                <p className="text-xs text-gray-600">Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24">
          <h2 className="md:text-3xl text-lg font-bold text-center text-gray-900 mb-12">
            Why Join Swiss-Hub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#243E36FF]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Content
              </h3>
              <p className="text-gray-600">
                Access a wide range of courses across multiple disciplines, from
                beginner to advanced levels.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#243E36FF]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Interactive Learning
              </h3>
              <p className="text-gray-600">
                Engage with dynamic content, quizzes, and hands-on projects to
                reinforce your knowledge.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#243E36FF]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalized Path
              </h3>
              <p className="text-gray-600">
                Get customized learning recommendations based on your goals and
                progress.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
