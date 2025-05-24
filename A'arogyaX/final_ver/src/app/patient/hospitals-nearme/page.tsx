"use client";
import ServerHandler from "@/lib/server-handler";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<any>();

  useEffect(() => {
    const fetchNearByPlaces = async () => {
      if (window) {
        window.navigator.geolocation.getCurrentPosition(async (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          const places = await ServerHandler.getNearbyPlacesByLocation(
            coords.join(","),
            "hospital"
          );

          setPlaces(places);
        });
      }
    };
    fetchNearByPlaces();
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col p-24 gap-4">
      <p className="text-4xl font-semibold">Hospitals Near Me</p>
      <hr className="w-full border-zinc-400/50" />
      <div className="grid grid-cols-3">
        <div className="p-4 text-lg flex flex-col gap-8 overflow-y-auto">
          {places.length > 0 ? (
            places.map((place, index) => (
              <div
                key={index}
                className="flex flex-col gap-2"
                onClick={() => {
                  const data = ServerHandler.getNearbyPlacesDetailsById(
                    place.place_id
                  );
                  console.log(data);
                  setSelectedPlaceDetails(data);
                }}
              >
                <p className="text-xl font-semibold">{place.name}</p>
                <p className="text-gray-800 text-sm">{place.vicinity}</p>
                <p className="text-gray-800 text-sm">
                  Rating: {place.rating} ({place.user_ratings_total} ratings)
                </p>
              </div>
            ))
          ) : (
            <p className="text-2xl animate-pulse">Loading...</p>
          )}
        </div>
      </div>
    </main>
  );
}
