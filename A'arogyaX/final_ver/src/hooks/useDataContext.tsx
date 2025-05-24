import { DataContext } from "@/contexts/DataContext";
import { useContext } from "react";

export default function useDataContext() {
  return useContext(DataContext);
}
