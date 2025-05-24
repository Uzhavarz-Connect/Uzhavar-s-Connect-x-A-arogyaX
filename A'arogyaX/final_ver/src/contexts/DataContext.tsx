"use client";
import { createContext } from "react";
import { createClient } from "@supabase/supabase-js";

export type User = { uid: number; email?: string; role: string; name: string };
export type Doctor = {
  specialization: string;
  h_name: string;
} & User;

type DataContextType = any;
export const DataContext = createContext<DataContextType>({});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getUserById = async (userId: number) => {
    const { data, error } = await supabase
      .from("users")
      .select("uid, name, role")
      .eq("uid", userId)
      .single();

    if (error) {
      console.error("DBE:", error.message);
      return null;
    }
    return data;
  };

  const sendDPMessage = async (
    senderId: number,
    receiverId: number,
    sender: string,
    content: string
  ) => {
    sender = sender.toLowerCase();
    const { error } = await supabase.from("doctor_patient_chat").insert({
      doctor_id: sender === "doctor" ? senderId : receiverId,
      patient_id: sender === "doctor" ? receiverId : senderId,
      content,
      sender_type: sender,
    });
    console.log(error);
  };

  const getMessagesByUserId = async (
    currUserId: number,
    otherUserId: number,
    currRole: string
  ) => {
    const { data, error } = await supabase
      .from("doctor_patient_chat")
      .select(
        "doctor_id, patient_id,content, sender_type, doctors ( users (name) ), patients ( users (name)  )"
      )
      .eq(currRole === "doctor" ? "doctor_id" : "patient_id", currUserId)
      .eq(currRole === "doctor" ? "patient_id" : "doctor_id", otherUserId);

    if (error) {
      console.error("DBE:", error.message);
      return null;
    }
    console.log("DBE:", data);

    return data.map((msg) => ({
      sender: msg.sender_type,
      message: msg.content,
      doctorId:
        msg.sender_type === "doctor"
          ? msg.doctors?.name || "Doctor"
          : msg.patients?.name || "Patient",
    }));
  };

  const getUserDetails = async (userId: number) => {
    const { data, error } = await supabase
      .from("users")
      .select("name, user_details(location, phone, blood_group)")
      .eq("uid", userId)
      .single();

    if (error) {
      console.error("DBE:", error.message);
      return null;
    }

    return {
      name: data.name,
      location: data.user_details.location,
      phone: data.user_details.phone,
      bloodGroup: data.user_details.blood_group,
    };
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("uid, name, role")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error) {
      console.error("DBE:", error.message);
      return null;
    }
    return { ...data, email };
  };

  const logout = async () => {};

  return (
    <DataContext.Provider
      value={{
        getUserById,
        sendDPMessage,
        getMessagesByUserId,
        getUserDetails,
        login,
        logout,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
