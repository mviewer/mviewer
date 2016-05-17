var idlayer = 'lycee';
mviewer.customControls[idlayer] = {};
var layerDefinition = mviewer.getLayer(idlayer);
console.log(layerDefinition);
var source = layerDefinition.layer.getSource();

mviewer.customControls[idlayer].setStyle = function  (style) {
    source.getParams()['STYLES'] = style;
    layerDefinition.style = style;
    layerDefinition.fields = ["nom", "libelle"];
    layerDefinition.aliases = ["Truc", "Muche"];
    source.changed();
    var legendUrl = mviewer.setLayerLegend(layerDefinition);
    $("#legend-" + idlayer).attr("src", legendUrl);    
};