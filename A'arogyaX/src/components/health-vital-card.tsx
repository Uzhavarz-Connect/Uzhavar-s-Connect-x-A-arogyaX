import React from "react";
import { Heart, Thermometer, Activity } from "lucide-react";

interface HealthVitalCardProps {
  title: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  trend?: number[];
  type: "temperature" | "heartRate" | "glucose";
  className?: string;
}

export default function HealthVitalCard({
  title,
  value,
  unit,
  status,
  trend,
  type,
  className,
}: HealthVitalCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "text-red-600";
      case "warning":
        return "text-amber-500";
      case "normal":
      default:
        return "text-green-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "temperature":
        return <Thermometer className="h-5 w-5 text-amber-500" />;
      case "heartRate":
        return <Heart className="h-5 w-5 text-blue-500" />;
      case "glucose":
        return <Activity className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const renderTrendGraph = () => {
    if (!trend || trend.length === 0) return null;

    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;

    const points = trend
      .map((value, index) => {
        const x = (index / (trend.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 80;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <div className="h-16 w-full mt-2">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points={points}
            fill="none"
            stroke={"#10b981"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        </div>
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {value} {unit}
        </span>
      </div>

      {renderTrendGraph()}

      <div className="mt-2 flex items-end">
        <span className="text-3xl font-bold">{value}</span>
        <span className="ml-1 text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );
}
