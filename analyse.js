document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat') || localStorage.getItem('selectedLat') || 47.9535;
    const lon = urlParams.get('lon') || localStorage.getItem('selectedLon') || 34.3812;

    const coordsDisplay = document.getElementById('coords-display');
    if (coordsDisplay) {
        coordsDisplay.textContent = `Coordinates: ${lat}, ${lon}`;
    }

    async function fetchRegionData(latitude, longitude) {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            const temp = data.current_weather.temperature;
            const wind = data.current_weather.windspeed;
            const elev = data.elevation;

            document.getElementById('temp-val').textContent = `${temp} °C`;
            document.getElementById('wind-val').textContent = `${wind} km/h`;
            document.getElementById('elev-val').textContent = `${elev} m`;

            document.getElementById('temp-comment').textContent = 
                temp < 0 ? "▽ Frost conditions detected." :
                temp > 25 ? "△ High thermal activity." : "● Moderate temperature range.";

            document.getElementById('wind-comment').textContent = 
                wind > 20 ? "▲ High wind speeds in sector." : "● Calm air flow conditions.";

            document.getElementById('elev-comment').textContent = 
                elev > 500 ? "◈ High-altitude terrain." : "◇ Lowland or flat terrain profile.";

        } catch (error) {
            console.error("Error", error);
        }
    }

    fetchRegionData(lat, lon);
});