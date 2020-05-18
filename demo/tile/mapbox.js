// Styles for the mapbox-streets-v6 vector tile data set. Loosely based on
// http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6.json
/* need <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL"></script>
    <script src="https://openlayers.org/en/v5.3.0/examples/resources/mapbox-streets-v6-style.js"></script>
*/

const mapboxkey = 'pk.eyJ1Ijoic3BlbGhhdGUiLCJhIjoiY2s4ZmxvOTRiMDRsajNpczlicjBrMzIwbyJ9.w4Q_vR68XR_Yi2ss6Ac3pg';
const layer = new ol.layer.VectorTile({
    declutter: true,
    source: new ol.source.VectorTile({
      attributions: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
        '© <a href="https://www.openstreetmap.org/copyright">' +
        'OpenStreetMap contributors</a>',
      format: new ol.format.MVT(),
      url: 'https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/' +
          '{z}/{x}/{y}.vector.pbf?access_token=' + mapboxkey
    }),
    style: createMapboxStreetsV6Style(ol.style.Style, ol.style.Fill, ol.style.Stroke, ol.style.Icon, ol.style.Text)
});


new CustomLayer("mapbox", layer);

$("#map").css('background', '#f8f4f0');