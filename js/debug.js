// ============================================
// SF Sunshine Map - debug.js
// Debug utilities and test settings
// ============================================

// ============================================
// TIME TESTING
// ============================================
// Set to a time string like '21:00' (9 PM) to test night mode
// Set to null for real time
const TEST_TIME = null;

// Helper to get current time (respects TEST_TIME for testing)
function getCurrentTime() {
  if (TEST_TIME) {
    const [hours, mins] = TEST_TIME.split(':').map(Number);
    const testDate = new Date();
    testDate.setHours(hours, mins, 0, 0);
    return testDate.getTime();
  }
  return Date.now();
}

// ============================================
// LOCATION PICKER MODE
// ============================================
// Set to true to enable click-to-pick coordinates mode
// Useful for adding new location points
const PICKER_MODE = false;

// Storage for picked points (used when PICKER_MODE is true)
let pickedPoints = [];

// Initialize picker mode on a map instance
function initPickerMode(map) {
  if (!PICKER_MODE) return;
  
  console.log('🎯 PICKER MODE ENABLED - Click on the map to collect points');
  console.log('Points will be logged to console. Copy the array when done.');
  
  map.on('click', (e) => {
    const point = {
      lat: Math.round(e.latlng.lat * 10000) / 10000,
      lon: Math.round(e.latlng.lng * 10000) / 10000
    };
    
    pickedPoints.push(point);
    
    // Add a visual marker
    L.circleMarker([point.lat, point.lon], {
      radius: 6,
      fillColor: '#FF6B9D',
      color: '#2D2D2D',
      weight: 2,
      fillOpacity: 1
    }).addTo(map).bindPopup(`Point ${pickedPoints.length}<br>${point.lat}, ${point.lon}`);
    
    console.log(`📍 Point ${pickedPoints.length}:`, point);
    console.log('All points so far:', JSON.stringify(pickedPoints, null, 2));
  });
}

