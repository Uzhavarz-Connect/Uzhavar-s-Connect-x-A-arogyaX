import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock,
  Star,
  Navigation,
  Locate,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const POISearch = () => {
  const [location, setLocation] = useState("");
  const [selectedPOIType, setSelectedPOIType] = useState("All");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [coords, setCoords] = useState<number[]>();

  const { data: gmCoords = [] } = useQuery({
    queryKey: ["geocode", location],
    queryFn: async () => {
      if (!location) return [];

      const params = new URLSearchParams({
        key: "AIzaSyBlJfGgpP2kN06cTUkpcY1VZLsflD2_ux0",
        address: location,
      });
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?${params}`
      );
      const data = await res.json();
      return [
        data.results[0]["geometry"]["location"]["lat"],
        data.results[0]["geometry"]["location"]["lng"],
      ];
    },
    enabled: !!location,
  });

  const { data: pois = [] } = useQuery({
    queryKey: [
      "pois",
      (coords ?? gmCoords).map((s) => String(s).split(".")[0]).join(","),
      selectedPOIType,
    ],
    queryFn: async () => {
      if (!coords && gmCoords.length == 0) return [];

      const params = new URLSearchParams({
        location: (coords ?? gmCoords).join(","),
        place: selectedPOIType === "All" ? "" : selectedPOIType,
      });

      const res = await fetch(
        `http://127.0.0.1:5000/gmaps/nearbyplaces?${params}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);

      return data.results;
    },
    enabled: !!coords || gmCoords.length == 2,
  });

  const poiTypes = ["All", "Seed Store", "Hospital", "Hotel", "restaurant"];

  // Get current location using geolocation API
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords([latitude, longitude]);

        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enter manually.");
        setIsLoadingLocation(false);
      }
    );
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "market":
        return "bg-green-100 text-green-700";
      case "supplier":
        return "bg-blue-100 text-blue-700";
      case "store":
        return "bg-amber-100 text-amber-700";
      case "feed store":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
            <MapPin className="h-6 w-6" />
            <h1 className="text-xl font-bold">POI Search</h1>
          </div>
        </div>

        {/* Location Input */}
        <div className="mb-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter your location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="absolute right-1 top-1 h-8 w-8 p-0 bg-white/20 hover:bg-white/30"
              size="sm"
            >
              <Locate
                className={`h-4 w-4 ${isLoadingLocation ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* POI Type Select */}
        <div className="mb-4">
          <Select value={selectedPOIType} onValueChange={setSelectedPOIType}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select POI type..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {poiTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Found {pois.length} location
            {pois.length !== 1 ? "s" : ""} near you
            {location && (
              <span className="ml-2 text-amber-600">• {location}</span>
            )}
          </p>
        </div>

        <div className="space-y-4">
          {pois.map((poi) => (
            <Card key={poi.place_id} className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-800">
                      {poi.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {poi.types.map((v) => {
                        return (
                          <span
                            className={`px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700 capitalize`}
                            key={v}
                          >
                            {v.replace("_", " ").replace("_", " ")}
                          </span>
                        );
                      })}

                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {poi.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{poi.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{poi.vicinity}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{poi.opening_hours ? "Open" : "Closed"}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                    <Navigation className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default POISearch;
