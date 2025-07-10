import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const NGOFinder = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  // Mock API data - replace with actual API calls
  const { data: states = [] } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const res = await fetch("http://127.0.0.1:5000/ngos/states", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: string[][] = await res.json();
      return data.map((v) => {
        return { id: v[0], name: v[1] };
      });
    },
  });

  const { data: districts = [] } = useQuery({
    queryKey: ["districts", selectedState],
    queryFn: async () => {
      if (!selectedState) return [];
      const res = await fetch(
        `http://127.0.0.1:5000/ngos/states/${selectedState}/districts`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data: string[][] = await res.json();
      return data.map((v) => {
        return {
          id: v[0],
          name: v[1],
          stateId: v[2],
        };
      });
    },
    enabled: !!selectedState,
  });

  const { data: sectors = [] } = useQuery({
    queryKey: ["sectors"],
    queryFn: async () => {
      const res = await fetch("http://127.0.0.1:5000/ngos/sectors", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: string[][] = await res.json();
      return data.map((v) => {
        return { id: v[1], name: v[1] };
      });
    },
  });

  const { data: ngos = [] } = useQuery({
    queryKey: ["ngos", selectedState, selectedDistrict, selectedSectors],
    queryFn: async () => {
      if (!selectedState) return [];

      const params = new URLSearchParams({
        state: selectedState,
        district: selectedDistrict,
      });

      if (selectedSectors.length > 0)
        params.append("sectors", selectedSectors.join(","));

      const res = await fetch(`http://127.0.0.1:5000/ngos/search?${params}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);

      return data;
    },
    enabled: !!selectedState && !!selectedDistrict,
  });

  const handleSectorToggle = (sectorId: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sectorId)
        ? prev.filter((id) => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  // Reset district when state changes
  useEffect(() => {
    setSelectedDistrict("");
  }, [selectedState]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 rounded-b-3xl shadow-lg">
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
            <Users className="h-6 w-6" />
            <h1 className="text-xl font-bold">NGO Finder</h1>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="space-y-3">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDistrict}
            onValueChange={setSelectedDistrict}
            disabled={!selectedState}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="bg-white/10 border border-white/20 rounded-md p-3">
            <p className="text-sm text-white/90 mb-2">
              Select Sectors (Multiple)
            </p>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => handleSectorToggle(sector.id)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedSectors.includes(sector.id)
                      ? "bg-white text-green-600"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {sector.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Found {ngos.length} NGO
            {ngos.length !== 1 ? "s" : ""} matching your criteria
          </p>
        </div>

        <div className="space-y-4">
          {ngos.map((ngo) => (
            <Card key={ngo.id} className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-800">
                  {ngo.ngo_name_title}
                </CardTitle>
                <p className="text-sm text-gray-600">{ngo.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{ngo.city}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{ngo.phone_n}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span>{ngo.ngo_web_url}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {ngo.key_issues.split(",").map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Contact NGO
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NGOFinder;
