import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherDetails from './components/WeatherDetails';
import SunInfo from './components/SunInfo';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import WeatherBackground from './components/WeatherBackground';
import { getWeatherByCoords, getWeatherByCity } from './services/weatherApi';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError('');
      const data = await getWeatherByCoords(lat, lon);
      setWeatherData(data);
      setLocationName(data.name);
    } catch (err) {
      setError(err.message || 'Unable to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (city) => {
    try {
      setLoading(true);
      setError('');
      const data = await getWeatherByCity(city);
      setWeatherData(data);
      setLocationName(data.formattedName || data.name);
    } catch (err) {
      setError(err.message || 'Unable to fetch weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please search manually.');
      return;
    }

    setLoading(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setLoading(false);
        setError('Location access was denied. Search for a city to view weather.');
      }
    );
  };

  useEffect(() => {
    handleGetLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weatherCode = weatherData?.weather[0]?.id || 800;
  const iconCode = weatherData?.weather[0]?.icon || '01d';
  const isNight = iconCode.endsWith('n');

  return (
    <WeatherBackground weatherCode={weatherCode} isNight={isNight}>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>🌦 Weather Dashboard</h1>
          {locationName && !loading && !error && (
            <h2 className="location-title">📍 {locationName}</h2>
          )}
        </header>

        <main className="dashboard-main">
          <div className="search-section">
            <SearchBar onSearch={handleSearch} />
          </div>

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && weatherData && (
            <div className="weather-content">
              <h3 className="section-title">Current Weather</h3>
              <WeatherCard weather={weatherData} />
              
              <div className="divider"></div>
              
              <WeatherDetails weather={weatherData} />
              
              <div className="divider"></div>
              
              <SunInfo weather={weatherData} />
            </div>
          )}
        </main>

        <footer className="dashboard-footer">
          <p>Weather Dashboard</p>
          <p>Powered by OpenWeatherMap API</p>
        </footer>
      </div>
    </WeatherBackground>
  );
}

export default App;
