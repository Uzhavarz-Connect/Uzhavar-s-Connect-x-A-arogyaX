import { useState, useEffect } from "react";
import {
  WeatherService,
  WeatherData,
  ForecastDay,
} from "../services/weather-service";
import { useToast } from "@/hooks/use-toast";

interface UseWeatherReturn {
  currentWeather: WeatherData | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: string | null;
  apiKey: string;
  refreshWeather: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
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
              "Using default location. Please enable location access for accurate weather data.",
            variant: "destructive",
          });
        }
      );
    } else {
      // Default location if geolocation is not supported
      setCoordinates({ lat: 51.5074, lon: -0.1278 });
      toast({
        title: "Geolocation not supported",
        description: "Using default location for weather data.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchWeatherData = async () => {
    if (!apiKey || !coordinates) return;

    setLoading(true);
    setError(null);

    try {
      const weatherService = new WeatherService(apiKey);

      const [weatherData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(coordinates.lat, coordinates.lon),
        weatherService.getForecast(coordinates.lat, coordinates.lon),
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);

      toast({
        title: "Weather updated",
        description: "Weather data has been refreshed successfully.",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      toast({
        title: "Weather fetch failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data when API key or coordinates change
  useEffect(() => {
    if (apiKey && coordinates) {
      fetchWeatherData();
    }
  }, [apiKey, coordinates]);

  const refreshWeather = () => {
    fetchWeatherData();
  };

  return {
    currentWeather,
    forecast,
    loading,
    error,
    apiKey,
    refreshWeather,
  };
};
