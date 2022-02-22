// --------------------
// VARS
// --------------------
let filepath = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let filepath2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// --------------------
// LOAD FUNCTION
// --------------------
async function load(filepath) {
  const response = await fetch(filepath);
  const data = await response.json();
  // console.log(data);
  return data
}

// --------------------
// MAIN
// --------------------
async function main() {
  data = await load(filepath);
  data2 = await load(filepath2);
  // console.log(data);
  graph(data, data2);
}

// --------------------
// init
// --------------------
main();
