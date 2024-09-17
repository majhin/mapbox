const currentLocation = [-36.802237, 12.913736];

// Mapbox Public Token
mapboxgl.accessToken =
	"pk.eyJ1IjoibWFqaGluIiwiYSI6ImNtMTY1Y2E1YTBleTcya3M4ZmNkOHI4Y3gifQ.EPgpRe-4z1oVuDk-6YmfwA";

// Initializing the map with current location as center
const map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/streets-v12",
	center: currentLocation ?? [0, 0], // Initial center
	zoom: 0,
	projection: "mercator", //Turns off 3D Globe
});

// Coordinates for the markers
const coordinates = {
	start: [19.076, 72.8777], // Starting Location of Shipment
	...(currentLocation ? { middle: currentLocation } : {}), // Current Location of Shipment
	end: [40.7128, -74.006], // Ending Location of Shipment
};

// Add markers
let middleMarker = null;

if (currentLocation) {
	const markerImage = document.createElement("img");
	markerImage.src = "mid.svg";
	markerImage.style.width = "35px";
	markerImage.style.height = "35px";
	middleMarker = new mapboxgl.Marker({
		element: markerImage,
	})
		.setLngLat(coordinates.middle)
		.setPopup(new mapboxgl.Popup().setHTML("<h3>Middle🦜</h3>"))
		.addTo(map);
}

const startMarker = new mapboxgl.Marker({ color: "green" })
	.setLngLat(coordinates.start)
	.setPopup(new mapboxgl.Popup().setHTML("<h3>Start🏴‍☠️</h3>"))
	.addTo(map);

const endMarker = new mapboxgl.Marker({ color: "red" })
	.setLngLat(coordinates.end)
	.setPopup(new mapboxgl.Popup().setHTML("<h3>End🎅</h3>"))
	.addTo(map);

const wholePath = Object.keys(coordinates).map((key) => coordinates[key]);

// Draw a curved line
map.on("load", function () {
	// Create an arc between the points
	const line = turf.lineString(wholePath);
	const curvedPath = turf.bezierSpline(line, {
		resolution: 100000,
		sharpness: 1,
	});

	// Add the curved line as a source
	map.addSource("route", {
		type: "geojson",
		data: curvedPath, // Use the curved path data
	});

	// Add a layer to display the line
	map.addLayer({
		id: "route",
		type: "line",
		source: "route",
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
		paint: {
			"line-color": "black",
			"line-width": 4,
			"line-dasharray": [2, 2], // space between dots
		},
	});
});
