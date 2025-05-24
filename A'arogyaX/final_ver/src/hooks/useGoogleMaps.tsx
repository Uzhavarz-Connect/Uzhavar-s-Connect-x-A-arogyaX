"use client";

export default function useGoogleMaps() {
  const baseURL = "https://maps.googleapis.com/maps/api/";
  const key = "AIzaSyBlJfGgpP2kN06cTUkpcY1VZLsflD2_ux0";
  const defaultFetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const getLocationByAddress = async (loc: string) => {
    const params = new URLSearchParams({
      address: loc,
      key: key,
    });
    const response = await fetch(
      `${baseURL}geocode/json?address=${params}`,
      defaultFetchOptions
    );
    const data = await response.json();
    return [
      data.results[0]["geometry"]["location"]["lat"],
      data.results[0]["geometry"]["location"]["lng"],
    ];
  };
  //   const getNearByPlaces = async (
  //     coords: number[],
  //     keyword: string,
  //     radius = 500
  //   ) => {
  //     try {
  //       const response = await axios.get("place/nearbysearch/json", {
  //         params: { location: coords.join(","), keyword, radius },
  //       });
  //       console.log(response.data);
  //       return JSON.parse(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  return { getLocationByAddress };
}
