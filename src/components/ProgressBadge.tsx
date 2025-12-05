import React from "react";
import { CheckCircle, Clock, Lock } from "lucide-react";

interface ProgressBadgeProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  status?: "locked" | "in-progress" | "completed";
}

const ProgressBadge: React.FC<ProgressBadgeProps> = ({
  percentage,
  size = "md",
  showLabel = true,
  status,
}) => {
  const sizeClasses = {
    sm: "h-16 w-16 text-xs",
    md: "h-20 w-20 text-sm",
    lg: "h-24 w-24 text-base",
  };

  const determineStatus = () => {
    if (status) return status;
    if (percentage === 0) return "in-progress";
    if (percentage === 100) return "completed";
    return "in-progress";
  };

  const currentStatus = determineStatus();

  const getStatusColor = () => {
    switch (currentStatus) {
      case "completed":
        return "text-green-600";
      case "locked":
        return "text-gray-400";
      case "in-progress":
      default:
        return "text-[#243E36FF]";
    }
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case "completed":
        return <CheckCircle className="w-6 h-6" />;
      case "locked":
        return <Lock className="w-6 h-6" />;
      case "in-progress":
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
            className={`${getStatusColor()} transition-all duration-500 ease-out`}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {currentStatus === "in-progress" ? (
            <span className={`font-bold ${getStatusColor()}`}>
              {percentage}%
            </span>
          ) : (
            <span className={getStatusColor()}>{getStatusIcon()}</span>
          )}
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {currentStatus === "completed" && "Completed"}
          {currentStatus === "locked" && "Locked"}
          {currentStatus === "in-progress" && `${percentage}% Complete`}
        </span>
      )}
    </div>
  );
};

export default ProgressBadge;
