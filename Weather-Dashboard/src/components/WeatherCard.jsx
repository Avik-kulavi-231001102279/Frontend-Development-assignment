const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const iconCode = weather.weather[0].icon;
  const description = weather.weather[0].description;
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);

  return (
    <div className="weather-card">
      <div className="weather-main-info">
        <img 
          src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`} 
          alt={description} 
          className="weather-icon"
        />
        <div className="temperature">
          {temp}°C
        </div>
        <div className="description">
          {description.charAt(0).toUpperCase() + description.slice(1)}
        </div>
        <div className="feels-like">
          Feels like {feelsLike}°C
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
