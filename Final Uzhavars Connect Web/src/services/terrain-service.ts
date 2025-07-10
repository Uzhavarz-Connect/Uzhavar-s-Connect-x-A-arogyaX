export interface ElevationData {
  lat: number;
  lon: number;
  elevation: number;
}

export interface TerrainMetrics {
  elevation: number;
  nearbyElevation: number;
  elevationDiff: number;
  tilt: number;
  slope: number;
  relief: number;
  planCurvature: number;
  profileCurvature: number;
  location: string;
}

export class TerrainService {
  private apiKey: string;
  private baseUrl = "https://api.open-elevation.com/api/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getElevation(lat: number, lon: number): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseUrl}/lookup`, {
        method: "POST",
        body: JSON.stringify({
          locations: [{ latitude: lat, longitude: lon }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch elevation data");
      }

      const data = await response.json();
      console.log(data["results"][0]["elevation"]);

      return data["results"][0]["elevation"] || Math.random() * 1000; // Mock elevation for demo
    } catch (error) {
      console.error("Error fetching elevation:", error);
      return null;
    }
  }

  calculateTilt(elevationDiff: number, distance: number): number {
    // Calculate tilt in degrees
    const radians = Math.atan(elevationDiff / distance);
    return (radians * 180) / Math.PI;
  }

  async analyzeTerrainMetrics(
    lat: number,
    lon: number
  ): Promise<TerrainMetrics | null> {
    const nearbyDistance = 500; // in meters

    // Get elevation for original point
    const elevation = await this.getElevation(lat, lon);
    if (elevation === null) {
      throw new Error("Failed to get elevation data");
    }

    // Move latitude slightly for comparison
    const latOffset = lat + (nearbyDistance / 6371000) * (180 / Math.PI);

    // Get elevation for the nearby point
    const nearbyElevation = await this.getElevation(latOffset, lon);
    if (nearbyElevation === null) {
      throw new Error("Failed to get nearby elevation data");
    }

    // Calculate terrain metrics
    const elevationDiff = nearbyElevation - elevation;
    const tilt = this.calculateTilt(elevationDiff, nearbyDistance);
    const slope = tilt; // Since slope and tilt are similar concepts

    // Relief: Assume reference elevation (sea level) as 0m for simplicity
    const relief = Math.abs(elevation - 0);

    // Plan and Profile Curvature: Approximated using the difference over 500 meters
    const planCurvature = elevationDiff / nearbyDistance;
    const profileCurvature = elevationDiff / nearbyDistance;

    return {
      elevation,
      nearbyElevation,
      elevationDiff,
      tilt,
      slope,
      relief,
      planCurvature,
      profileCurvature,
      location: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    };
  }
}
