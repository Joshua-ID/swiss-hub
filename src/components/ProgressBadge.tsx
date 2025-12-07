import React from "react";
import { CheckCircle, Clock, Lock } from "lucide-react";

interface ProgressBadgeProps {
  percentage: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  showPercentage?: boolean;
  status?: "locked" | "in-progress" | "completed";
  className?: string;
}

const ProgressBadge: React.FC<ProgressBadgeProps> = ({
  percentage,
  size = "md",
  showLabel = true,
  showPercentage = false,
  status,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-12 w-12 text-xs",
    md: "h-16 w-16 text-sm",
    lg: "h-20 w-20 text-base",
    xl: "h-28 w-28 text-xl",
  };

  const strokeWidths = {
    sm: "6",
    md: "8",
    lg: "8",
    xl: "10",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
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
        return <CheckCircle className={iconSizes[size]} />;
      case "locked":
        return <Lock className={iconSizes[size]} />;
      case "in-progress":
      default:
        return <Clock className={iconSizes[size]} />;
    }
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case "completed":
        return "Completed";
      case "locked":
        return "Locked";
      case "in-progress":
      default:
        return showPercentage ? `${percentage}% Complete` : "In Progress";
    }
  };

  // Calculate SVG dimensions
  const radius = 40; // percentage of the size
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r={`${radius}%`}
            stroke="currentColor"
            strokeWidth={strokeWidths[size]}
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          {currentStatus !== "locked" && (
            <circle
              cx="50%"
              cy="50%"
              r={`${radius}%`}
              stroke="currentColor"
              strokeWidth={strokeWidths[size]}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${getStatusColor()} transition-all duration-500 ease-out`}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {currentStatus === "in-progress" ? (
            <span className={`font-bold ${getStatusColor()}`}>
              {showPercentage || percentage > 0
                ? `${percentage}%`
                : getStatusIcon()}
            </span>
          ) : (
            <span className={getStatusColor()}>{getStatusIcon()}</span>
          )}
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={`text-xs font-medium text-center ${getStatusColor()} max-w-[120px]`}
        >
          {getStatusText()}
        </span>
      )}
    </div>
  );
};

export default ProgressBadge;
