const layerURL =
  "https://www.geo2france.fr/geoserver/pci/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=pci%3Ageo_parcelle_2023&outputFormat=application%2Fjson";

{
  mviewer.customLayers.parcelles = {};
  mviewer.customLayers.parcelles.layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      // use url as function to load feature dynamically
      url: (extent) => `${layerUrl}&bbox=${extent}`,
      format: new ol.format.GeoJSON(),
      // to load features by current bbox geom
      strategy: ol.loadingstrategy.bbox,
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "rgba(46,83,103,0.6)",
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: "rgba(0, 0, 0, 0)",
      }),
    }),
  });
  mviewer.customLayers.parcelles.handle = false;
}
