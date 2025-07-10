import { useState, useRef } from "react";
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
import { ArrowLeft, Camera, Upload, Scan, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type DetectionResult = {
  image: string | null;
  name: string;
  type: string;
  disease_name: string;
  disease_effects: string[];
  disease_solutions: string[];
  mitigation: string[];
  description?: string | null;
};

const DiseaseDetector = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectionResult, setDetectionResult] =
    useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { toast } = useToast();

  const languages = [
    "Bengali",
    "English",
    "Gujarati",
    "Hindi",
    "Kannada",
    "Malayalam",
    "Marathi",
    "Nepali",
    "Punjabi",
    "Tamil",
    "Telugu",
    "Urdu",
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const convertToBase64 = (imageData: string): string => {
    // Remove the data URL prefix to get just the base64 data
    return imageData.split(",")[1];
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast({
        title: "Missing Information",
        description: "Please select an image and plant type before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const base64Image = convertToBase64(selectedImage);

      const response = await fetch("http://127.0.0.1:5000/disease/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          lang: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      setDetectionResult(data);

      toast({
        title: "Detection Complete",
        description: "Disease detection analysis completed successfully.",
      });
    } catch (error) {
      setTimeout(handleSubmit, 100);

      // console.error("Error detecting disease:", error);
      // toast({
      //   title: "Detection Failed",
      //   description:
      //     "Failed to detect disease. Please check your connection and try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-6 rounded-b-3xl shadow-lg">
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
            <Scan className="h-6 w-6" />
            <h1 className="text-xl font-bold">Disease Detector</h1>
          </div>
        </div>
        <p className="text-emerald-100 text-sm">
          Upload or capture plant images to detect diseases
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Image Input Section */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Upload Plant Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedImage ? (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected plant"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <div className="text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>No image selected</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleCameraCapture}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Camera
                    </Button>
                    <Button onClick={handleFileUpload} variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md p-4">
          <div className="mb-4">
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select language type..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {languages.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!selectedImage || isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Scan className="h-5 w-5 mr-2" />
              Detect Disease
            </>
          )}
        </Button>

        {/* Detection Result */}
        {detectionResult && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="capitalize font-bold text-2xl mb-2">
                {detectionResult.type === "plant"
                  ? detectionResult.disease_name
                  : detectionResult.name}{" "}
                {detectionResult.type === "plant"
                  ? ""
                  : `(${detectionResult.type})`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {detectionResult.image && (
                <img
                  src={detectionResult.image}
                  alt="Disease detection result"
                  className="w-full rounded-lg"
                />
              )}
              {detectionResult.disease_name && (
                <>
                  <p className="text-xl font-semibold">Effects</p>
                  <ul className="capitalize list-disc ml-5">
                    {detectionResult.disease_effects.map((v) => (
                      <li>{v}</li>
                    ))}
                  </ul>
                  <p className="text-xl font-semibold mt-2">Solutions</p>
                  <ul className="capitalize list-disc ml-5">
                    {detectionResult.disease_solutions.map((v) => (
                      <li>{v}</li>
                    ))}
                  </ul>
                </>
              )}
              {detectionResult.description && (
                <>
                  <p className="text-lg text-justify mb-4">
                    {detectionResult.description}
                  </p>
                  <p className="text-xl font-semibold">Mitigation</p>
                  <ul className="capitalize list-disc ml-5 text-lg">
                    {detectionResult.mitigation.map((v) => (
                      <li>{v}</li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetector;
