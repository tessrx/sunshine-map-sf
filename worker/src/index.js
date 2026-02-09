// Cloudflare Worker - Weather API proxy for SF Sunshine Map

export default {
  async fetch(request, env) {
    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);

    // Route: /weather?lat=X&lon=Y
    if (url.pathname === '/weather') {
      const lat = url.searchParams.get('lat');
      const lon = url.searchParams.get('lon');

      if (!lat || !lon) {
        return new Response(JSON.stringify({ error: 'lat and lon required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${env.OPENWEATHER_API_KEY}&units=imperial`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
