import { Droplets, Wind, Gauge, Eye, Cloud } from 'lucide-react';

const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed;
  const pressure = weather.main.pressure;
  const visibility = (weather.visibility / 1000).toFixed(1); // convert to km
  const cloudiness = weather.clouds.all;

  return (
    <div className="weather-details-grid">
      <div className="detail-item">
        <Droplets className="detail-icon" size={24} />
        <div className="detail-info">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{humidity}%</span>
        </div>
      </div>
      <div className="detail-item">
        <Wind className="detail-icon" size={24} />
        <div className="detail-info">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{windSpeed} m/s</span>
        </div>
      </div>
      <div className="detail-item">
        <Gauge className="detail-icon" size={24} />
        <div className="detail-info">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{pressure} hPa</span>
        </div>
      </div>
      <div className="detail-item">
        <Eye className="detail-icon" size={24} />
        <div className="detail-info">
          <span className="detail-label">Visibility</span>
          <span className="detail-value">{visibility} km</span>
        </div>
      </div>
      <div className="detail-item">
        <Cloud className="detail-icon" size={24} />
        <div className="detail-info">
          <span className="detail-label">Cloudiness</span>
          <span className="detail-value">{cloudiness}%</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
