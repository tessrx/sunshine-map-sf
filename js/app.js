// ============================================
// SF Sunshine Map - app.js
// Main application entry point
// ============================================

let currentView = 'citywide';

// ============================================
// View Switching
// ============================================

async function switchView(view) {
  currentView = view;
  
  // Update button states
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  // Adjust map view for citywide (tighter on SF only)
  if (view === 'citywide') {
    setMapView(37.76, -122.44, 13);
  } else {
    setMapView(37.76, -122.44, 12);
  }
  
  // Load weather for new view
  await loadWeatherData();
}

// ============================================
// Data Loading
// ============================================

function updateLastUpdated() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  document.getElementById('last-updated').textContent = `Last updated: ${timeStr}`;
}

async function loadWeatherData(forceRefresh = false) {
  // Show loading state
  document.getElementById('last-updated').textContent = 'Loading weather data...';
  
  const locations = getLocationsForView(currentView);
  
  // Use cached version unless force refresh
  let weatherData;
  if (forceRefresh) {
    // Clear cache and fetch fresh
    localStorage.removeItem(WEATHER_CACHE_KEY);
    weatherData = await fetchAllWeather(locations);
    setCachedWeather(currentView, weatherData);
  } else {
    weatherData = await fetchAllWeatherCached(locations, currentView);
  }
  
  addWeatherMarkers(weatherData, currentView);
  updateLastUpdated();
}

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadWeatherData();
  loadSunArc();
  
  // Set up view toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
  
  // Set up legend filter buttons
  document.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('click', () => setWeatherFilter(item.dataset.filter));
  });
  
  // Refresh weather data every 30 minutes (force refresh to bypass cache)
  setInterval(() => loadWeatherData(true), 30 * 60 * 1000);
});
