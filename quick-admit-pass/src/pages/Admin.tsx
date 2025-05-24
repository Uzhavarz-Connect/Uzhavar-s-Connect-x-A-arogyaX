import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket, Search, UserCheck, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Define type for the ticket
interface Ticket {
  id: string;
  name: string;
  age: number;
  gender: string;
  priority: "high" | "medium" | "low";
  department: string;
  created: string;
  waiting: string;
  status: "waiting" | "processing" | "completed";
}

// Mock data for priority tickets
const PRIORITY_TICKETS: Ticket[] = [
  {
    id: "PT-32145",
    name: "John Doe",
    age: 42,
    gender: "Male",
    priority: "high",
    department: "Emergency",
    created: "10:24 AM",
    waiting: "12 min",
    status: "waiting",
  },
  {
    id: "PT-32146",
    name: "Alice Smith",
    age: 35,
    gender: "Female",
    priority: "medium",
    department: "Cardiology",
    created: "10:15 AM",
    waiting: "21 min",
    status: "waiting",
  },
  {
    id: "PT-32147",
    name: "Robert Johnson",
    age: 58,
    gender: "Male",
    priority: "low",
    department: "Neurology",
    created: "10:08 AM",
    waiting: "28 min",
    status: "waiting",
  },
  {
    id: "PT-32140",
    name: "Sarah Williams",
    age: 29,
    gender: "Female",
    priority: "medium",
    department: "Orthopedics",
    created: "09:45 AM",
    waiting: "51 min",
    status: "processing",
  },
  {
    id: "PT-32138",
    name: "Michael Brown",
    age: 63,
    gender: "Male",
    priority: "high",
    department: "Emergency",
    created: "09:30 AM",
    waiting: "66 min",
    status: "completed",
  },
];

const Admin = () => {
  const [tickets, setTickets] = useState<Ticket[]>(PRIORITY_TICKETS);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const filteredTickets = tickets.filter(ticket => {
    // Filter by status
    if (activeTab !== "all" && ticket.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !ticket.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleProcessTicket = (id: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, status: "processing" as const } : ticket
    ));
    toast.success(`Patient ${id} moved to processing`);
  };

  const handleCompleteTicket = (id: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, status: "completed" as const } : ticket
    ));
    toast.success(`Patient ${id} check-in completed`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Priority Tickets</h1>
        <Button className="bg-medical-primary hover:bg-medical-dark">
          <Ticket className="mr-2 h-4 w-4" />
          Manual Entry
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === "waiting").length}</div>
            <CardDescription className="text-xs">
              {tickets.filter(t => t.status === "waiting" && t.priority === "high").length} high priority
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === "processing").length}</div>
            <CardDescription className="text-xs">Currently being assisted</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => t.status === "completed").length}</div>
            <CardDescription className="text-xs">Today</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex items-center w-full md:w-1/3">
          <Search className="h-4 w-4 mr-2 text-gray-500" />
          <Input
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="filter-department" className="whitespace-nowrap">Department:</Label>
          <Select defaultValue="all">
            <SelectTrigger id="filter-department" className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
            </SelectContent>
          </Select>
          
          <Label htmlFor="filter-priority" className="ml-2 whitespace-nowrap">Priority:</Label>
          <Select defaultValue="all">
            <SelectTrigger id="filter-priority" className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="waiting">Waiting</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Priority Queue</CardTitle>
              <CardDescription>
                {filteredTickets.length} tickets {activeTab !== "all" ? `in ${activeTab} status` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTickets.length > 0 ? (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <TicketItem 
                      key={ticket.id} 
                      ticket={ticket} 
                      onProcess={() => handleProcessTicket(ticket.id)}
                      onComplete={() => handleCompleteTicket(ticket.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tickets found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TicketItemProps {
  ticket: Ticket;
  onProcess: () => void;
  onComplete: () => void;
}

const TicketItem = ({ ticket, onProcess, onComplete }: TicketItemProps) => {
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

  const statusBadge = {
    waiting: <Badge variant="outline" className="border-yellow-500 text-yellow-700">Waiting</Badge>,
    processing: <Badge variant="outline" className="border-blue-500 text-blue-700">Processing</Badge>,
    completed: <Badge variant="outline" className="border-green-500 text-green-700">Completed</Badge>,
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-white">
      <div className="flex items-center mb-2 md:mb-0">
        <div className={`${priorityColors[ticket.priority]} w-2 h-12 rounded-full mr-4 hidden md:block`} />
        <div>
          <div className="flex items-center">
            <span className="font-medium">{ticket.name}</span>
            <span className="text-xs ml-2 text-gray-600">{ticket.age}, {ticket.gender}</span>
            <Badge className={`ml-2 text-white ${priorityColors[ticket.priority]}`}>
              {priorityLabels[ticket.priority]}
            </Badge>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <span className="mr-4">{ticket.id}</span>
            {statusBadge[ticket.status]}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
        <div className="flex items-center text-sm text-gray-500 mr-4 w-full md:w-auto">
          <Clock className="h-4 w-4 mr-1" /> {ticket.waiting}
        </div>
        
        {ticket.status === "waiting" && (
          <Button size="sm" variant="outline" onClick={onProcess}>
            Start Processing
          </Button>
        )}
        
        {ticket.status === "processing" && (
          <Button size="sm" className="bg-priority-low hover:bg-green-600" onClick={onComplete}>
            <UserCheck className="mr-2 h-4 w-4" />
            Complete
          </Button>
        )}
        
        {ticket.status === "completed" && (
          <Button size="sm" variant="outline" disabled>
            Completed
          </Button>
        )}
      </div>
    </div>
  );
};

export default Admin;
