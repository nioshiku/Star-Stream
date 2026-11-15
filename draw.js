const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true
    }
});
map.addControl(drawControl);

function Coordinates(layer) {
    let coordinates = [];
    let featureType = "";

    if(layer instanceof L.Rectangle) {
        featureType = "Rectangle";
        layer.getLatLngs()[0].forEach(function(point) {
            coordinates.push({lat: point.lat, lng: point.lng})
        })
    }

    else if(layer instanceof L.Polygon) {
        featureType = "Polygon";
        layer.getLatLngs()[0].forEach(function(point) {
            coordinates.push({lat: point.lat, lng: point.lng})
        })
    }

    else if(layer instanceof L.Circle) {
        featureType = "Circle";
        let LatLng = layer.getLatLngs();
        coordinates.push({lat: LatLng.lat, lng: LatLng.lng})
    }

    else if(layer instanceof L.Polyline) {
        featureType = "Polyline";
        layer.getLatLngs().forEach(function(point) {
            coordinates.push({lat: point.lat, lng: point.lng})
        })
    }

    else if(layer instanceof L.Marker) {
        featureType = "Marker";
        let LatLng = layer.getLatLng();
        coordinates.push({lat: LatLng.lat, lng: LatLng.lng})
    }

    else if(layer instanceof L.CircleMarker) {
        featureType = "CircleMarker";
        let LatLng = layer.getLatLng();
        coordinates.push({lat: LatLng.lat, lng: LatLng.lng})
    }
    
    const analysisBox = document.getElementById('analysis');

    let html = `<h4 style="font-size: 14px;margin: 0 0 8px 0; color:#060d1b">Type: ${featureType}</h4>`;
    html += `<div style="font-size: 16px; margin-bottom: 8px">№ of points: ${coordinates.length}</div>`;
    
    coordinates.forEach((pt, i) => {
        html += `<div class="coord-item">№${i + 1}: ${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)}</div>`;
    });
    analysisBox.innerHTML = html;
}

map.on('draw:created', function(event) {
    let layer = event.layer;
    drawnItems.addLayer(layer);
    Coordinates(layer);

    const geojson = layer.toGeoJSON();
    let result = "";

    if (geojson.geometry.type === "LineString") {
        const length = turf.length(geojson, {units: "kilometers"});
        result = `Distance: ${length.toFixed(2)} km`;
    } 

    else if (geojson.geometry.type === "Polygon") {
        const area = turf.area(geojson);
        const hectares = area / 10000;
        result = `Area: ${hectares.toFixed(2)} ha`;} 

    else if (layer instanceof L.Circle) {
        const radius = layer.getRadius();
        const area = Math.PI * Math.pow(radius, 2);
        const hectares = area / 10000;
    result = `Radius: ${radius.toFixed(0)} m<br>Area: ${hectares.toFixed(2)} ha`;
    }

    if (result) {
        layer.bindPopup(result).openPopup();
    }
    const sidebarContent = document.getElementById('analysis');
    if (result && sidebarContent) {
        sidebarContent.innerHTML += result;
    }
})
