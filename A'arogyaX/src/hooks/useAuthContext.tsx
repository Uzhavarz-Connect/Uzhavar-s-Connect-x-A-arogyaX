import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function useAuthContext() {
  return useContext(AuthContext);
}
