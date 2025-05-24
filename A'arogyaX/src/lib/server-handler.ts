export default class ServerHandler {
  private static baseUrl = "http://172.16.44.151:5000";
  private static defaultFetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  static async getMedbotSessionId() {
    const response = await fetch(
      `${ServerHandler.baseUrl}/medchat/new`,
      ServerHandler.defaultFetchOptions
    );
    const data = await response.json();
    return data.sessionId;
  }
  static async sendMedbotMessage(sessionId: string, msg: string) {
    const response = await fetch(`${ServerHandler.baseUrl}/medchat/send`, {
      ...ServerHandler.defaultFetchOptions,
      method: "POST",
      body: JSON.stringify({ sessionId, msg }),
    });
    const data = await response.json();
    return data.result;
  }
  static async closeMedbot(sessionId: string) {
    await fetch(`${ServerHandler.baseUrl}/medchat/close`, {
      ...ServerHandler.defaultFetchOptions,
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
  }
  static async getTextFromSpeech(audio: string) {
    const response = await fetch(`${ServerHandler.baseUrl}/speechttext`, {
      ...ServerHandler.defaultFetchOptions,
      method: "POST",
      body: JSON.stringify({ audio }),
    });
    const data = await response.json();
    return data.text as string;
  }
  static async getNearbyPlacesByLocation(location: string, place: string) {
    const params = new URLSearchParams({
      location,
      place,
    });
    const response = await fetch(
      `${ServerHandler.baseUrl}/gmaps/nearbyplaces?${params}`,
      {
        ...ServerHandler.defaultFetchOptions,
        method: "GET",
      }
    );
    const data = await response.json();
    return data.results;
  }
  static async getNearbyPlacesDetailsById(placeId: string) {
    const params = new URLSearchParams({
      place_id: placeId,
    });
    const response = await fetch(
      `${ServerHandler.baseUrl}/gmaps/nearbyplaces/details?${params}`,
      {
        ...ServerHandler.defaultFetchOptions,
        method: "GET",
      }
    );
    const data = await response.json();
    return data;
  }
}
