import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Mountain,
  TrendingUp,
  Key,
  RefreshCw,
  MapPin,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTerrain } from "@/hooks/use-terrain";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TerrainAnalysis = () => {
  const { terrainData, loading, error, analyzeTerrain } = useTerrain();
  const tabTitles = [
    "advanced investment analysis",
    "air quality analysis",
    "crop profitability analysis",
    "crop rotation management",
    "dynamic pricing",
    "location services",
    "market intelligence and pricing",
    "seasonal insights",
    "soil analysis and management",
    "trends methods",
    "weather risk assessment",
  ];

  const RenderTabContent = (props: { tabTitle: string }) => {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState<string | null>(null);

    // Fetch content on mount or when tabTitle changes
    useEffect(() => {
      setLoading(true);
      setContent(null);
      fetch(
        `http://127.0.0.1:5000/ft?title=${encodeURIComponent(props.tabTitle)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setContent(data.result);
          setLoading(false);
        })
        .catch(() => {
          setContent("Failed to load content.");
          setLoading(false);
        });
    }, [props.tabTitle]);

    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="">
            <h3 className="text-lg text-center font-semibold text-gray-800 capitalize mb-4">
              {props.tabTitle}
            </h3>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ) : content ? (
              content.split("\n").map((line, idx) => (
                <p key={idx} className="text-gray-600">
                  {line}
                </p>
              ))
            ) : (
              ""
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Header */}
      <div className="bg-amber-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6" />
            <h1 className="text-xl font-bold">Terrain Analysis</h1>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={analyzeTerrain}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {error && (
          <Card className="border-0 shadow-lg border-red-200">
            <CardContent className="p-4">
              <p className="text-red-600 text-center">{error}</p>
              <Button
                onClick={analyzeTerrain}
                className="w-full mt-2"
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-amber-500" />
              <p className="text-gray-600">Analyzing terrain data...</p>
            </CardContent>
          </Card>
        )}

        {/* Location Info */}
        {terrainData && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg text-gray-800 flex items-center justify-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Analysis
              </CardTitle>
              <p className="text-gray-600">{terrainData.location}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">
                    {terrainData.elevation.toFixed(1)}m
                  </div>
                  <div className="text-sm text-gray-600">Current Elevation</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">
                    {terrainData.nearbyElevation.toFixed(1)}m
                  </div>
                  <div className="text-sm text-gray-600">Nearby Elevation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Terrain Metrics */}
        {terrainData && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Terrain Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">
                    Elevation Difference
                  </span>
                  <span className="font-bold text-gray-800">
                    {terrainData.elevationDiff.toFixed(2)}m
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Tilt</span>
                  <span className="font-bold text-gray-800">
                    {terrainData.tilt.toFixed(2)}°
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Slope</span>
                  <span className="font-bold text-gray-800">
                    {terrainData.slope.toFixed(2)}°
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Relief</span>
                  <span className="font-bold text-gray-800">
                    {terrainData.relief.toFixed(1)}m
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">
                    Plan Curvature
                  </span>
                  <span className="font-bold text-gray-800">
                    {terrainData.planCurvature.toFixed(4)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">
                    Profile Curvature
                  </span>
                  <span className="font-bold text-gray-800">
                    {terrainData.profileCurvature.toFixed(4)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!terrainData && !loading && !error && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Mountain className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ready to Analyze
              </h3>
              <p className="text-gray-600 mb-4">
                Click the analyze button to get terrain metrics for your current
                location
              </p>
              <Button
                onClick={analyzeTerrain}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Start Analysis
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Analysis Tabs */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analysis Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={tabTitles[0]} className="w-full">
              <TabsList className="flex flex-wrap gap-1 h-auto">
                {tabTitles.map((title) => (
                  <TabsTrigger
                    key={title}
                    value={title}
                    className="text-xs py-2 px-4 capitalize"
                  >
                    {title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabTitles.map((title) => (
                <TabsContent key={title} value={title} className="mt-4">
                  <RenderTabContent tabTitle={title} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TerrainAnalysis;
