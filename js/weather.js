// ============================================
// SF Sunshine Map - weather.js
// Weather API and category mapping
// ============================================

// TEST MODE: Set to a time string like '21:00' (9 PM) to test, or null for real time
// This is shared across weather.js and arc.js
const TEST_TIME = null;

// Helper to get current time (respects TEST_TIME)
function getCurrentTime() {
  if (TEST_TIME) {
    const [hours, mins] = TEST_TIME.split(':').map(Number);
    const testDate = new Date();
    testDate.setHours(hours, mins, 0, 0);
    return testDate.getTime();
  }
  return Date.now();
}

// Cache settings
const WEATHER_CACHE_KEY = 'sf_sunshine_weather_v4'; // Bumped for shared TEST_TIME
const WEATHER_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const SUN_CACHE_KEY = 'sf_sunshine_sun_times';

// Check if it's currently night based on our cached sun times
function isCurrentlyNight() {
  try {
    const cached = localStorage.getItem(SUN_CACHE_KEY);
    if (!cached) return false;
    
    const data = JSON.parse(cached);
    const now = getCurrentTime(); // Uses TEST_TIME if set
    const { sunrise, sunset } = data.sunTimes;
    
    return now < sunrise || now > sunset;
  } catch (e) {
    return false;
  }
}

// OpenWeatherMap condition codes: https://openweathermap.org/weather-conditions
function getWeatherCategory(weatherCode) {
  // Codes are grouped: 2xx (Thunderstorm), 3xx (Drizzle), 5xx (Rain), 
  // 6xx (Snow), 7xx (Atmosphere), 800 (Clear), 80x (Clouds)
  
  const isNight = isCurrentlyNight();
  
  if (weatherCode === 800) {
    return isNight ? 'clear-night' : 'sunny';
  } else if (weatherCode === 801 || weatherCode === 802) {
    // 801 = few clouds, 802 = scattered clouds
    return 'partly-cloudy';
  } else if (weatherCode === 803 || weatherCode === 804) {
    // 803 = broken clouds, 804 = overcast
    return 'cloudy';
  } else if (weatherCode >= 200 && weatherCode < 700) {
    // Thunderstorm, Drizzle, Rain, Snow
    return 'rain';
  } else if (weatherCode >= 700 && weatherCode < 800) {
    // Atmosphere (fog, mist, etc) - treat as cloudy
    return 'cloudy';
  }
  
  return 'cloudy'; // default fallback
}

function getWeatherIcon(category) {
  const icons = {
    'sunny': '☀️',
    'clear-night': '🌙',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'rain': '🌧️'
  };
  return icons[category] || '☁️';
}

function getWeatherLabel(category) {
  const labels = {
    'sunny': 'Sunny',
    'clear-night': 'Clear',
    'partly-cloudy': 'Partly Cloudy',
    'cloudy': 'Cloudy',
    'rain': 'Rain'
  };
  return labels[category] || 'Unknown';
}

async function fetchWeather(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${CONFIG.API_KEY}&units=imperial`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    
    const weatherCode = data.weather[0].id;
    const category = getWeatherCategory(weatherCode);
    
    return {
      ...location,
      category,
      icon: getWeatherIcon(category),
      label: getWeatherLabel(category),
      temp: Math.round(data.main.temp),
      description: data.weather[0].description
    };
  } catch (error) {
    console.error(`Error fetching weather for ${location.name}:`, error);
    return {
      ...location,
      category: 'unknown',
      icon: '❓',
      label: 'Unknown',
      temp: null,
      description: 'Unable to fetch weather'
    };
  }
}

async function fetchAllWeather(locations) {
  const promises = locations.map(loc => fetchWeather(loc));
  return Promise.all(promises);
}

// ============================================
// Cached Weather Fetching
// ============================================

function getCachedWeather(viewType) {
  try {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const age = Date.now() - data.timestamp;
    
    // Check if cache is still valid and matches current view
    if (age < WEATHER_CACHE_DURATION && data.viewType === viewType) {
      console.log(`Using cached weather data (${Math.round(age / 1000)}s old)`);
      return data.weather;
    }
  } catch (e) {
    console.error('Error reading weather cache:', e);
  }
  return null;
}

function setCachedWeather(viewType, weather) {
  try {
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      viewType,
      weather
    }));
  } catch (e) {
    console.error('Error saving weather cache:', e);
  }
}

async function fetchAllWeatherCached(locations, viewType) {
  // Try cache first
  const cached = getCachedWeather(viewType);
  if (cached) return cached;
  
  // Fetch fresh data
  console.log('Fetching fresh weather data...');
  const weather = await fetchAllWeather(locations);
  setCachedWeather(viewType, weather);
  return weather;
}

// ============================================
// Cached Sun Times
// ============================================

function getCachedSunTimes() {
  try {
    const cached = localStorage.getItem(SUN_CACHE_KEY);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    const today = new Date().toDateString();
    
    // Check if cache is from today
    if (data.date === today) {
      console.log('Using cached sun times');
      return data.sunTimes;
    }
  } catch (e) {
    console.error('Error reading sun times cache:', e);
  }
  return null;
}

function setCachedSunTimes(sunTimes) {
  try {
    localStorage.setItem(SUN_CACHE_KEY, JSON.stringify({
      date: new Date().toDateString(),
      sunTimes
    }));
  } catch (e) {
    console.error('Error saving sun times cache:', e);
  }
}

// Fetch sunrise/sunset for SF (use downtown SF coordinates)
async function fetchSunTimes() {
  // Try cache first
  const cached = getCachedSunTimes();
  if (cached) return cached;
  
  console.log('Fetching fresh sun times...');
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=37.7749&lon=-122.4194&appid=${CONFIG.API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    
    const sunTimes = {
      sunrise: data.sys.sunrise * 1000, // Convert to milliseconds
      sunset: data.sys.sunset * 1000
    };
    
    setCachedSunTimes(sunTimes);
    return sunTimes;
  } catch (error) {
    console.error('Error fetching sun times:', error);
    return null;
  }
}

