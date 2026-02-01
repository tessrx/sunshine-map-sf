// ============================================
// SF Sunshine Map - arc.js
// Sun/Moon arc widget
// ============================================

let sunTimes = null;

// Time formatting options (reused for display)
const TIME_FORMAT = { hour: 'numeric', minute: '2-digit', hour12: true };

// Update UI elements for day/night mode
function updateUIForTimeOfDay(isNight) {
  // Update legend button
  const sunnyButton = document.querySelector('.legend-item[data-filter="sunny"], .legend-item[data-filter="clear-night"]');
  if (sunnyButton) {
    if (isNight) {
      sunnyButton.dataset.filter = 'clear-night';
      sunnyButton.innerHTML = '<span class="icon">🌙</span> Clear';
    } else {
      sunnyButton.dataset.filter = 'sunny';
      sunnyButton.innerHTML = '<span class="icon">☀️</span> Sunny';
    }
  }
  
  // Update header
  const sunIcon = document.querySelector('.sun-icon');
  const title = document.querySelector('h1');
  const subtitle = document.querySelector('.subtitle');
  
  if (sunIcon) {
    sunIcon.textContent = isNight ? '🌙' : '☀️';
  }
  
  if (title) {
    title.innerHTML = isNight 
      ? '<span class="sun-icon">🌙</span> SF Clear Skies Map'
      : '<span class="sun-icon">☀️</span> SF Sunshine Map';
  }
  
  if (subtitle) {
    subtitle.textContent = isNight
      ? 'Where is the sky clear in SF right now?'
      : 'Where is it sunny in the Bay Area right now?';
  }
}

async function loadSunArc() {
  sunTimes = await fetchSunTimes();
  if (sunTimes) {
    updateSunArc();
    // Update the sun position every minute
    setInterval(updateSunArc, 60 * 1000);
  }
}

function updateSunArc() {
  if (!sunTimes) return;
  
  const now = getCurrentTime(); // Uses TEST_TIME from weather.js if set
  
  const { sunrise, sunset } = sunTimes;
  
  // Display current time
  const displayTime = new Date(now).toLocaleTimeString('en-US', { 
    ...TIME_FORMAT, 
    timeZone: 'America/Los_Angeles' 
  });
  document.getElementById('current-time').textContent = displayTime;
  
  // Format sunrise/sunset times
  const sunriseTime = new Date(sunrise).toLocaleTimeString('en-US', TIME_FORMAT);
  const sunsetTime = new Date(sunset).toLocaleTimeString('en-US', TIME_FORMAT);
  
  const widget = document.getElementById('sun-arc-widget');
  const daylightEl = document.getElementById('daylight-remaining');
  const sunEl = document.getElementById('arc-sun');
  const moonEl = document.getElementById('arc-moon');
  
  const isNight = now < sunrise || now > sunset;
  
  // Swap times for night mode: sunset (start) on left, sunrise (end) on right
  if (isNight) {
    document.getElementById('sunrise-time').textContent = sunsetTime;
    document.getElementById('sunset-time').textContent = sunriseTime;
  } else {
    document.getElementById('sunrise-time').textContent = sunriseTime;
    document.getElementById('sunset-time').textContent = sunsetTime;
  }
  
  // Arc positioning constants
  const centerX = 60;
  const centerY = 60;
  const radius = 50;
  
  if (isNight) {
    widget.classList.add('night');
    document.body.classList.add('night-mode');
    setMapNightMode(true);
    updateUIForTimeOfDay(true);
    
    // Calculate moon position (0 = sunset, 1 = sunrise)
    // Night spans from sunset to next sunrise
    const nightStart = now > sunset ? sunset : sunset - 24 * 60 * 60 * 1000;
    const nightEnd = now < sunrise ? sunrise : sunrise + 24 * 60 * 60 * 1000;
    const nightDuration = nightEnd - nightStart;
    const nightElapsed = now - nightStart;
    const moonProgress = Math.max(0, Math.min(1, nightElapsed / nightDuration));
    
    // Position moon along the arc
    const moonAngle = Math.PI * (1 - moonProgress);
    const moonX = centerX + radius * Math.cos(moonAngle);
    const moonY = centerY - radius * Math.sin(moonAngle);
    
    moonEl.setAttribute('x', moonX);
    moonEl.setAttribute('y', moonY + 5);
    
    // Calculate time until sunrise
    const untilSunrise = now < sunrise ? sunrise - now : sunrise + 24 * 60 * 60 * 1000 - now;
    const hours = Math.floor(untilSunrise / (1000 * 60 * 60));
    const mins = Math.floor((untilSunrise % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      daylightEl.textContent = `${hours}h ${mins}m until sunrise`;
    } else {
      daylightEl.textContent = `${mins}m until sunrise`;
    }
  } else {
    widget.classList.remove('night');
    document.body.classList.remove('night-mode');
    setMapNightMode(false);
    updateUIForTimeOfDay(false);
    
    // Calculate sun position (0 = sunrise, 1 = sunset)
    const progress = (now - sunrise) / (sunset - sunrise);
    
    // Position sun along the arc
    const angle = Math.PI * (1 - progress);
    const sunX = centerX + radius * Math.cos(angle);
    const sunY = centerY - radius * Math.sin(angle);
    
    sunEl.setAttribute('x', sunX);
    sunEl.setAttribute('y', sunY + 5);
    
    // Calculate remaining daylight
    const remaining = sunset - now;
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      daylightEl.textContent = `${hours}h ${mins}m of daylight left`;
    } else {
      daylightEl.textContent = `${mins}m of daylight left`;
    }
  }
}

