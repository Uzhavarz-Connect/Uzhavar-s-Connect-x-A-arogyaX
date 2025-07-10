import React, { useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Gamepad2,
  StopCircle,
  Radar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RoverControl = () => {
  const { toast } = useToast();

  const sendCommand = async (action: string) => {
    /*
Stop - S
Forward - f
Backward - b
left - l
right - r
sense - q
    */
    //http://192.168.85.68
    const mapped = {
      stop: 0,
      forward: 1,
      backward: 2,
      left: 3,
      right: 4,
      sense: 5,
    };
    try {
      const response = await fetch(
        `http://192.168.85.68/home?direction=${mapped[action]}`,
        {
          method: "GET",
          mode: "cors",
        }
      );

      if (response.ok) {
        toast({
          title: "Command Sent",
          description: `Rover moving ${action}`,
        });
      } else {
        throw new Error("Failed to send command");
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not connect to rover",
        variant: "destructive",
      });
      console.log("Rover command error:", error);
    }
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    switch (event.key.toLowerCase()) {
      case "w":
        sendCommand("forward");
        break;
      case "s":
        sendCommand("backward");
        break;
      case "a":
        sendCommand("left");
        break;
      case "d":
        sendCommand("right");
        break;
      case " ":
        sendCommand("stop");
        break;
      case "q":
        sendCommand("sense");
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="bg-white/20 p-2 rounded-full">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Rover Control</h1>
        </div>
        <p className="text-gray-300 text-sm">
          Control your agricultural rover remotely
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Rover Display */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Rover Camera View
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative bg-gray-900 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop"
                alt="Agricultural Rover"
                className="max-w-full max-h-[250px] object-contain rounded-lg"
              />
            </div>
          </CardContent>
        </Card> */}

        {/* Control Interface */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Directional Controls
            </CardTitle>
            <p className="text-sm text-gray-600">
              Use buttons or WASD keys to control
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto place-content-center justify-items-center">
              {/* Top row - Forward */}
              <div></div>
              <Button
                size="lg"
                onClick={() => sendCommand("forward")}
                className="bg-green-600 hover:bg-green-700 h-16 w-16 rounded-full"
              >
                <ArrowUp className="h-6 w-6" />
              </Button>
              <div></div>

              {/* Middle row - Left and Right */}
              <Button
                size="lg"
                onClick={() => sendCommand("left")}
                className="bg-blue-600 hover:bg-blue-700 h-16 w-16 rounded-full"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Gamepad2 className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => sendCommand("right")}
                className="bg-blue-600 hover:bg-blue-700 h-16 w-16 rounded-full"
              >
                <ArrowRight className="h-6 w-6" />
              </Button>

              {/* Bottom row - Backward */}
              <div></div>
              <Button
                size="lg"
                onClick={() => sendCommand("backward")}
                className="bg-red-600 hover:bg-red-700 h-16 w-16 rounded-full"
              >
                <ArrowDown className="h-6 w-6" />
              </Button>
              <div></div>
            </div>

            {/* Keyboard Instructions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                Keyboard Controls:
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>W - Forward</div>
                <div>S - Backward</div>
                <div>A - Left</div>
                <div>D - Right</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => sendCommand("stop")}
                className="bg-orange-600 hover:bg-orange-700 px-8 py-4 text-lg font-semibold"
              >
                <StopCircle className="h-6 w-6 mr-2" />
                Stop
              </Button>
              <Button
                size="lg"
                onClick={() => sendCommand("sense")}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-4 text-lg font-semibold"
              >
                <Radar className="h-6 w-6 mr-2" />
                Sense
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Info */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">
                Rover Status:{" "}
                <span className="text-green-600 font-semibold">Ready</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoverControl;
