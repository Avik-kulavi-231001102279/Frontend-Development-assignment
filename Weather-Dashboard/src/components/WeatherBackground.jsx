import React from 'react';

const WeatherBackground = ({ weatherCode, isNight, children }) => {
  // Map OpenWeatherMap codes to background classes
  // Codes: https://openweathermap.org/weather-conditions
  let bgClass = 'default-bg';
  
  if (weatherCode >= 200 && weatherCode < 300) {
    bgClass = 'thunderstorm-bg';
  } else if (weatherCode >= 300 && weatherCode < 600) {
    bgClass = 'rain-bg';
  } else if (weatherCode >= 600 && weatherCode < 700) {
    bgClass = 'snow-bg';
  } else if (weatherCode >= 700 && weatherCode < 800) {
    bgClass = 'mist-bg';
  } else if (weatherCode === 800) {
    bgClass = 'clear-bg';
  } else if (weatherCode > 800) {
    bgClass = 'clouds-bg';
  }

  // Generate particles based on weather type for CSS animations
  const renderParticles = () => {
    let particles = [];

    // Add night elements if it's night time
    if (isNight) {
      particles.push(
        <div key="night" className="night-container">
          <div className="moon"></div>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={`star-${i}`} className="star" style={{ 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}></div>
          ))}
        </div>
      );
    }

    if (bgClass === 'rain-bg' || bgClass === 'thunderstorm-bg') {
      particles.push(
        <div key="rain" className="rain-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="rain-drop" style={{ 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`
            }}></div>
          ))}
        </div>
      );
    }
    
    if (bgClass === 'snow-bg') {
      particles.push(
        <div key="snow" className="snow-container">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="snow-flake" style={{ 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
      );
    }

    if (bgClass === 'clouds-bg') {
      particles.push(
        <div key="clouds" className="clouds-container">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
        </div>
      );
    }

    if (bgClass === 'thunderstorm-bg') {
      particles.push(
        <div key="thunderstorm-flash" className="lightning-flash"></div>
      );
    }

    if (bgClass === 'mist-bg') {
      particles.push(
        <div key="mist" className="fog-container">
          <div className="fog fog-1"></div>
          <div className="fog fog-2"></div>
        </div>
      );
    }

    if (bgClass === 'clear-bg' && !isNight) {
      particles.push(
        <div key="clear" className="sunny-container">
          <div className="sun-glow"></div>
        </div>
      );
    }

    return particles;
  };

  return (
    <div className={`weather-background-wrapper ${bgClass} ${isNight ? 'night-theme' : ''}`}>
      {renderParticles()}
      <div className="content-overlay">
        {children}
      </div>
    </div>
  );
};

export default WeatherBackground;
