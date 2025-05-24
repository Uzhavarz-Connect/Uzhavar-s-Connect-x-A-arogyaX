"use client";
import { createContext, useEffect } from "react";
import useDataContext from "@/hooks/useDataContext";
import { useState } from "react";

type AuthContextType = {
  userId?: number;
  userName?: string;
  role?: string;
  login?: (email: string, password: string) => Promise<{ role: string } | null>;
  logout?: () => void;
};

export const AuthContext = createContext<AuthContextType>({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const data = useDataContext();
  const [userId, setUserId] = useState<number>();
  const [userName, setUserName] = useState<string>();
  const [role, setRole] = useState<string>();

  useEffect(() => {
    if (userId && !userName) {
      const fetchUser = async () => {
        const res = await data.getUserById!(userId);
        if (!res) return;
        setUserName(res.name);
        setRole(res.role);
      };
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const result = await data.login!(email, password);
    if (!result) {
      console.error("Login failed");
      return null;
    }
    setUserName(result.name);
    setRole(result.role);
    setUserId(result.uid);

    localStorage.setItem("userId", result.uid.toString());
    return result;
  };

  const logout = () => {
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ userId, userName, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
