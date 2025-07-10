import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NGOFinder from "./pages/NGOFinder";
import POISearch from "./pages/POISearch";
import DiseaseDetection from "./pages/DiseaseDetection";
import Weather from "./pages/Weather";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import BottomAppBar from "./components/BottomAppBar";
import TerrainAnalysis from "./pages/TerrainAnalysis";
import RoverControl from "./pages/RoverPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="pb-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ngo-finder" element={<NGOFinder />} />
            <Route path="/poi-search" element={<POISearch />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/terrain-analysis" element={<TerrainAnalysis />} />
            <Route path="/rover-control" element={<RoverControl />} />
            <Route path="/resources" element={<Resources />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <BottomAppBar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
