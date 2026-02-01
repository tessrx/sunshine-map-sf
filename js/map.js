// ============================================
// SF Sunshine Map - map.js
// Leaflet map setup and marker management
// ============================================

let map;
let markers = [];
let currentWeatherData = [];
let currentStyle = 'city-wide';
let activeFilter = null; // null means show all
let lastFetchTime = null;

// Tile layers for day/night modes
let lightTiles;
let darkTiles;
let currentTileLayer;

// Point picker mode (for selecting custom locations)
const PICKER_MODE = false;
let pickedPoints = [];

function initMap() {
  // Center on San Francisco proper (zoom 13 for citywide default)
  map = L.map('map').setView([37.76, -122.44], 13);
  
  // Light tiles (day mode)
  lightTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  
  // Dark tiles (night mode) - using Stadia Alidade Smooth Dark
  darkTiles = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  
  // Start with light tiles
  lightTiles.addTo(map);
  currentTileLayer = lightTiles;
  
  // Update message when map moves or zooms
  map.on('moveend', updateVisibleSunnyMessage);
  map.on('zoomend', updateVisibleSunnyMessage);
  
  // Point picker mode - click to collect coordinates
  if (PICKER_MODE) {
    console.log('🎯 PICKER MODE ENABLED - Click on the map to collect points (max 30)');
    console.log('When done, copy the array from console and share it.');
    
    map.on('click', (e) => {
      if (pickedPoints.length >= 30) {
        console.log('✅ You have 30 points! Here is your array:');
        console.log(JSON.stringify(pickedPoints, null, 2));
        return;
      }
      
      const point = {
        lat: Math.round(e.latlng.lat * 10000) / 10000,
        lon: Math.round(e.latlng.lng * 10000) / 10000
      };
      
      pickedPoints.push(point);
      
      // Add a small marker to show where you clicked
      L.circleMarker([point.lat, point.lon], {
        radius: 6,
        fillColor: '#FF6B9D',
        color: '#2D2D2D',
        weight: 2,
        fillOpacity: 0.8
      }).addTo(map);
      
      console.log(`📍 Point ${pickedPoints.length}/30: { lat: ${point.lat}, lon: ${point.lon} }`);
      
      if (pickedPoints.length === 30) {
        console.log('✅ You have 30 points! Here is your array:');
        console.log(JSON.stringify(pickedPoints, null, 2));
      }
    });
  }
}

function setMapView(lat, lon, zoom) {
  map.setView([lat, lon], zoom);
}

// Create a custom div icon with emoji - neighborhood style (with box)
function createNeighborhoodIcon(weatherData) {
  return L.divIcon({
    className: `weather-marker weather-${weatherData.category}`,
    html: `<span class="marker-icon">${weatherData.icon}</span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
}

// Create a minimal icon - citywide style (no box, just emoji)
function createCitywideIcon(weatherData) {
  return L.divIcon({
    className: `weather-marker-minimal weather-${weatherData.category}`,
    html: `<span class="marker-icon-minimal">${weatherData.icon}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

function addWeatherMarkers(weatherDataList, style = 'neighborhoods') {
  // Store for filtering
  currentWeatherData = weatherDataList;
  currentStyle = style;
  lastFetchTime = new Date();
  
  // Render with current filter
  renderMarkers();
}

function renderMarkers() {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  
  // Filter data if filter is active
  const dataToRender = activeFilter 
    ? currentWeatherData.filter(d => d.category === activeFilter)
    : currentWeatherData;
  
  // Check for no sunny skies and update message
  updateFilterMessage(dataToRender);
  
  // Format the last fetch time for popups
  const timeStr = lastFetchTime ? lastFetchTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }) : '';
  
  dataToRender.forEach(data => {
    const icon = currentStyle === 'neighborhoods' 
      ? createNeighborhoodIcon(data) 
      : createCitywideIcon(data);
    
    const popupContent = currentStyle === 'neighborhoods'
      ? `<div class="popup-content">
          <strong>${data.name}</strong><br>
          ${data.icon} ${data.label}<br>
          ${data.temp ? `${data.temp}°F` : ''}<br>
          <span class="description">${data.description}</span>
          ${timeStr ? `<br><span class="updated">Updated ${timeStr}</span>` : ''}
        </div>`
      : `<div class="popup-content">
          ${data.icon} ${data.label}<br>
          ${data.temp ? `${data.temp}°F` : ''}<br>
          <span class="coords">${data.lat}, ${data.lon}</span>
          ${timeStr ? `<br><span class="updated">Updated ${timeStr}</span>` : ''}
        </div>`;
    
    const marker = L.marker([data.lat, data.lon], { icon })
      .addTo(map)
      .bindPopup(popupContent);
    
    markers.push(marker);
  });
}

function updateFilterMessage(dataToRender) {
  // Message is now handled by updateVisibleSunnyMessage based on viewport
  // Just trigger an update after markers are placed
  setTimeout(updateVisibleSunnyMessage, 0);
}

function updateVisibleSunnyMessage() {
  const messageEl = document.getElementById('filter-message');
  if (!map || currentWeatherData.length === 0) {
    messageEl.textContent = '';
    return;
  }
  
  const bounds = map.getBounds();
  const defaultCategory = isCurrentlyNight() ? 'clear-night' : 'sunny';
  const categoryToCheck = activeFilter || defaultCategory;
  
  // Count visible spots of the category we care about
  const visibleCount = currentWeatherData.filter(d => 
    d.category === categoryToCheck && bounds.contains([d.lat, d.lon])
  ).length;
  
  if (visibleCount === 0) {
    const labels = {
      'sunny': 'sunny skies',
      'clear-night': 'clear skies',
      'partly-cloudy': 'partly cloudy skies',
      'cloudy': 'cloudy skies',
      'rain': 'rain'
    };
    const suffix = (categoryToCheck === 'sunny' || categoryToCheck === 'clear-night') ? ' :(' : '';
    messageEl.textContent = `No ${labels[categoryToCheck]} in this area${suffix}`;
  } else {
    messageEl.textContent = '';
  }
}

function setWeatherFilter(category) {
  // Toggle filter: if same category clicked, clear filter
  if (activeFilter === category) {
    activeFilter = null;
  } else {
    activeFilter = category;
  }
  
  // Update legend UI
  document.querySelectorAll('.legend-item').forEach(item => {
    item.classList.toggle('active', item.dataset.filter === activeFilter);
  });
  
  // Re-render markers with filter
  renderMarkers();
}

function setMapNightMode(isNight) {
  if (!map) return;
  
  if (isNight && currentTileLayer !== darkTiles) {
    map.removeLayer(lightTiles);
    darkTiles.addTo(map);
    currentTileLayer = darkTiles;
  } else if (!isNight && currentTileLayer !== lightTiles) {
    map.removeLayer(darkTiles);
    lightTiles.addTo(map);
    currentTileLayer = lightTiles;
  }
}

