import { Link } from "react-router-dom";
import { Users, Award, TrendingUp, NotebookTabs } from "lucide-react";

export const Home = () => {
  return (
    <div className="flex flex-col m-3 md:p-6  gap-7 md:gap-14">
      {/* Hero Section */}
      <div className=" mx-auto text-center flex flex-col items-center justify-center gap-6 min-h-[45vh]">
        <h1 className="text-5xl md:text-6xl font-bold ">
          Join <span className="text-[#47126b] ">Swiss-Hub</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Your comprehensive e-learning platform for online courses and
          professional development. Learn at your own pace, track your progress,
          and achieve your goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/catalog"
            className="inline-block bg-[#243E36FF] hover:bg-[#243E36FF]/85 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            Explore Courses
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className=" mx-auto flex flex-col gap-8">
        <h2 className="text-4xl font-bold text-center ">
          Why Choose Swiss-Hub?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-[#243E36FF]/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <NotebookTabs className="w-8 h-8 text-[#243E36FF]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Quality Content
            </h3>
            <p className="text-gray-600">
              Access high-quality courses from expert instructors across various
              domains
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Learn Together
            </h3>
            <p className="text-gray-600">
              Join a community of learners and grow your skills with peer
              support
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-[#47126b]/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-[#47126b]/85" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed progress tracking and
              analytics
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Earn Certificates
            </h3>
            <p className="text-gray-600">
              Complete courses and earn certificates to showcase your
              achievements
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div>
        <div className="mx-auto max-w-6xl rounded-2xl w-full bg-linear-to-r from-[#243E36FF] to-[#47126b]/85 shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners and take the next step in your career
          </p>
          <button
            // to="/catalog"
            className="inline-block bg-white text-[#243E36FF] text-lg hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            Learn More..
          </button>
        </div>
      </div>
    </div>
  );
};
