import React from "react";
import { Scale, Coffee, Footprints, Clock } from "lucide-react";

interface HealthBodyConditionCardProps {
  type: "weight" | "food" | "activity" | "sleep";
  title: string;
  value: number | string;
  subtitle: string;
  progress?: number;
  unit: string;
  className?: string;
}

export default function HealthBodyConditionCard({
  type,
  title,
  value,
  subtitle,
  progress,
  unit,
  className,
}: HealthBodyConditionCardProps) {
  const getIcon = () => {
    switch (type) {
      case "weight":
        return <Scale className="h-5 w-5 text-gray-500" />;
      case "food":
        return <Coffee className="h-5 w-5 text-gray-500" />;
      case "activity":
        return <Footprints className="h-5 w-5 text-gray-500" />;
      case "sleep":
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    if (progress === undefined) return null;

    const progressPercent = Math.min(100, Math.max(0, progress));
    const progressColor =
      progressPercent > 75
        ? "bg-green-500"
        : progressPercent > 40
        ? "bg-blue-500"
        : "bg-amber-500";

    return (
      <div className="w-full h-1.5 bg-white/35 rounded-full mt-2">
        <div
          className={`h-full rounded-full ${progressColor}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    );
  };

  const renderActivityCircle = () => {
    if (type !== "activity" || progress === undefined) return null;

    const progressPercent = Math.min(100, Math.max(0, progress));
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference * (1 - progressPercent / 100);

    return (
      <div className="relative flex items-center justify-center mt-3">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold">{value}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`vital-card ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        <span className="text-xs font-medium text-gray-500">{subtitle}</span>
      </div>

      {type === "activity" ? (
        renderActivityCircle()
      ) : (
        <>
          <div className="mt-2">
            <span className="text-3xl font-bold">{value}</span>
            <span className="ml-1 text-sm text-gray-500">{unit}</span>
          </div>
          {renderProgressBar()}
        </>
      )}
    </div>
  );
}
