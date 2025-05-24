"use client";
import useAuthContext from "@/hooks/useAuthContext";
import Sidebar from "@/components/sidebar";
import { Home, Hospital, Search, SquareKanban } from "lucide-react";
import {
  Activity,
  Calendar,
  MessageSquare,
  Users,
  Pill,
  FilePlus,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import DashboardLayout from "@/components/dashboard/DashboardLayout"; // if you have a separate one, otherwise you can merge
import { BrowserRouter } from "react-router-dom";

export default function Dash({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = useAuthContext();
  const navigation = [
    {
      name: "Dashboard",
      href: "/doctor/dashboard",
      icon: Activity,
      current: true,
    },
    {
      name: "Patient Forum",
      href: "/doctor/forum",
      icon: Users,
      current: false,
    },
    {
      name: "Med AI Chat",
      href: "/doctor/ai-chat",
      icon: MessageSquare,
      current: false,
    },
    {
      name: "Schedule",
      href: "/doctor/schedule",
      icon: Calendar,
      current: false,
    },
    {
      name: "Patients",
      href: "/doctor/patients",
      icon: UserCircle2,
      current: false,
    },
    {
      name: "Medicine Stock",
      href: "/doctor/medicine",
      icon: Pill,
      current: false,
    },
    {
      name: "Prescriptions",
      href: "/doctor/prescriptions",
      icon: FilePlus,
      current: false,
    },
  ];

  // Sample upcoming appointments data (you can replace with API data)
  const upcomingAppointments = [
    {
      id: 1,
      time: "09:00 AM",
      patient: "Alice Johnson",
      reason: "Routine Checkup",
      status: "confirmed",
    },
    {
      id: 2,
      time: "10:30 AM",
      patient: "Bob Smith",
      reason: "Follow-up",
      status: "pending",
    },
    {
      id: 3,
      time: "01:00 PM",
      patient: "Carol Williams",
      reason: "Consultation",
      status: "confirmed",
    },
  ];

  // Sample recent patients data
  const recentPatients = [
    {
      id: 1,
      name: "Alice Johnson",
      age: 32,
      condition: "Flu",
      lastVisit: "2025-04-10T09:00:00Z",
    },
    {
      id: 2,
      name: "Bob Smith",
      age: 45,
      condition: "Back Pain",
      lastVisit: "2025-04-09T14:30:00Z",
    },
    {
      id: 3,
      name: "Carol Williams",
      age: 28,
      condition: "Headache",
      lastVisit: "2025-04-08T11:00:00Z",
    },
  ];
  return (
    <main className="min-h-screen flex flex-col p-8 py-12">
      <p className="text-4xl font-semibold">
        Hi <span>{auth.userName}</span>
      </p>
      <BrowserRouter>
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-y-auto bg-white/60 p-6">
          {/* Optional: Place children content (for additional wrappers or headers) */}
          {children}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Patients Today"
              value="8"
              icon={Users}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Upcoming Appointments"
              value="12"
              icon={Calendar}
              trend={{ value: 2, isPositive: true }}
            />
            <StatCard title="Unread Messages" value="5" icon={MessageSquare} />
            <StatCard title="Pending Prescriptions" value="3" icon={FilePlus} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Schedule */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="outline">View Full Schedule</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                          <th className="pb-2 font-medium">Time</th>
                          <th className="pb-2 font-medium">Patient</th>
                          <th className="pb-2 font-medium">Reason</th>
                          <th className="pb-2 font-medium">Status</th>
                          <th className="pb-2 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingAppointments.map((appointment) => (
                          <tr
                            key={appointment.id}
                            className="border-b last:border-b-0"
                          >
                            <td className="py-3 text-sm">
                              <span className="font-medium">
                                {appointment.time}
                              </span>
                            </td>
                            <td className="py-3 text-sm font-medium">
                              {appointment.patient}
                            </td>
                            <td className="py-3 text-sm text-gray-600">
                              {appointment.reason}
                            </td>
                            <td className="py-3 text-sm">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  appointment.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {appointment.status === "confirmed"
                                  ? "Confirmed"
                                  : "Pending"}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Patients */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Patients</CardTitle>
                    <CardDescription>Last visited patients</CardDescription>
                  </div>
                  <Button variant="outline">View All Patients</Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                          <th className="pb-2 font-medium">Patient</th>
                          <th className="pb-2 font-medium">Age</th>
                          <th className="pb-2 font-medium">Condition</th>
                          <th className="pb-2 font-medium">Last Visit</th>
                          <th className="pb-2 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPatients.map((patient) => (
                          <tr
                            key={patient.id}
                            className="border-b last:border-b-0"
                          >
                            <td className="py-3 text-sm font-medium">
                              {patient.name}
                            </td>
                            <td className="py-3 text-sm">{patient.age}</td>
                            <td className="py-3 text-sm text-gray-600">
                              {patient.condition}
                            </td>
                            <td className="py-3 text-sm">
                              {new Date(patient.lastVisit).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-sm text-right">
                              <Button variant="ghost" size="sm">
                                Records
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Start Med AI Chat
                  </Button>
                  <Button
                    className="w-full flex items-center gap-2"
                    variant="outline"
                  >
                    <Users className="h-4 w-4" /> Join Medical Forum
                  </Button>
                  <Button
                    className="w-full flex items-center gap-2"
                    variant="outline"
                  >
                    <FilePlus className="h-4 w-4" /> Create Prescription
                  </Button>
                  <Button
                    className="w-full flex items-center gap-2"
                    variant="outline"
                  >
                    <Calendar className="h-4 w-4" /> Update Schedule
                  </Button>
                </CardContent>
              </Card>

              {/* Medicine Stock Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Medicine Stock Alerts</CardTitle>
                  <CardDescription>Low inventory items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium">Amoxicillin 500mg</p>
                        <p className="text-sm text-red-500">Running low</p>
                      </div>
                      <span className="text-sm font-mono bg-red-50 text-red-600 px-2 py-1 rounded-md">
                        5 left
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium">Ibuprofen 200mg</p>
                        <p className="text-sm text-yellow-500">Low stock</p>
                      </div>
                      <span className="text-sm font-mono bg-yellow-50 text-yellow-600 px-2 py-1 rounded-md">
                        12 left
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium">Epinephrine 0.3mg</p>
                        <p className="text-sm text-red-500">Critical</p>
                      </div>
                      <span className="text-sm font-mono bg-red-50 text-red-600 px-2 py-1 rounded-md">
                        2 left
                      </span>
                    </div>

                    <Button variant="outline" className="w-full">
                      Request Restock
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* New Patient Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>New Patient Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">John Smith</p>
                        <span className="text-xs text-gray-500">10:23 AM</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        I've been experiencing some side effects from the...
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">Maria Garcia</p>
                        <span className="text-xs text-gray-500">Yesterday</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        Can we reschedule my appointment next week to...
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">David Lee</p>
                        <span className="text-xs text-gray-500">Yesterday</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        Thank you for the prescription. My blood sugar has...
                      </p>
                    </div>

                    <Button variant="outline" className="w-full">
                      View All Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </main>
  );
}
