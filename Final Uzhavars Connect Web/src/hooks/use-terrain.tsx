import { useState, useEffect } from "react";
import { TerrainService, TerrainMetrics } from "../services/terrain-service";
import { useToast } from "@/hooks/use-toast";

interface UseTerrainReturn {
  terrainData: TerrainMetrics | null;
  loading: boolean;
  error: string | null;
  analyzeTerrain: () => void;
}

export const useTerrain = (): UseTerrainReturn => {
  const [terrainData, setTerrainData] = useState<TerrainMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey = "dff8a714e30a29e438b4bd2ebb11190f";
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const { toast } = useToast();

  // Get user's location
  useEffect(() => {
    if (!loading) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to a sample location (London) if geolocation fails
          setCoordinates({ lat: 51.5074, lon: -0.1278 });
          toast({
            title: "Location access denied",
            description:
              "Using default location. Please enable location access for accurate data.",
            variant: "destructive",
          });
        }
      );
    } else {
      // Default location if geolocation is not supported
      setCoordinates({ lat: 51.5074, lon: -0.1278 });
      toast({
        title: "Geolocation not supported",
        description: "Using default location for terrain analysis.",
        variant: "destructive",
      });
    }
  }, [toast, loading]);

  const fetchTerrainData = async () => {
    if (!apiKey) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        try {
          const terrainService = new TerrainService(apiKey);
          const metrics = await terrainService.analyzeTerrainMetrics(
            coords.lat,
            coords.lon
          );

          if (metrics) {
            setTerrainData(metrics);
            toast({
              title: "Terrain analysis complete",
              description: "Terrain metrics have been calculated successfully.",
            });
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to analyze terrain";
          setError(errorMessage);
          toast({
            title: "Terrain analysis failed",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {}
    );

    setLoading(true);
    setError(null);
  };

  const analyzeTerrain = () => {
    fetchTerrainData();
  };

  return {
    terrainData,
    loading,
    error,
    analyzeTerrain,
  };
};
