import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img src="/placeholder.svg" alt="HealthVerse Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-primary">HealthVerse</span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className="px-3 py-2 text-foreground hover:text-primary">Home</Link>
            <Link to="/about" className="px-3 py-2 text-foreground hover:text-primary">About</Link>
            <Link to="/features" className="px-3 py-2 text-foreground hover:text-primary">Features</Link>
            <Link to="/contact" className="px-3 py-2 text-foreground hover:text-primary">Contact</Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Portals <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/login/doctor" className="w-full">Doctor Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login/patient" className="w-full">Patient Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login/staff" className="w-full">Staff Portal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login/admin" className="w-full">Admin Portal</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <Button asChild className="ml-2">
              <Link to="/login">Login</Link>
            </Button>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button
              className="p-2 rounded-md text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">Home</Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">About</Link>
            <Link to="/features" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">Features</Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary">Contact</Link>
            
            <div className="py-2 flex items-center justify-between">
              <span className="px-3 text-sm font-medium">Dark Mode</span>
              <div className="px-3">
                <ThemeToggle variant="switch" />
              </div>
            </div>
            
            <Link to="/login" className="block px-3 py-2 text-base font-medium text-primary">Login</Link>
            
            <div className="pt-2 border-t border-gray-200">
              <p className="px-3 py-2 text-sm font-medium text-gray-500">Portals</p>
              <Link to="/login/doctor" className="block px-5 py-2 text-base font-medium text-gray-700 hover:text-medical-blue">Doctor Portal</Link>
              <Link to="/login/patient" className="block px-5 py-2 text-base font-medium text-gray-700 hover:text-medical-blue">Patient Portal</Link>
              <Link to="/login/staff" className="block px-5 py-2 text-base font-medium text-gray-700 hover:text-medical-blue">Staff Portal</Link>
              <Link to="/login/admin" className="block px-5 py-2 text-base font-medium text-gray-700 hover:text-medical-blue">Admin Portal</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
