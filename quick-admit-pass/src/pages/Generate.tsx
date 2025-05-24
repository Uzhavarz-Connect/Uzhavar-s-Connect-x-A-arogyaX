
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Download, Share2, Printer, User, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Generate = () => {
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [generatedQR, setGeneratedQR] = useState<boolean>(false);
  
  const handleGenerateQR = () => {
    setGeneratedQR(true);
    toast.success("QR Code generated successfully!");
  };
  
  const downloadOptions = [
    { icon: Download, label: "Download QR", action: () => toast.success("QR Code downloaded") },
    { icon: Share2, label: "Share", action: () => toast.success("Sharing options opened") },
    { icon: Printer, label: "Print", action: () => toast.success("Printing QR Code") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Generate Patient QR</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information Form</CardTitle>
              <CardDescription>
                Enter patient details to generate a priority QR code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="medical">Medical History</TabsTrigger>
                  <TabsTrigger value="bank">Bank Details</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="John Doe" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" placeholder="42" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select defaultValue="male">
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Number</Label>
                      <Input id="phone" placeholder="+91 98765-43210" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhar">Aadhar Number</Label>
                      <Input id="aadhar" placeholder="XXXX-XXXX-XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Critical (High)</SelectItem>
                          <SelectItem value="medium">Urgent (Medium)</SelectItem>
                          <SelectItem value="low">Standard (Low)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea id="address" placeholder="Enter complete address with pincode" />
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select defaultValue="">
                        <SelectTrigger id="bloodGroup">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select defaultValue="">
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="general">General Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input id="allergies" placeholder="Penicillin, Peanuts, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Previous/Current Medical Conditions</Label>
                    <Textarea id="conditions" placeholder="Hypertension, Diabetes, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea id="medications" placeholder="List all medications with dosage" />
                  </div>
                </TabsContent>

                <TabsContent value="bank" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Holder Name</Label>
                    <Input id="accountName" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" placeholder="State Bank of India" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="XXXX-XXXX-XXXX-1234" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input id="ifsc" placeholder="SBIN0001234" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankNotes">Additional Notes</Label>
                    <Textarea id="bankNotes" placeholder="Any additional payment/insurance information" />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab(activeTab === "personal" ? "personal" : activeTab === "medical" ? "personal" : "medical")}
                  disabled={activeTab === "personal"}
                >
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab(activeTab === "personal" ? "medical" : activeTab === "medical" ? "bank" : "bank")}
                    disabled={activeTab === "bank"}
                  >
                    Next
                  </Button>
                  <Button 
                    className="bg-medical-primary hover:bg-medical-dark"
                    onClick={handleGenerateQR}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Patient QR Code</CardTitle>
              <CardDescription>
                {generatedQR 
                  ? "QR code generated successfully" 
                  : "Fill the form and click Generate QR"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-xs aspect-square bg-white border-2 border-dashed rounded-lg flex items-center justify-center mb-6">
                {generatedQR ? (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="grid grid-cols-5 grid-rows-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`${
                            // Create a QR code-like pattern
                            [0, 1, 2, 3, 4, 20, 21, 22, 23, 24, 0, 4, 20, 24, 8, 12, 16].includes(i) 
                              ? "bg-black" : "bg-white border border-gray-200"
                          } w-full aspect-square`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-center font-medium">PT-32150</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">QR will appear here</p>
                  </div>
                )}
              </div>

              {generatedQR && (
                <>
                  <div className="w-full border-t pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-1 text-gray-500" />
                        <span>John Doe</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Valid until: 24h</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full">
                    {downloadOptions.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="flex-1"
                        onClick={option.action}
                      >
                        <option.icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {generatedQR && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>1. Download or print the QR code</p>
                <p>2. Present this QR code at the hospital reception</p>
                <p>3. Staff will scan it for priority processing</p>
                <p>4. QR validity is 24 hours from generation</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
