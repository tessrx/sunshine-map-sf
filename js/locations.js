// ============================================
// SF Sunshine Map - locations.js
// Location data for neighborhoods and city-wide views
// ============================================

const neighborhoodLocations = [
  // San Francisco neighborhoods
  { name: 'Downtown', lat: 37.7879, lon: -122.4074 },
  { name: 'Mission', lat: 37.7599, lon: -122.4148 },
  { name: 'Marina', lat: 37.8037, lon: -122.4368 },
  { name: 'Inner Sunset', lat: 37.7601, lon: -122.4657 },
  { name: 'Outer Sunset', lat: 37.7551, lon: -122.4947 },
  { name: 'Inner Richmond', lat: 37.7799, lon: -122.4631 },
  { name: 'Outer Richmond', lat: 37.7781, lon: -122.4947 },
  { name: 'Castro', lat: 37.7609, lon: -122.4350 },
  { name: 'Noe Valley', lat: 37.7502, lon: -122.4337 },
  { name: 'SOMA', lat: 37.7785, lon: -122.3950 },
  { name: 'Haight-Ashbury', lat: 37.7692, lon: -122.4481 },
  { name: 'Pacific Heights', lat: 37.7925, lon: -122.4382 },
  { name: 'Tenderloin', lat: 37.7847, lon: -122.4141 },
  { name: 'Excelsior', lat: 37.7257, lon: -122.4244 },
  { name: 'Bayview', lat: 37.7296, lon: -122.3896 },
  { name: 'North Beach', lat: 37.8061, lon: -122.4103 },
  { name: 'Bernal Heights', lat: 37.7394, lon: -122.4156 },
  { name: 'Presidio', lat: 37.7989, lon: -122.4662 },
  
  // Outer Bay Area (visible when zoomed out)
  { name: 'Oakland', lat: 37.8044, lon: -122.2712 },
  { name: 'Berkeley', lat: 37.8716, lon: -122.2727 },
  { name: 'South SF', lat: 37.6547, lon: -122.4077 },
  { name: 'Palo Alto', lat: 37.4419, lon: -122.1430 },
];

// 30 hand-picked points across SF for city-wide view
const citywideLocations = [
  { name: 'Point 1', lat: 37.7587, lon: -122.4146 },
  { name: 'Point 2', lat: 37.7744, lon: -122.4102 },
  { name: 'Point 3', lat: 37.8006, lon: -122.4071 },
  { name: 'Point 4', lat: 37.796, lon: -122.4644 },
  { name: 'Point 5', lat: 37.7716, lon: -122.4457 },
  { name: 'Point 6', lat: 37.7686, lon: -122.4672 },
  { name: 'Point 7', lat: 37.7675, lon: -122.4907 },
  { name: 'Point 8', lat: 37.7762, lon: -122.4967 },
  { name: 'Point 9', lat: 37.7600, lon: -122.4477 },
  { name: 'Point 10', lat: 37.7763, lon: -122.4353 },
  { name: 'Point 11', lat: 37.7854, lon: -122.4305 },
  { name: 'Point 12', lat: 37.786, lon: -122.4493 },
  { name: 'Point 13', lat: 37.7803, lon: -122.4653 },
  { name: 'Point 14', lat: 37.7971, lon: -122.4366 },
  { name: 'Point 15', lat: 37.7598, lon: -122.3991 },
  { name: 'Point 16', lat: 37.7427, lon: -122.4157 },
  { name: 'Point 17', lat: 37.7621, lon: -122.4353 },
  { name: 'Point 18', lat: 37.7595, lon: -122.4269 },
  { name: 'Point 19', lat: 37.752, lon: -122.4326 },
  { name: 'Point 20', lat: 37.7511, lon: -122.5024 },
  { name: 'Point 21', lat: 37.7514, lon: -122.4723 },
  { name: 'Point 22', lat: 37.7362, lon: -122.4861 },
  { name: 'Point 23', lat: 37.7398, lon: -122.4543 },
  { name: 'Point 24', lat: 37.751, lon: -122.4475 },
  { name: 'Point 25', lat: 37.7345, lon: -122.3943 },
  { name: 'Point 26', lat: 37.7252, lon: -122.42 },
  { name: 'Point 27', lat: 37.7232, lon: -122.4629 },
  { name: 'Point 28', lat: 37.7877, lon: -122.4055 },
  { name: 'Point 29', lat: 37.7402, lon: -122.4332 },
  { name: 'Point 30', lat: 37.7706, lon: -122.393 },
  { name: 'Point 31', lat: 37.7236, lon: -122.4807 },
  { name: 'Point 32', lat: 37.7508, lon: -122.4842 },
  { name: 'Point 33', lat: 37.7257, lon: -122.4354 },
  { name: 'Point 34', lat: 37.7687, lon: -122.4224 },
  { name: 'Point 35', lat: 37.6919, lon: -122.4766 },
  { name: 'Point 36', lat: 37.6528, lon: -122.4014 },
  { name: 'Point 37', lat: 37.7073, lon: -122.4155 },
  { name: 'Point 38', lat: 37.5619, lon: -122.3245 },
  { name: 'Point 39', lat: 37.5934, lon: -122.4969 },
  { name: 'Point 40', lat: 37.4631, lon: -122.4299 },
  { name: 'Point 41', lat: 37.809, lon: -122.2792 },
  { name: 'Point 42', lat: 37.867, lon: -122.2744 },
  { name: 'Point 43', lat: 37.4441, lon: -122.1707 },
  { name: 'Point 44', lat: 37.8556, lon: -122.4843 },
  { name: 'Point 45', lat: 37.8279, lon: -122.4986 },
  { name: 'Point 46', lat: 37.9042, lon: -122.6042 },
  { name: 'Point 47', lat: 37.8047, lon: -122.4746 },
  { name: 'Point 48', lat: 37.7577, lon: -122.4585 },
  { name: 'Point 49', lat: 37.3371, lon: -121.9002 }
];

function getLocationsForView(view) {
  return view === 'neighborhoods' ? neighborhoodLocations : citywideLocations;
}

