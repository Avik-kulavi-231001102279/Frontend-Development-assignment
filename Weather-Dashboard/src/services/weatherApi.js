const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Fetch current weather data using latitude and longitude
 */
export const getWeatherByCoords = async (lat, lon) => {
  if (!API_KEY) throw new Error("API Key is missing. Please set VITE_OPENWEATHER_API_KEY in .env");
  
  try {
    // Current Weather
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
      if (response.status === 401) throw new Error("Invalid API key or API key not activated.");
      if (response.status === 404) throw new Error("Location not found.");
      throw new Error(`API request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather by coords:", error);
    if (error.name === 'TypeError') throw new Error("Network error. Please check your internet connection.");
    throw error;
  }
};

/**
 * Fetch current weather data using city name
 */
export const getWeatherByCity = async (cityName) => {
  if (!API_KEY) throw new Error("API Key is missing. Please set VITE_OPENWEATHER_API_KEY in .env");

  try {
    // 1. Get coordinates from city name using Geocoding API
    const geoResponse = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) {
      if (geoResponse.status === 401) throw new Error("Invalid API key or API key not activated.");
      throw new Error(`API request failed: ${geoResponse.statusText}`);
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      throw new Error("City not found. Please check the spelling and try again.");
    }
    
    const { lat, lon, name, state, country } = geoData[0];
    
    // 2. Get weather data using those coordinates
    const weatherData = await getWeatherByCoords(lat, lon);
    
    // Merge the better formatted name from geocoding with the weather data
    return {
      ...weatherData,
      formattedName: `${name}${state ? `, ${state}` : ''}, ${country}`
    };
  } catch (error) {
    console.error("Error fetching weather by city:", error);
    if (error.name === 'TypeError') throw new Error("Network error. Please check your internet connection.");
    throw error;
  }
};
