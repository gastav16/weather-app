import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Moderate showers', 82: 'Violent showers',
  95: 'Thunderstorm',
};

const weatherIconMap = {
    0: '☀️',
    1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '❄️',
    80: '🌦️', 81: '🌧️', 82: '⛈️',
    95: '⛈️',
  };

const getIcon = (code) => weatherIconMap[code] || '🌡️';
const getCondition = (code) => weatherCodeMap[code] || 'Unknown';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);
    setHourly([]);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found. Check the spelling and try again.');
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
       `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country,
        temp: Math.round(weatherData.current.temperature_2m),
        condition: getCondition(weatherData.current.weather_code),
        icon: getIcon(weatherData.current.weather_code),
      });

      const nowIndex = weatherData.hourly.time.findIndex(
        (t) => new Date(t) >= new Date()
      );
      const next6 = weatherData.hourly.time.slice(nowIndex, nowIndex + 6).map((time, i) => ({
        time,
        temp: Math.round(weatherData.hourly.temperature_2m[nowIndex + i]),
        icon: getIcon(weatherData.hourly.weather_code[nowIndex + i]),
      }));
      setHourly(next6);

      const days = weatherData.daily.time.slice(0, 5).map((date, i) => ({
        date,
        max: Math.round(weatherData.daily.temperature_2m_max[i]),
        min: Math.round(weatherData.daily.temperature_2m_min[i]),
        condition: getCondition(weatherData.daily.weather_code[i]),
      }));
      setForecast(days);
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
  <div className="weather-card">
    <h2>{weather.city}, {weather.country}</h2>
    <div className="icon-glow">
      <span className="condition-icon">{weather.icon}</span>
    </div>
    <p className="temp">{weather.temp}°C</p>
    <p className="condition">{weather.condition}</p>

    {hourly.length > 0 && (
      <div className="hourly-strip">
        {hourly.map((h, i) => (
          <div className="hourly-item" key={h.time}>
            <p className="hourly-time">
              {i === 0 ? 'Now' : new Date(h.time).getHours() + ':00'}
            </p>
            <span className="hourly-icon">{h.icon}</span>
            <p className="hourly-temp">{h.temp}°</p>
          </div>
        ))}
      </div>
    )}

    {hourly.length > 0 && (
      <svg className="trend-line" viewBox="0 0 300 60" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#26c6a2"
          strokeWidth="2"
          points={hourly.map((h, i) => {
            const temps = hourly.map((x) => x.temp);
            const min = Math.min(...temps);
            const max = Math.max(...temps);
            const range = max - min || 1;
            const x = (i / (hourly.length - 1)) * 300;
            const y = 50 - ((h.temp - min) / range) * 40;
            return `${x},${y}`;
          }).join(' ')}
        />
      </svg>
    )}
  </div>
)}
      {forecast.length > 0 && (
        <div className="forecast-list">
          {forecast.map((day) => (
            <div className="forecast-card" key={day.date}>
              <p className="forecast-date">
                {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
              </p>
              <p className="forecast-condition">{day.condition}</p>
              <p className="forecast-temps">
                <span className="max">{day.max}°</span> / <span className="min">{day.min}°</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App; 