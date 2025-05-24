"use client";
import { UserDetails } from "@/contexts/DataContext";
import useAuthContext from "@/hooks/useAuthContext";
import useDataContext from "@/hooks/useDataContext";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const data = useDataContext();
  const auth = useAuthContext();
  const [userDetails, setUserDetails] = useState<UserDetails>();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!auth.userId) return;
      const res = await data.getUserDetails!(auth.userId);
      if (res) setUserDetails(res);
    };
    fetchDetails();
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col p-24 gap-4">
      <p className="text-4xl font-semibold">My Profile</p>
      <hr className="w-full border-zinc-400/50" />
      <div className="p-4 text-lg flex flex-col gap-8">
        <div>
          <p className="font-semibold">Name:</p>
          <p className="text-3xl">{userDetails?.name}</p>
        </div>
        <div>
          <p className="font-semibold">Phone:</p>
          <p className="text-3xl">{userDetails?.phone}</p>
        </div>
        <div>
          <p className="font-semibold">Location:</p>
          <p className="text-3xl">{userDetails?.location}</p>
        </div>
        <div>
          <p className="font-semibold">Blood Group:</p>
          <p className="text-3xl">{userDetails?.bloodGroup}</p>
        </div>
      </div>
    </main>
  );
}
