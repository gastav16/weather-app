# Weather App

A React weather app that shows current conditions, an hourly forecast strip with a temperature trend line, and a 5-day forecast — built with Vite and the Open-Meteo API.

## Features

- Search any city by name
- Current temperature, condition, and icon with a glow effect
- Next 6 hours forecast strip with mini icons and a temperature trend line
- 5-day forecast with high/low temps
- Loading and error states
- Responsive layout

## Tech stack

- React (Vite)
- [Open-Meteo API](https://open-meteo.com/) — free, no API key required
  - Geocoding API for city → coordinates lookup
  - Forecast API for current, hourly, and daily weather data

## Getting started

Clone the repo and install dependencies:

\`\`\`bash
git clone https://github.com/gastav16/weather-app.git
cd weather-app
npm install
npm run dev
\`\`\`

Then open the local URL it prints (usually `http://localhost:5173`).

## How it works

1. User types a city name and submits the search
2. The app calls Open-Meteo's geocoding endpoint to convert the city name into latitude/longitude
3. Those coordinates are used to fetch current, hourly, and daily weather data
4. Weather codes are mapped to human-readable conditions and emoji icons
5. Results are rendered in a current-conditions card, an hourly strip with a trend line, and a 5-day forecast grid

## Possible next steps

- Add geolocation to auto-detect the user's city
- Cache recent searches
- Add unit toggle (°C / °F)