import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  RefreshCw,
  Key,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useWeather } from "../hooks/use-weather";
import { WeatherService } from "../services/weather-service";
import { useState } from "react";
import * as LucideIcons from "lucide-react";

const Weather = () => {
  const { currentWeather, forecast, loading, error, apiKey, refreshWeather } =
    useWeather();

  const weatherService = new WeatherService(apiKey);

  const getWeatherIcon = (iconCode: string) => {
    const iconName = weatherService.getWeatherIcon(iconCode);
    const IconComponent = (LucideIcons as any)[iconName] || Cloud;
    return IconComponent;
  };

  const farmingTips = [
    "Check soil moisture before irrigation",
    "Monitor weather for optimal planting times",
    "Protect crops during extreme weather conditions",
    "Adjust fertilizer application based on rainfall",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
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
            <Cloud className="h-6 w-6" />
            <h1 className="text-xl font-bold">Weather Forecast</h1>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={refreshWeather}
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
                onClick={refreshWeather}
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
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
              <p className="text-gray-600">Loading weather data...</p>
            </CardContent>
          </Card>
        )}

        {/* Current Weather */}
        {currentWeather && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-gray-800">
                Current Weather
              </CardTitle>
              <p className="text-gray-600">{currentWeather.location}</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center mb-4">
                {(() => {
                  const IconComponent = getWeatherIcon(currentWeather.icon);
                  return <IconComponent className="h-16 w-16 text-blue-500" />;
                })()}
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {currentWeather.temperature}°C
              </div>
              <div className="text-lg text-gray-600 mb-4 capitalize">
                {currentWeather.condition}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="font-semibold">
                    {currentWeather.humidity}%
                  </div>
                </div>
                <div className="text-center">
                  <Wind className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Wind</div>
                  <div className="font-semibold">
                    {currentWeather.windSpeed} km/h
                  </div>
                </div>
                <div className="text-center">
                  <CloudRain className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Rain</div>
                  <div className="font-semibold">
                    {currentWeather.precipitation}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">
                5-Day Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {forecast.map((day, index) => {
                const IconComponent = getWeatherIcon(day.icon);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-blue-500" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {day.day}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {day.condition}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-800">
                        {day.high}°
                      </div>
                      <div className="text-sm text-gray-500">{day.low}°</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Farming Tips */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Farming Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {farmingTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-green-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Weather;
