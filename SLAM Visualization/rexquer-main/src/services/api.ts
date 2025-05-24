import { adaptFleetData, adaptRobotDetails } from "./adapters";

interface SessionResponse {
  session_id: string;
  message: string;
}

export interface FleetStatus {
  active_robots: number;
  inactive_robots: number;
  total_area_covered: number;
  battery_levels: {
    [key: string]: number;
  };
  robots: Robot[];
  constraints: string[];
}

export interface Robot {
  id: string;
  name: string;
  status: string;
  battery: number;
  position: {
    x: number;
    y: number;
  };
  sensors: {
    soil_moisture: number;
    temperature: number;
    soil_ph: number;
  };
  tasks: {
    current: string;
    queue: string[];
  };
  last_update: string;
  error_logs?: string[];
}

export interface RobotDetails extends Robot {
  coverage_area: number;
  uptime: number;
  maintenance_history: {
    date: string;
    issue: string;
    resolution: string;
  }[];
  sensor_history: {
    timestamp: string;
    soil_moisture: number;
    temperature: number;
    soil_ph: number;
  }[];
}

export type MoveDirection = "forward" | "backward" | "left" | "right" | "stop";

export interface MoveResponse {
  success: boolean;
  message: string;
  new_position?: {
    x: number;
    y: number;
  };
}

const API_BASE_URL = "http://172.16.45.55:5000/api";

class FleetAPI {
  private sessionId: string | null = null;

  constructor() {
    // Try to load session from localStorage
    const savedSession = localStorage.getItem("fleet_session_id");
    if (savedSession) {
      this.sessionId = savedSession;
    }
  }

  async startSession(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/session/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to start session: ${response.status}`);
      }

      const data: SessionResponse = await response.json();
      this.sessionId = data.session_id;

      // Save session to localStorage
      localStorage.setItem("fleet_session_id", data.session_id);

      return data.session_id;
    } catch (error) {
      console.error("Error starting session:", error);
      throw error;
    }
  }

  async getFleetStatus(): Promise<FleetStatus> {
    if (!this.sessionId) {
      await this.startSession();
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/fleet/status?session_id=${this.sessionId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to get fleet status: ${response.status}`);
      }

      const rawData = await response.json();
      const fleetData = adaptFleetData(rawData);

      return fleetData;
    } catch (error) {
      console.error("Error getting fleet status:", error);
      throw error;
    }
  }

  async getRobotDetails(robotId: string): Promise<RobotDetails> {
    if (!this.sessionId) {
      await this.startSession();
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/rover/${robotId}/status?session_id=${this.sessionId}`
      );
      const sensorDataResponse = await fetch(
        `${API_BASE_URL}/rover/${robotId}/sensor-data?session_id=${this.sessionId}`
      );

      if (!response.ok || !sensorDataResponse.ok) {
        throw new Error(`Failed to get robot details: ${response.status}`);
      }

      const rawData = await response.json();
      const sensorRawData = await sensorDataResponse.json();
      return adaptRobotDetails({ ...rawData, ...sensorRawData });
    } catch (error) {
      console.error("Error getting robot details:", error);
      throw error;
    }
  }

  async assignTask(
    robotId: string,
    task: string
  ): Promise<{ success: boolean; message: string }> {
    if (!this.sessionId) {
      await this.startSession();
    }

    try {
      const params = new URLSearchParams({
        session_id: this.sessionId,
        task: task,
      });
      const response = await fetch(
        `${API_BASE_URL}/rover/${robotId}/task?${params}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ task }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to assign task: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error assigning task:", error);
      throw error;
    }
  }

  async moveRobot(
    robotId: string,
    direction: MoveDirection
  ): Promise<MoveResponse> {
    if (!this.sessionId) {
      await this.startSession();
    }

    const to = direction === "stop" ? "reset" : "move";

    try {
      const response = await fetch(
        `${API_BASE_URL}/rover/${robotId}/${to}?session_id=${this.sessionId}&direction=${direction}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to move robot: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.success || false,
        message: result.message || "Move command processed",
        new_position: result.new_position,
      };
    } catch (error) {
      console.error(`Error moving robot ${robotId}:`, error);
      throw error;
    }
  }
}

export const fleetAPI = new FleetAPI();
