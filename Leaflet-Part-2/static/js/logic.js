
// Create the map object
let myMap = L.map("map", {
    center: [35.7, -95.95],
    zoom: 4
  });

// Add the base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define the url to pull data from
let base_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Define a data promise then put it to use
d3.json(base_url).then(function(response) {

  // Initialize a list to contain our response objects
  let earthquakes = []
  // Define a list of depths for all earthquakes to use on our colorScale
  let depths = response.features.map( depth => depth.geometry.coordinates[2])
  
  // Define a colorScale to visually display the varying depths of earthquakes 
  let colorScale = d3.scaleLinear()
    // We define the domain as a range of depths values from the minimum value to a maximum of 120 km
    .domain([d3.min(depths), 120])
    // We define the range as a two color gradient
    .range(['#DAFFB0' ,'#900C3F']);

  // Create a function to round the lat & long for visual appeal
  function roundNum(data) {
    let roundedNum = Math.round(data * 100) / 100
    return roundedNum
  }
  
  // Initialize a for loop to run through our data promise and collect values
  for (let i = 0; i < response.features.length; i++) {
    // Append the desired values to our earthquakes list
    earthquakes.push( 
      { place: response.features[i].properties.place,
        mag: response.features[i].properties.mag,
        location: [roundNum(response.features[i].geometry.coordinates[1]),roundNum(response.features[i].geometry.coordinates[0])],
        depth:  response.features[i].geometry.coordinates[2] }
    )
  }
  // Initialize a for loop to create our circular markers
  for (let i = 0; i < earthquakes.length; i++) {
    // First, define the marker at its [Lat, Long]
    L.circle(earthquakes[i].location, {
      // Make the markers very opaque to stand out
      fillOpacity: 0.9,
      // Make the border lines thin to not stand out
      weight: 0.25,
      // Make the border lines black for definition
      color: "black",
      // Fill the circle based on the gradient defined in our colorScale object
      fillColor: colorScale(earthquakes[i].depth),
      // Size the circle based on the magnitude of the earthquake (and raise its value for visual appeal)
      radius:  (earthquakes[i].mag * 20050)
    })
    // Bind a popup to each circle with all its information
    .bindPopup(`
      <h3>${earthquakes[i].place}</h3>
      <hr>
      <p> Magnitude: ${earthquakes[i].mag}<br>
      Lat,Long: ${earthquakes[i].location}<br>
      Depth: ${earthquakes[i].depth}`)
    .addTo(myMap)
  }
  // Initalize a legend layers in the bottom-right corner & add to map
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function (myMap) {
    // initialize a <div> to add to HTML 
    let div = L.DomUtil.create('div', 'info legend');
    // Create 2 lists to loop through and append with a corresponding color
    let depths = ["0  -—————————————————— 15",
                  "15 —————————————————— 30",
                  "30 —————————————————— 45",
                  "45 —————————————————— 60",
                  "60 —————————————————— 75",
                  "75 —————————————————— 90",
                  "90 —————————————————— 105",
                  "105 —————————————————- 120+"];
    let colors = ['#DAFFB0','#D4E8A7',"#CCC799","#C0917D","#B27378","#9D5066","#953450","#900C3F"];
  // Initialize a header on the legend
  div.innerHTML = "<h2>Earthquake Depths Chart (km)</h2><hr>"
  // Initialize a for loop to add elements to "legend-item"
  for (let i = 0; i < depths.length; i++) {
    // Individual line of code that grabs the current color and depth range and adds to legend
    div.innerHTML += 
      '<div class="legend-item" style="background-color:' + colors[i] + '"></div>' +'<label>' + depths[i] + '</label><br>';
    }
    // Return the div item
      return div;
  };
  // Add the legend to our map
  legend.addTo(myMap);
});

