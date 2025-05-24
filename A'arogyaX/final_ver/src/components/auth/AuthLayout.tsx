
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  role?: "doctor" | "patient" | "receptionist" | "warehouse" | "admin";
}

export function AuthLayout({ title, subtitle, children, role }: AuthLayoutProps) {
  const getBgGradient = () => {
    const gradients = {
      doctor: "from-medical-blue to-blue-700",
      patient: "from-medical-green to-green-700",
      receptionist: "from-medical-gold to-yellow-500",
      warehouse: "from-gray-600 to-gray-700",
      admin: "from-medical-red to-red-700"
    };
    
    return role ? gradients[role] : "from-medical-blue to-blue-700";
  };
  
  const getRoleName = () => {
    const roleNames = {
      doctor: "Doctor",
      patient: "Patient",
      receptionist: "Receptionist",
      warehouse: "Warehouse Manager",
      admin: "Administrator"
    };
    
    return role ? roleNames[role] : "";
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Gradient */}
      <div className={`hidden md:block md:w-1/2 bg-gradient-to-br ${getBgGradient()} p-12 text-white`}>
        <Link to="/" className="flex items-center gap-2">
          <img src="/placeholder.svg" alt="HealthVerse Logo" className="h-8 w-8 invert" />
          <span className="text-xl font-bold">HealthVerse</span>
        </Link>
        
        <div className="mt-32 max-w-md mx-auto">
          <h1 className="text-4xl font-bold">Healthcare Connected</h1>
          <p className="mt-6 text-lg">
            Streamlining medical operations and improving patient care through technology.
          </p>
          
          {role && (
            <div className="mt-8 p-4 border border-white/20 rounded-lg bg-white/10 backdrop-blur">
              <h3 className="font-medium text-lg">
                {getRoleName()} Portal
              </h3>
              <p className="mt-2 text-sm opacity-80">
                Access your specialized tools and dashboards designed specifically for your role.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="md:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/placeholder.svg" alt="HealthVerse Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-medical-blue">HealthVerse</span>
            </Link>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}
            </p>
          </div>
          
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
