
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, QrCode, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: "Priority Tickets", 
      value: "12", 
      description: "Active today", 
      icon: Ticket, 
      color: "bg-medical-primary", 
      path: "/admin" 
    },
    { 
      title: "QR Scans", 
      value: "28", 
      description: "Last 24 hours", 
      icon: QrCode, 
      color: "bg-medical-secondary", 
      path: "/scanner" 
    },
    { 
      title: "Patients Processed", 
      value: "32", 
      description: "Today", 
      icon: UserCheck, 
      color: "bg-priority-low", 
      path: "/generate" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Button 
          className="bg-medical-primary hover:bg-medical-dark"
          onClick={() => navigate("/scanner")}
        >
          <QrCode className="mr-2 h-4 w-4" />
          Scan QR Code
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate(stat.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-md`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <CardDescription className="text-sm text-gray-500">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Priority Queue Status</CardTitle>
          <CardDescription>Currently waiting patients with priority status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PriorityPatient
              name="John Doe"
              id="PT-32145"
              priority="high"
              waitTime="2 minutes"
            />
            <PriorityPatient
              name="Alice Smith"
              id="PT-32146"
              priority="medium"
              waitTime="5 minutes"
            />
            <PriorityPatient
              name="Robert Johnson"
              id="PT-32150"
              priority="low"
              waitTime="12 minutes"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-medical-light rounded-full h-8 w-8 flex items-center justify-center text-medical-primary font-medium">1</div>
              <div>
                <h3 className="font-medium">Generate Patient QR Codes</h3>
                <p className="text-sm text-gray-500">Create encrypted QR codes with patient information to expedite the admission process.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-medical-light rounded-full h-8 w-8 flex items-center justify-center text-medical-primary font-medium">2</div>
              <div>
                <h3 className="font-medium">Scan at Reception</h3>
                <p className="text-sm text-gray-500">Quickly scan the QR code to retrieve patient information and create priority tickets.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-medical-light rounded-full h-8 w-8 flex items-center justify-center text-medical-primary font-medium">3</div>
              <div>
                <h3 className="font-medium">Priority Queue Management</h3>
                <p className="text-sm text-gray-500">Efficiently manage the priority queue based on patient severity and wait times.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full justify-start bg-medical-primary hover:bg-medical-dark"
              onClick={() => navigate("/scanner")}
            >
              <QrCode className="mr-2 h-5 w-5" />
              Scan Patient QR Code
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/generate")}
            >
              <UserCheck className="mr-2 h-5 w-5" />
              Generate New Patient QR
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => navigate("/admin")}
            >
              <Ticket className="mr-2 h-5 w-5" />
              View Priority Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PriorityPatient = ({ 
  name, 
  id, 
  priority, 
  waitTime 
}: { 
  name: string; 
  id: string; 
  priority: 'high' | 'medium' | 'low'; 
  waitTime: string; 
}) => {
  const priorityColors = {
    high: "bg-priority-high",
    medium: "bg-priority-medium",
    low: "bg-priority-low",
  };

  const priorityLabels = {
    high: "Critical",
    medium: "Urgent",
    low: "Priority",
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
      <div className="flex items-center">
        <div className={`${priorityColors[priority]} w-3 h-12 rounded-full mr-4`} />
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">{id}</div>
        </div>
      </div>
      <div className="flex items-center">
        <div className={`px-3 py-1 rounded-full text-xs text-white ${priorityColors[priority]}`}>
          {priorityLabels[priority]}
        </div>
        <div className="ml-4 text-sm text-gray-500">
          Wait time: <span className="font-medium">{waitTime}</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
