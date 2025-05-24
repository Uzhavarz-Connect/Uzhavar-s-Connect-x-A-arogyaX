
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: "doctor" | "patient" | "receptionist" | "warehouse" | "admin";
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleStyles = {
    doctor: "bg-medical-blue text-white",
    patient: "bg-medical-green text-white",
    receptionist: "bg-medical-gold text-black",
    warehouse: "bg-gray-600 text-white",
    admin: "bg-medical-red text-white"
  };

  const roleLabels = {
    doctor: "Doctor",
    patient: "Patient",
    receptionist: "Receptionist",
    warehouse: "Warehouse",
    admin: "Admin"
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 text-xs font-medium rounded-full", 
      roleStyles[role],
      className
    )}>
      {roleLabels[role]}
    </span>
  );
}
