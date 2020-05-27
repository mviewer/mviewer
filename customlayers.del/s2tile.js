{
mviewer.customLayers.s2tile = {};
var s2tile = mviewer.customLayers.s2tile;

s2tile.legend = { items: [
    {
        label: "SENTINEL 2",
        geometry: "Polygon",
        styles: [new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'rgba(52, 152, 219, 0.1)',
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(52, 152, 219, 0.1)'
          })
        })]
    }
] };
mviewer.customLayers.s2tile.layer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: s2tile.legend.styles
});
mviewer.customLayers.s2tile.handle = false;
}
