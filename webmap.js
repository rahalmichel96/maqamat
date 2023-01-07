// Import the leaflet package
var L = require('leaflet');
const axios = require('axios');
let urls = ['http://localhost:3000/coord', 'http://localhost:3000/desc'];
const requests = urls.map((url) => axios.get(url));

// Creates a leaflet map binded to an html <div> with id "map"
// setView will set the initial map view to the location at coordinates
// 13 represents the initial zoom level with higher values being more zoomed in
var map = L.map('map').setView([24.468333, 39.610833], 3);

// Adds the basemap tiles to your web map
// Additional providers are available at: https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 21
}).addTo(map);

axios.all(requests)
	.then(response => {
		for (let i = 0; i < response[0].data.length; ++i) {
			// Adds a popup marker to the webmap for GGL address
			L.circleMarker(response[0].data[i].split(',')).addTo(map)
				.bindPopup(
					response[1].data[i]
				);
		}
	})
	.catch(error => {
		console.log(error);
	});