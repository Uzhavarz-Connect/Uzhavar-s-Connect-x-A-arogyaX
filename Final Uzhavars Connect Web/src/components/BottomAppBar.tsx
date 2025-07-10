import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  MapPin,
  Cloud,
  BookOpen,
  ShieldAlert,
  Mountain,
} from "lucide-react";

const BottomAppBar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
    },
    {
      path: "/disease-detection",
      icon: ShieldAlert,
      label: "Detect",
    },
    {
      path: "/ngo-finder",
      icon: Users,
      label: "NGOs",
    },
    {
      path: "/poi-search",
      icon: MapPin,
      label: "Places",
    },
    {
      path: "/weather",
      icon: Cloud,
      label: "Weather",
    },
    {
      path: "/terrain-analysis",
      icon: Mountain,
      label: "Terrain",
    },
    // {
    //   path: "/resources",
    //   icon: BookOpen,
    //   label: "Resources",
    // },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                active
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon
                className={`h-5 w-5 mb-1 ${active ? "text-green-600" : ""}`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomAppBar;
