import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function ThemeToggle({
  variant = "icon",
}: {
  variant?: "icon" | "switch";
}) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering after component mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (variant === "switch") {
    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="theme-mode"
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
        />
        <Label htmlFor="theme-mode" className="text-sm">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </Label>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
