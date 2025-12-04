import React from "react";
import { Clock, BookOpen, Lock, TrendingUp } from "lucide-react";
import ProgressBadge from "./ProgressBadge";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
  progress?: number;
  isLocked?: boolean;
  isEnrolled?: boolean;
  onEnroll?: () => void;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress = 0,
  isLocked = false,
  isEnrolled = false,
  onEnroll,
  onClick,
}) => {
  const levelColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isLocked ? "opacity-60" : "cursor-pointer"
      }`}
      onClick={() => !isLocked && onClick && onClick()}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-linear-to-br from-blue-500 to-purple-600 overflow-hidden">
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

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Prerequisites Required</p>
            </div>
          </div>
        )}

        {/* Progress badge for enrolled courses */}
        {isEnrolled && !isLocked && (
          <div className="absolute top-4 right-4">
            <ProgressBadge percentage={progress} size="sm" showLabel={false} />
          </div>
        )}

        {/* Level badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              levelColors[course.level]
            }`}
          >
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{course.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>{course.duration}h</span>
          </div>

          {course.prerequisites.length > 0 && (
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>
                {course.prerequisites.length} prerequisite
                {course.prerequisites.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Action button */}
        {!isLocked && !isEnrolled && onEnroll && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Enroll Now
          </button>
        )}

        {isEnrolled && (
          <div className="w-full bg-green-50 border-2 border-green-500 text-green-700 font-semibold py-2 px-4 rounded-lg text-center">
            {progress === 100 ? "✓ Completed" : "Continue Learning"}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
