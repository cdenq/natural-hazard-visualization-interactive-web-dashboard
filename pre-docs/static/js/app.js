// --------------------
// VARS
// --------------------
let filepath = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

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
  // console.log(data);
  map(data);
}

// --------------------
// init
// --------------------
main();
