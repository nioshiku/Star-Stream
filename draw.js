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

// coordinates function - Latitude/Longitude
function Coordinates(layer) {
    let coordinates = [];
    let featureType = "";

    if(layer instanceof L.Polygon) {
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

    else  if(layer instanceof L.Rectangle) {
        featureType = "Rectangle";
        layer.getLatLngs()[0].forEach(function(point) {
            coordinates.push({lat: point.lat, lng: point.lng})
        })
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

    let featureInfo = {
        type: featureType,
        coordinates: coordinates
    }

    document.getElementById('coordinates').textContent = JSON.stringify(featureInfo, null, 2);
    console.log("Feature info: ", featureInfo);
}

map.on('draw:created', function(event) {
    let layer = event.layer;
    drawnItems.addLayer(layer);
    //Coordinates(layer);
})