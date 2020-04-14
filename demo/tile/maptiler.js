// Styles for the mapbox-streets-v6 vector tile data set. Loosely based on
// http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6.json
/* need <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://openlayers.org/en/v5.3.0/examples/resources/mapbox-streets-v6-style.js"></script>
*/

const maptilerkey = 'HIkwGFOll1LXr7hhVnMf';
const layer = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      attributions: '© <a href="https://www.maptiler.com/copyright/">MapTiler</a> ' +
        '© <a href="https://www.openstreetmap.org/copyright">' +
        'OpenStreetMap contributors</a>',
      format: new ol.format.MVT(),
      url: 'https://api.maptiler.com/tiles/v3/' +
          '{z}/{x}/{y}.pbf?key=' + maptilerkey
    }),
    style: createMapboxStreetsV6Style(ol.style.Style, ol.style.Fill, ol.style.Stroke, ol.style.Icon, ol.style.Text)
});


new CustomLayer("maptiler", layer);
