import { Sunrise, Sunset } from 'lucide-react';

const SunInfo = ({ weather }) => {
  if (!weather || !weather.sys) return null;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="sun-info-container">
      <div className="sun-item">
        <Sunrise size={32} className="sun-icon" />
        <div className="sun-details">
          <span className="sun-label">Sunrise</span>
          <span className="sun-time">{formatTime(weather.sys.sunrise)}</span>
        </div>
      </div>
      <div className="sun-item">
        <Sunset size={32} className="sun-icon" />
        <div className="sun-details">
          <span className="sun-label">Sunset</span>
          <span className="sun-time">{formatTime(weather.sys.sunset)}</span>
        </div>
      </div>
    </div>
  );
};

export default SunInfo;
