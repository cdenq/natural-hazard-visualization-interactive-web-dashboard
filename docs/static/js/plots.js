// --------------------
// GRAPH FUNCTION
// --------------------
function graph(data, data2) {
    // mpa tile layers
    const graymap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // map options
    const map = L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 3,
    layers: [graymap, topo]
    });

    // graymap add
    graymap.addTo(map);

    // vars for layers
    const tectonicplates = new L.LayerGroup();
    const earthquakes = new L.LayerGroup();

    // setting options
    const baseMaps = {
    Grayscale: graymap,
    Topography: topo
    };

    // overlap options
    const overlays = {
    "Tectonic Plates": tectonicplates,
    Earthquakes: earthquakes
    };

    // control for options
    L
    .control
    .layers(baseMaps, overlays)
    .addTo(map);

    // geojason layer
    L.geoJson(data, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
        layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
            );
        }
    }).addTo(earthquakes)

    // earthquake layer added
    earthquakes.addTo(map);

    // legend object
    const legend = L.control({
        position: "bottomright"
    });

    // legend deets
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");

        const grades = [-10, 10, 30, 50, 70, 90];
        const colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // adding annotations
        for (let i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // put legend
    legend.addTo(map);
    
    // add data2 to layer
    L.geoJson(data2, {
        color: "orange",
        weight: 2
    })
    .addTo(tectonicplates);
    tectonicplates.addTo(map);

    return
}

// --------------------
// STYLE FUNCTION
// --------------------
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
};

// --------------------
// COLOR FUNCTION
// --------------------
function getColor(depth) {
    switch (true) {
    case depth > 90:
        return "#ea2c2c";
    case depth > 70:
        return "#ea822c";
    case depth > 50:
        return "#ee9c00";
    case depth > 30:
        return "#eecc00";
    case depth > 10:
        return "#d4ee00";
    default:
        return "#98ee00";
    };
};

// --------------------
// STYLE FUNCTION
// --------------------
function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
};