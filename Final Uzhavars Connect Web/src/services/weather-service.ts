export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  location: string;
  icon: string;
}

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  date: string;
}

export interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  pop?: number;
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
  }>;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl = "https://api.openweathermap.org/data/2.5";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch current weather");
    }

    const data: WeatherResponse = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      precipitation: data.pop ? Math.round(data.pop * 100) : 0,
      location: data.name,
      icon: data.weather[0].icon,
    };
  }

  async getForecast(lat: number, lon: number): Promise<ForecastDay[]> {
    const response = await fetch(
      `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather forecast");
    }

    const data: ForecastResponse = await response.json();

    // Group forecast data by day and get daily min/max
    const dailyForecasts = new Map<
      string,
      {
        high: number;
        low: number;
        condition: string;
        icon: string;
        date: string;
        precipitation: number;
      }
    >();

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();

      const existing = dailyForecasts.get(dateKey);
      if (!existing) {
        dailyForecasts.set(dateKey, {
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].description,
          icon: item.weather[0].icon,
          date: dateKey,
          precipitation: item.pop * 100,
        });
      } else {
        existing.high = Math.max(existing.high, item.main.temp_max);
        existing.low = Math.min(existing.low, item.main.temp_min);
        existing.precipitation = Math.max(
          existing.precipitation,
          item.pop * 100
        );
      }
    });

    return Array.from(dailyForecasts.values())
      .slice(0, 5)
      .map((forecast, index) => ({
        day:
          index === 0
            ? "Today"
            : index === 1
            ? "Tomorrow"
            : new Date(forecast.date).toLocaleDateString("en-US", {
                weekday: "long",
              }),
        high: Math.round(forecast.high),
        low: Math.round(forecast.low),
        condition: forecast.condition,
        icon: forecast.icon,
        date: forecast.date,
      }));
  }

  getWeatherIcon(iconCode: string): string {
    // Map OpenWeather icons to Lucide icons
    const iconMap: { [key: string]: string } = {
      "01d": "sun",
      "01n": "moon",
      "02d": "cloud-sun",
      "02n": "cloud-moon",
      "03d": "cloud",
      "03n": "cloud",
      "04d": "cloudy",
      "04n": "cloudy",
      "09d": "cloud-rain",
      "09n": "cloud-rain",
      "10d": "cloud-sun-rain",
      "10n": "cloud-moon-rain",
      "11d": "cloud-lightning",
      "11n": "cloud-lightning",
      "13d": "cloud-snow",
      "13n": "cloud-snow",
      "50d": "cloud-fog",
      "50n": "cloud-fog",
    };

    return iconMap[iconCode] || "cloud";
  }
}
