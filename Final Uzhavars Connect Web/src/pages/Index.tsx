import { Card, CardContent } from "@/components/ui/card";
import {
  Leaf,
  MapPin,
  Search,
  Cloud,
  BookOpen,
  Users,
  ShieldAlert,
  Mountain,
  Gamepad2,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      title: "Disease Detection",
      description: "Image based disease detection",
      icon: ShieldAlert,
      path: "/disease-detection",
      color: "bg-emerald-500",
    },
    {
      title: "NGO Finder",
      description: "Find agricultural NGOs and support organizations near you",
      icon: Users,
      path: "/ngo-finder",
      color: "bg-green-500",
    },
    {
      title: "POI Search",
      description:
        "Discover markets, suppliers, and agricultural points of interest",
      icon: MapPin,
      path: "/poi-search",
      color: "bg-amber-500",
    },
    {
      title: "Weather",
      description: "Get accurate weather forecasts for your farming needs",
      icon: Cloud,
      path: "/weather",
      color: "bg-blue-500",
    },
    {
      title: "Terrain Analysis",
      description:
        "Analyze elevation, slope, tilt, and terrain curvature for your land",
      icon: Mountain,
      path: "/terrain-analysis",
      color: "bg-amber-600",
    },

    {
      title: "Rover Control",
      description:
        "Control your agricultural rover remotely with directional commands",
      icon: Gamepad2,
      path: "/rover-control",
      color: "bg-gray-600",
    },

    // {
    //   title: "Resources",
    //   description: "Access farming tips, guides, and agricultural knowledge",
    //   icon: BookOpen,
    //   path: "/resources",
    //   color: "bg-purple-500",
    // },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">Uzhavar's Connect</h1>
        </div>
        <p className="text-green-100 text-sm">
          Your agricultural companion app
        </p>
      </div>

      {/* Welcome Section */}
      <div className="p-6">
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome, Farmer!
          </h2>
          <p className="text-gray-600 text-sm">
            Explore tools and resources to enhance your agricultural journey
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.path} className="block">
              <Card className="hover:shadow-lg transition-all duration-200 border-0 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${feature.color} p-3 rounded-xl`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* External Link to Kissan AI */}
        <a
          href="https://kissan.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4"
        >
          <Card className="hover:shadow-lg transition-all duration-200 border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-500 p-3 rounded-xl">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-1">
                    Kissan AI
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Advanced AI-powered agricultural solutions and insights
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </a>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">1,200+</div>
            <div className="text-xs text-gray-600">Registered NGOs</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-amber-600">850+</div>
            <div className="text-xs text-gray-600">Points of Interest</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Index;
