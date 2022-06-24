{
/*instanciation*/
mviewer.customLayers.occurence_public_filter = {};
var occurence_public_filter = mviewer.customLayers.occurence_public_filter;

/*style*/
occurence_public_filter.legend = { items: [
    {
        label: "Occurence",
        geometry: "Point",
        styles: [new ol.style.Style({
			image: new ol.style.Circle({
        fill: new ol.style.Fill({
            color: '#848484'
        }),
        stroke: new ol.style.Stroke({
            color: "#ffffff",
            width: 1
        }),
        radius: 7
		})
		})]
    }
] };


/*création de la couche ol*/
mviewer.customLayers.occurence_public_filter.layer = new ol.layer.Vector({
	source: new ol.source.Vector({
		url: function (extent) {
			if(extent){
				return (
					'https://magosm.magellium.com/geoserver/wfs?service=WFS&' +
					'version=1.1.0&request=GetFeature&typename=magosm:france_telecom_fibre_connection_point&' +
					'outputFormat=application/json&srsname=EPSG:3857&' +
					'bbox=' +
					extent.join(',') +
					',EPSG:3857'
				  );
			}else{
				return (
					'https://magosm.magellium.com/geoserver/wfs?service=WFS&' +
					'version=1.1.0&request=GetFeature&typename=magosm:france_telecom_fibre_connection_point&' +
					'srsname=EPSG:3857&'
				  );
			}
			
		},
		strategy: ol.loadingstrategy.bbox,
		format: new ol.format.GeoJSON()
	}),
        style: function(feature, resolution) {
            return occurence_public_filter.legend.items[0].styles;
        }

});

mviewer.customLayers.occurence_public_filter.handle = false;
}