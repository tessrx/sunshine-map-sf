# SF Sunshine Map

A cute, minimal website that shows real-time weather conditions across the San Francisco Bay Area.

## Setup

### 1. Get an OpenWeatherMap API Key

1. Sign up for a free account at [openweathermap.org](https://openweathermap.org/api)
2. Go to "API Keys" in your account dashboard
3. Create a new API key (it may take a few hours to activate)

### 2. Add Your API Key

Open `app.js` and replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
const API_KEY = 'your-actual-api-key-here';
```

### 3. Run the Website

**Option A: Open directly**
Just open `index.html` in your browser.

**Option B: Use a local server** (recommended for best results)
```bash
npx serve .
```
Then visit http://localhost:3000

## Features

- Interactive map of the SF Bay Area
- Real-time weather data for 15 locations
- Four weather categories: Sunny, Partly Cloudy, Cloudy, Rain
- Auto-refreshes every 10 minutes
- Responsive design for mobile

## Tech Stack

- Vanilla HTML/CSS/JavaScript
- Leaflet.js for maps
- OpenStreetMap for map tiles
- OpenWeatherMap API for weather data

## Customization

### Add More Locations

Edit the `locations` array in `app.js`:

```javascript
const locations = [
  { name: 'Your Location', lat: 37.1234, lon: -122.5678 },
  // ...
];
```

### Change the Style

Edit `styles.css` to customize colors, fonts, and layout. The main color variables are at the top of the file.

