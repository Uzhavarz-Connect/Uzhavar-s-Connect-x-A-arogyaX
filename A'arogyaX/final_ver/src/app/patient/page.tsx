"use client";
import HealthBodyConditionCard from "@/components/health-body-condition";
import HealthVitalCard from "@/components/health-vital-card";
import HumanAton from "@/components/human-aton";
import useAuthContext from "@/hooks/useAuthContext";
import {
  ArrowBigRight,
  ArrowRight,
  Bell,
  CalendarPlus,
  MessageSquarePlus,
  Pencil,
  PillBottle,
  ScanQrCode,
  Search,
  SquareLibrary,
  TestTubeDiagonal,
  View,
  X,
} from "lucide-react";
import { useState } from "react";

const data = {
  heart: {
    status: "warning",
    metrics: {
      bloodStatus: {
        value: 102,
        unit: "/70",
        status: "warning",
      },
      bloodCount: {
        value: 64,
        unit: "/80",
        status: "normal",
        trend: [60, 62, 63, 64, 63, 64],
      },
      cholesterol: {
        value: 180,
        unit: "mg/dl",
        status: "normal",
      },
    },
  },
  liver: {
    status: "normal",
    metrics: {
      enzymes: {
        value: 35,
        unit: "U/L",
        status: "normal",
      },
      bilirubin: {
        value: 0.8,
        unit: "mg/dL",
        status: "normal",
      },
    },
  },
  lungs: {
    status: "normal",
    metrics: {
      oxygenLevel: {
        value: 98,
        unit: "%",
        status: "normal",
      },
      respiratoryRate: {
        value: 16,
        unit: "bpm",
        status: "normal",
      },
    },
  },
  kidneys: {
    status: "normal",
    metrics: {
      filtrationRate: {
        value: 90,
        unit: "mL/min",
        status: "normal",
      },
      creatinine: {
        value: 0.9,
        unit: "mg/dL",
        status: "normal",
      },
    },
  },
  brain: {
    status: "normal",
    metrics: {
      brainActivity: {
        value: 60,
        unit: "Hz",
        status: "normal",
      },
      stressLevel: {
        value: 35,
        unit: "%",
        status: "normal",
      },
    },
  },
};

const medications = [
  {
    id: 1,
    name: "Lisinopril 10mg",
    schedule: "Once daily",
    time: "8:00 AM",
    taken: true,
  },
  {
    id: 2,
    name: "Atorvastatin 20mg",
    schedule: "Once daily",
    time: "9:00 PM",
    taken: false,
  },
  {
    id: 3,
    name: "Metformin 500mg",
    schedule: "Twice daily",
    time: "12:00 PM, 9:00 PM",
    taken: false,
  },
  {
    id: 4,
    name: "Zeptamin 50mg",
    schedule: "Twice daily",
    time: "10:00 AM, 8:00 PM",
    taken: false,
  },
];

// Get organ icon
const getOrganIcon = (organ: string) => {
  switch (organ) {
    case "heart":
      return "❤️";
    case "brain":
      return "🧠";
    case "lungs":
      return "🫁";
    case "liver":
      return "🫀";
    case "kidneys":
      return "🟤";
    default:
      return "";
  }
};
// Get organ icon
const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "text-green-700";
    case "warning":
      return "text-amber-700";
    default:
      return "";
  }
};

function camelToSentence(str: string) {
  return str.replace(/([A-Z])/g, " $1").toLowerCase();
}

export default function Home() {
  const auth = useAuthContext();
  const [selectedOrgan, setSelectedOrgan] = useState<string>();
  return (
    <main className="flex-grow w-full m-8 mx-10 rounded-3xl flex flex-col p-8 gap-4 overflow-y-auto">
      <div className="flex items-center pt-2 pb-8 gap-2">
        <p className="text-4xl font-semibold">Hello, {auth.userName}!</p>
        <div className="flex-grow"></div>
        <div className="flex items-center bg-white/30 rounded-full">
          <input
            type="text"
            className="placeholder:text-zinc-600 focus:outline-0 pl-3 min-w-[25dvw]"
            placeholder="Search"
          />
          <button className="w-12 h-12 flex items-center justify-center cursor-pointer">
            <Search />
          </button>
        </div>
        <button className="w-12 h-12 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer">
          <Bell />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-6 px-6 py-2 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl">
            <div className="bg-green-200 p-2 rounded-full text-green-900">
              <CalendarPlus />
            </div>
            <p className="text-lg font-semibold">Schedule Appointment</p>
          </div>
          <div className="flex items-center gap-6 px-4 py-4 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl">
            <div className="bg-amber-200 p-2 rounded-full text-amber-900">
              <ScanQrCode />
            </div>
            <p className="text-lg font-semibold">Scan Prescription QR</p>
          </div>
          <div className="flex items-center gap-6 px-4 py-4 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl">
            <div className="bg-blue-200 p-2 rounded-full text-blue-900">
              <MessageSquarePlus />
            </div>
            <p className="text-lg font-semibold">Message Doctor</p>
          </div>
          <div className="flex items-center gap-6 px-4 py-4 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl">
            <div className="bg-violet-200 p-2 rounded-full text-violet-900">
              <SquareLibrary />
            </div>
            <p className="text-lg font-semibold">View Health Records</p>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-2xl font-semibold">Health Records</p>
        <div className="flex-grow"></div>
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <HealthVitalCard
          className="p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
          type="temperature"
          title="Temperature"
          value={98.3}
          unit="°F"
          status="normal"
          trend={[98.1, 98.2, 97.1, 97.4, 98.5]}
        />
        <HealthVitalCard
          className="p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
          type="heartRate"
          title="Heart Rate"
          value={80}
          unit="bpm"
          status="normal"
          trend={[80, 85, 100, 90, 95]}
        />
        <HealthVitalCard
          className="p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
          type="glucose"
          title="Glucose Level"
          value={182}
          unit="mg/dl"
          status="normal"
          trend={[220, 182, 190, 200, 210]}
        />
      </div>
      <div className="flex gap-6 p-4">
        <div className="flex flex-col items-stretch flex-grow gap-6">
          <div className="grid grid-cols-2 col-span-2 gap-4">
            <HealthBodyConditionCard
              className="p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
              type="weight"
              title="Weight"
              value={69.1}
              subtitle={`Last: ${70.2} Kg`}
              unit={"Kg"}
            />
            <HealthBodyConditionCard
              className="p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
              type="sleep"
              title="Sleep time"
              value={7}
              subtitle={`${"00:30"} - ${"08:00"}`}
              unit={"hours"}
            />
          </div>

          <div className="grid grid-cols-2 col-span-2 gap-4">
            <HealthBodyConditionCard
              className="p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
              type="activity"
              title="Activity"
              value={7425}
              subtitle={`${7425}/${10000} ${"steps"}`}
              unit={"steps"}
              progress={(7425 / 10000) * 100}
            />
            <HealthBodyConditionCard
              className="p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
              type="food"
              title="Food"
              value={253}
              subtitle={`${253}/${1300} kcal`}
              unit={"kcal"}
              progress={(253 / 1300) * 100}
            />
          </div>

          <div className="flex flex-col bg-gradient-to-br from-cyan-800/70 to-blue-800/70 text-white h-fit p-4 rounded-xl gap-2  hover:shadow-xl shadow-sm">
            <p className="font-semibold">Reset & Relax</p>
            <p>
              Take a moment to unwind and recharge with guided meditation,
              breathing exercises, and mindfulness tips.
            </p>
            <button className="font-semibold from-cyan-100 to-blue-100 bg-gradient-to-br text-blue-800/90 self-start px-6 py-1 rounded-lg">
              Track My Mood
            </button>
          </div>
        </div>
        <HumanAton onSelect={(organ) => setSelectedOrgan(organ)} />
      </div>
      {selectedOrgan ? (
        <div
          className={`absolute inset-0 m-5 rounded-4xl p-8 bg-slate-200  backdrop-blur-sm z-10 flex gap-6 flex-col items-stretch`}
        >
          <button
            className="flex items-center justify-center absolute top-4 right-4 w-12 h-12 hover:bg-white/20 rounded-full cursor-pointer"
            onClick={() => setSelectedOrgan(undefined)}
          >
            <X />
          </button>
          <div className="flex items-stretch gap-6">
            <div className="flex flex-col p-4 gap-4 bg-white rounded-2xl">
              {Object.keys(data).map((v, i) => {
                return (
                  <button
                    key={i}
                    className={`flex flex-col items-center py-4 px-6 hover:shadow-xl shadow-sm border border-zinc-400/40 transition-all rounded-2xl ${
                      selectedOrgan === v
                        ? "bg-blue-800 text-white"
                        : " bg-white text-black"
                    }`}
                    onClick={() => setSelectedOrgan(v)}
                  >
                    <p className="w-8 h-8 text-lg flex items-center justify-center bg-blue-200 rounded-full">
                      {getOrganIcon(v)}
                    </p>
                    <p className="text-lg font-semibold capitalize">{v}</p>
                    <p className="text-sm capitalize">{data[v].status}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-8 p-4">
              <div className="col-span-6">
                <p className="text-4xl font-semibold capitalize">
                  {selectedOrgan}
                </p>
                <p className="text-xl capitalize text-zinc-700">Details</p>
              </div>
              <div className="col-span-5 row-span-2 flex items-center gap-6">
                {Object.keys(
                  data[selectedOrgan as keyof typeof data].metrics
                ).map((v, i) => {
                  return (
                    <div
                      key={i}
                      className="p-4 flex flex-col gap-10 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
                    >
                      <div className="flex items-center gap-10">
                        <p className="capitalize">{camelToSentence(v)}</p>
                        <p
                          className={`capitalize text-xs ${getStatusColor(
                            data[selectedOrgan as keyof typeof data].metrics[v]
                              .status
                          )}`}
                        >
                          {
                            data[selectedOrgan as keyof typeof data].metrics[v]
                              .status
                          }
                        </p>
                      </div>
                      <p className="text-4xl font-semibold capitalize">
                        {
                          data[selectedOrgan as keyof typeof data].metrics[v]
                            .value
                        }
                        <span className="text-lg text-zinc-500">
                          {
                            data[selectedOrgan as keyof typeof data].metrics[v]
                              .unit
                          }
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="flex items-center">
        <p className="text-2xl font-semibold">My Medications</p>
        <div className="flex-grow"></div>
        <button className="flex items-center px-4 py-2 gap-4 border border-zinc-400/40 rounded-xl">
          <p className="flex items-center gap-2">View All Medications</p>
          <View className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-4 gap-4">
          {medications.map((med) => {
            return (
              <div
                key={med.id}
                className="p-6 hover:shadow-xl shadow-sm border flex flex-col border-zinc-400/40 bg-white/20 transition-all rounded-2xl"
              >
                <div
                  className={`w-full h-1 rounded-full mb-4 ${
                    med.taken ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <p className="text-lg font-semibold">{med.name}</p>
                <p className="text-sm text-zinc-700">{med.schedule}</p>
                <p className="text-sm text-zinc-700">{med.time}</p>
                {!med.taken ? (
                  <button className="mt-4 w-fit py-1 px-2 text-base self-end rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-all">
                    Take Now
                  </button>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-2xl font-semibold">My Upcoming Reminders</p>
        <div className="flex-grow"></div>
        <button className="flex items-center px-4 py-2 gap-4 border border-zinc-400/40 rounded-xl">
          <p className="flex items-center gap-2">Manage Reminders</p>
          <Pencil className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-6 p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl">
            <div className="bg-amber-200 p-2 rounded-full text-amber-900">
              <PillBottle />
            </div>
            <div>
              <p className="text-lg font-semibold">Zeptamin 50mg</p>
              <p className="text-sm text-zinc-700">Today at 10:00 AM</p>
            </div>
          </div>
          {/* <div className="flex items-center gap-6 p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl">
            <div className="bg-red-200 p-2 rounded-full text-red-900">
              <TestTubeDiagonal />
            </div>
            <div>
              <p className="text-lg font-semibold">Metformin 500mg</p>
              <p className="text-sm text-zinc-700">Tommorow at 12:00 PM</p>
            </div>
          </div> */}
          <div className="flex items-center gap-6 p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl">
            <div className="bg-blue-200 p-2 rounded-full text-blue-900">
              <Bell />
            </div>
            <div>
              <p className="text-lg font-semibold">Cardiology Appointment</p>
              <p className="text-sm text-zinc-700">April 15 at 3:30 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-6 p-6 hover:shadow-xl shadow-sm border border-zinc-400/40 bg-white/20 transition-all rounded-2xl">
            <div className="bg-red-200 p-2 rounded-full text-red-900">
              <TestTubeDiagonal />
            </div>
            <div>
              <p className="text-lg font-semibold">Blood Pressure Check</p>
              <p className="text-sm text-zinc-700">Tommorow at 8:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
