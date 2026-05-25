# Practice Project: Weather App

## Requirements
Build a weather application that fetches real data from an API.

## Features
- [ ] Search city by name
- [ ] Display current weather (temp, description, icon)
- [ ] Show additional info (humidity, wind speed, feels like)
- [ ] Loading state while fetching
- [ ] Error handling (city not found)
- [ ] Recent searches (last 5 cities)
- [ ] Toggle Celsius/Fahrenheit

## API
Use OpenWeatherMap free tier: https://openweathermap.org/api
```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
```

## Concepts Used
- Components (SearchBar, WeatherCard, RecentSearches)
- Props (weather data to card, handlers)
- State (query, weather data, loading, error, recent searches)
- Event handling (form submit, click recent city)
- Conditional rendering (loading, error, data states)
- useEffect (fetch on city change, localStorage for recent)
- Forms (search input)

## Component Structure
```
App
├── SearchBar (input + search button)
├── WeatherCard
│   ├── WeatherIcon
│   ├── Temperature
│   └── WeatherDetails (humidity, wind, etc.)
├── RecentSearches (clickable list)
└── ErrorMessage
```

## Getting Started
```bash
npm create vite@latest weather-app -- --template react
cd weather-app
npm install
npm run dev
```

1. Sign up at openweathermap.org for free API key
2. Store API key in `.env` file: `VITE_WEATHER_API_KEY=your_key_here`
3. Access in code: `import.meta.env.VITE_WEATHER_API_KEY`
