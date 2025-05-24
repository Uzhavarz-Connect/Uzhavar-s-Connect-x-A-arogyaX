
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Ticket, Upload, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Scanner = () => {
  const [activeTab, setActiveTab] = useState<string>("scan");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanCompleted, setScanCompleted] = useState<boolean>(false);
  const [patientDetailsOpen, setPatientDetailsOpen] = useState<boolean>(false);

  const handleFileScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      startScanSimulation();
    }
  };
  
  const startScanSimulation = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      toast.success("Patient QR code scanned successfully!", {
        description: "Priority ticket has been created.",
      });
      setPatientDetailsOpen(true);
    }, 2000);
  };

  const handleStartCamera = () => {
    startScanSimulation();
  };

  const handleCreateTicket = () => {
    toast.success("Priority ticket created!", {
      description: "Patient added to priority queue.",
    });
    setScanCompleted(false);
    setPatientDetailsOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">QR Code Scanner</h1>
        <Button
          variant="outline"
          className="border-medical-primary text-medical-primary hover:bg-medical-light"
          onClick={() => {
            setScanCompleted(false);
            setIsScanning(false);
          }}
        >
          Reset Scanner
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scan">Camera Scan</TabsTrigger>
          <TabsTrigger value="upload">Upload QR Image</TabsTrigger>
        </TabsList>
        <TabsContent value="scan">
          <Card className="border-2 border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="text-center">Camera Scanner</CardTitle>
              <CardDescription className="text-center">
                Position the patient's QR code in front of the camera
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md aspect-square bg-gray-100 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                {isScanning ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="animate-pulse-slow">
                      <QrCode size={120} className="text-medical-primary" />
                    </div>
                  </div>
                ) : scanCompleted ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-medical-light">
                    <CheckCircle size={80} className="text-priority-low mb-4" />
                    <p className="text-lg font-medium">Scan Completed</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <QrCode size={100} className="text-gray-400 mb-4" />
                    <p className="text-gray-500">Camera preview will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={handleStartCamera}
                className="bg-medical-primary hover:bg-medical-dark"
                disabled={isScanning || scanCompleted}
              >
                {isScanning ? "Scanning..." : "Start Camera"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="upload">
          <Card className="border-2 border-dashed border-gray-300">
            <CardHeader>
              <CardTitle className="text-center">Upload QR Image</CardTitle>
              <CardDescription className="text-center">
                Upload an image containing the patient's QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md aspect-square bg-gray-100 flex items-center justify-center rounded-lg mb-4">
                {isScanning ? (
                  <div className="animate-pulse-slow">
                    <QrCode size={120} className="text-medical-primary" />
                  </div>
                ) : scanCompleted ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-medical-light">
                    <CheckCircle size={80} className="text-priority-low mb-4" />
                    <p className="text-lg font-medium">Scan Completed</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Upload size={80} className="text-gray-400 mb-4" />
                    <p className="text-gray-500">Drag and drop or click to upload</p>
                  </div>
                )}
              </div>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Label htmlFor="qr-file" className="sr-only">
                  QR Code Image
                </Label>
                <Input
                  id="qr-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileScan}
                  disabled={isScanning || scanCompleted}
                />
                <Button
                  type="submit"
                  disabled={isScanning || scanCompleted}
                  onClick={() => {}}
                  className="bg-medical-primary hover:bg-medical-dark"
                >
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PatientDetailsDialog 
        open={patientDetailsOpen} 
        onOpenChange={setPatientDetailsOpen} 
        onCreateTicket={handleCreateTicket} 
      />
    </div>
  );
};

interface PatientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTicket: () => void;
}

const PatientDetailsDialog = ({ open, onOpenChange, onCreateTicket }: PatientDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Patient Information</DialogTitle>
          <DialogDescription>
            Review patient details extracted from QR code
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Patient Name</span>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Age / Gender</span>
                  <p className="font-medium">42 / Male</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Aadhar Number</span>
                  <p className="font-medium">XXXX-XXXX-1234</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Contact</span>
                  <p className="font-medium">+91 98765-43210</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-medium">john.doe@example.com</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <p className="text-gray-700">
                123 Medical Lane, Healthcare District, Mumbai, Maharashtra - 400001
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Medical History</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Blood Group</span>
                  <p className="font-medium">O+</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Allergies</span>
                  <p className="font-medium">Penicillin, Peanuts</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Previous Conditions</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline">Hypertension</Badge>
                    <Badge variant="outline">Type 2 Diabetes</Badge>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Current Medications</span>
                  <p className="font-medium">Metformin, Lisinopril</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Bank Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Account Holder</span>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Bank Name</span>
                  <p className="font-medium">State Bank of India</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Account Number</span>
                  <p className="font-medium">XXXX-XXXX-XXXX-5678</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={onCreateTicket}
            className="bg-priority-high hover:bg-red-700 text-white"
          >
            <Ticket className="mr-2 h-4 w-4" />
            Create Priority Ticket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Scanner;
