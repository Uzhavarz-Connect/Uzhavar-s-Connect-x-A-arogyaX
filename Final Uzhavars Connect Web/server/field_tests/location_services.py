import geocoder
import requests
from typing import Tuple, Dict


def get_location_services():
    """Independent location services with Google Geocoding"""

    def get_current_location() -> Tuple[float, float]:
        """Get current location using IP geolocation"""
        try:
            g = geocoder.ip('me')
            if g.ok:
                return g.latlng[0], g.latlng[1]
            else:
                print("Could not determine location automatically")
                # Default to New Delhi coordinates
                return 28.6139, 77.2090
        except Exception as e:
            print(f"Error getting current location: {e}")
            return 28.6139, 77.2090

    def get_location_info(lat: float, lon: float) -> Dict:
        """Get detailed location information using Google Geocoding API"""
        try:
            api_key = 'AIzaSyBfd1bm_3mxeU8VhNwt2GE9-h0BtMT2Sv4'
            url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                'latlng': f"{lat},{lon}",
                'key': api_key
            }

            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                if data['results']:
                    return {
                        'formatted_address': data['results'][0]['formatted_address'],
                        'components': data['results'][0]['address_components']
                    }
            return {'formatted_address': f"Lat: {lat}, Lon: {lon}", 'components': []}
        except Exception as e:
            print(f"Error getting location info: {e}")
            return {'formatted_address': f"Lat: {lat}, Lon: {lon}", 'components': []}

    # Main execution
    lat, lon = get_current_location()
    location_info = get_location_info(lat, lon)

    output_lines = []
    output_lines.append(f"📍 Current Location: {lat:.4f}, {lon:.4f}")
    output_lines.append(f"📍 Address: {location_info['formatted_address']}")
    return "\n".join(output_lines)
    print(f"📍 Current Location: {lat:.4f}, {lon:.4f}")
    print(f"📍 Address: {location_info['formatted_address']}")

    return {
        'latitude': lat,
        'longitude': lon,
        'address': location_info['formatted_address'],
        'components': location_info['components']
    }


# Run the function
if __name__ == "__main__":
    result = get_location_services()
    print(f"Location Data: {result}")
