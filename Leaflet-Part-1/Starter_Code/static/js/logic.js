// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
  pointToLayer: createMarker
});

// Create markers where marker size increases with quake magnitude

function createMarker(feature, latlng) {
  return L.circleMarker(latlng, {
      radius: markerSize(feature.properties.mag),
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color:"#000",
      weight: 0.5,
      opacity: 0.5,
      fillOpacity: 1
  });
}

function markerSize(magnitude) {
  return magnitude * 5
} 

// Change the marker color based on quake depth
function markerColor(depth) {
  if (depth >= 90) return "#FF0000";
  if (depth >= 70)return  "#FF3333";
  if (depth >= 50) return "#FF9900";
  if (depth >= 30)  return"#FF9933";
  if (depth >= 10 )return"#00FF66"
 else{ return "#99FF33"
}
};                              

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

//Creating a legend
        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
        var div = L.DomUtil.create('div','info legend');

            div.innerHTML +=
            '<alt="legend" width="134" height="147">';

        return div;
        };

        legend.addTo(map);

