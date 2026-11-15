const map = L.map('map', {
    center: [20.89050, 29.88281],
    zoom: 2
});

const scale = L.control.scale ({
    position: 'bottomleft',
    maxWidth: 150,
    metric: true,
    imperial: true,
}).addTo(map);

const provider = new GeoSearch.OpenStreetMapProvider({
    params: {
        'accept-language': 'en',
    }
});

const searchControl = new GeoSearch.GeoSearchControl ({
    provider: provider,
    position: 'topleft',
    style: 'bar',
    autocomplete: true,
    autoCompleteDelay: 250,
    showMarker: true,
    showPopup: false,
    marker: {
        icon: new L.Icon.Default(),
        draggable: false,
    },
    maxMarkers: 1,
    retainZoomLevel: false,
    animateZoom: true,
    autoClose: true,
    searchLabel: 'Search..',
});

map.addControl(searchControl);

// ⋆.𐙚 ̊ --- BASE LAYERS --- ⋆.𐙚 ̊
const key = 'sHFqCWGPI8MgfTIbGE6u';
const satelliteHybrid = L.tileLayer(`https://api.maptiler.com/maps/hybrid-v4/{z}/{x}/{y}.jpg?key=${key}`,{
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
});

const satellite = L.tileLayer(`https://api.maptiler.com/maps/satellite-v4/{z}/{x}/{y}.jpg?key=${key}`,{
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
});

// ✮⋆˙ --- OVERLAY LAYERS --- ✮⋆˙
const soilMoisture = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Analyzed_Root_Zone_Soil_Moisture/default/{time}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png', {
    layers: 'SMAP_L3_Active_Soil_Moisture',
    format: 'image/png',
    opacity: 0.7,
    time: '2015-03-31',
    minZoom: 1,
    maxNativeZoom: 6,
    maxZoom: 18,
    attribution: '&copy; NASA GIBS / SMAP'
});

const soilTemp = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Soil_Temperature_Layer_1/default/{time}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png', {
    format: 'image/png',
    opacity: 0.7,
    time: '2015-03-31',
    minZoom: 1,
    maxNativeZoom: 6,
    maxZoom: 18,
    attribution: '&copy; NASA GIBS / SMAP'
})

const ndvi = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Aqua_L3_NDVI_16Day/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png', {
    attribution: '&copy; NASA GIBS',
    minZoom: 1,
    maxZoom: 9,
    format: 'image/png',
    opacity: 0.7,
    time: '2026-10-01' 
});

const evi = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_L3_EVI_16Day/default/{time}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png', {
    minZoom: 1,
    maxZoom: 9,
    format: 'image/png',
    opacity: 0.7,
    noWrap: true,
    time: '2026-10-01',
    attribution: '&copy; NASA GIBS',
});

const temperature = L.tileLayer.wms('https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?', {
    layers: 'MODIS_Aqua_Land_Surface_Temp_Day',
    format: 'image/png',
    transparent: true,
    opacity: 0.7,
    time: '2025-06-01',
    minZoom: 1,
    maxZoom: 9,
    attribution: '&copy; NASA EOSDIS GIBS'
});

const baseMaps = {
    "Satellite Hybrid": satelliteHybrid,
    "Satellite Plain": satellite,
};

const overlayMaps = {
    "Soil Moisture": soilMoisture,
    "Soil Temperature": soilTemp,
    "Crop Health(NDVI)": ndvi,
    "Enhanced Vegetation(EVI)": evi,
    "Land Surface Temperature": temperature,
};

const layerConfigs = {
  'Soil Moisture': {
    className: 'smap',
    title: 'Soil Moisture Index',
    subtitle: 'SMAP / Model',
    min: '0.000 m³/m³',
    max: '0.700 m³/m³'
  },
  'Soil Temperature': {
    className: 'st',
    title: 'Soil Temperature',
    subtitle: 'SMAP / Model',
    min: '-10 °C',
    max: '+45 °C'
  },
  'Crop Health(NDVI)': {
    className: 'ndvi',
    title: 'Normalized Difference Vegetation Index',
    subtitle: 'MODIS / Terra',
    min: '-0.2',
    max: '1.0'
  },
  'Enhanced Vegetation(EVI)': {
    className: 'evi',
    title: 'Enhanced Vegetation index',
    subtitle: 'MODIS / Terra',
    min: '-0.2',
    max: '1.0'
  },
  'Land Surface Temperature': {
    className: 'lst',
    title: 'Land Surface Temperature',
    subtitle: 'MODIS / Terra',
    min: '200.0 K',
    max: '350.0 K'
  },
};

function updateLegend(layerName) {
  const config = layerConfigs[layerName];
  const legendCard = document.getElementById('dynamic-legend');
  
  if (!config) {
    legendCard.style.display = 'none';
    return;
  }
  legendCard.style.display = 'block';
  legendCard.className = `legend-card ${config.className}`;

  document.getElementById('legend-title').innerText = config.title;
  document.getElementById('legend-subtitle').innerText = config.subtitle;
  document.getElementById('label-min').innerText = config.min;
  document.getElementById('label-max').innerText = config.max;
}

map.on('overlayadd', function (e) {
  updateLegend(e.name);
});

map.on('overlayremove', function (e) {
  document.getElementById('dynamic-legend').style.display = 'none';
});

satellite.addTo(map);
const layerControl = L.control.layers(baseMaps, overlayMaps,  {position: 'bottomleft'}).addTo(map);

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');

toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
        toggleBtn.textContent = '◀';
    } else {
        toggleBtn.textContent = '▶';
    }
});

if (typeof map !== 'undefined') {
    map.on('click', function(e) {
        const lat = e.latlng.lat.toFixed(4);
        const lon = e.latlng.lng.toFixed(4);

        localStorage.setItem('selectedLat', lat);
        localStorage.setItem('selectedLon', lon);

        document.querySelectorAll('a[href*="analyse.html"]').forEach(link => {
            link.href = `analyse.html?lat=${lat}&lon=${lon}`;
        });
    });
}