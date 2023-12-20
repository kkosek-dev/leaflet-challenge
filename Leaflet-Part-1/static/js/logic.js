
// Creating the map object
var myMap = L.map("map", {
    center: [35.7, -95.95],
    zoom: 4
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let base_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"



d3.json(base_url).then(function(response) {
  let earthquakes = []
  let depths = response.features.map( depth => depth.geometry.coordinates[2])
  
  console.log(depths)

let colorScale = d3.scaleLinear()
  .domain([d3.min(depths), d3.max(depths)])
  .range(['lime','red']);
console.log(colorScale)

  for (let i = 0; i < response.features.length; i++) {
    earthquakes.push( 
      { place: response.features[i].properties.place,
        mag: response.features[i].properties.mag,
        location: [response.features[i].geometry.coordinates[1],response.features[i].geometry.coordinates[0]],
        depth:  response.features[i].geometry.coordinates[2] }
    )
  }
  console.log(earthquakes[10].location)
  for (let i = 0; i < earthquakes.length; i++) {
    L.circle(earthquakes[i].location, {
      fillOpacity: 1,
      weight:0.25,
      color: "black",
      fillColor: colorScale(earthquakes[i].depth),
      radius:  (earthquakes[i].mag * 16250)
    }).addTo(myMap)
  }
});





/*
d3.json(base_url).then(function(response) {
  createFeatures(response.features)
});

function createFeatures(earthquakeData) {

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData)
  // Send our earthquakes layer to the createMap function/

}

function createMap(earthquakes) {
  var myMap = L.map("map", {
    center:[37.09, -95.71],
    zoom: 11
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);


}

// Store our API endpoint as queryUrl.
let base_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(base_url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features)
  console.log(data.features);
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
    onEachFeature: onEachFeature
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
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
*/