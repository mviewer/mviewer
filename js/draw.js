var draw = (function () {

    var _map;

    var vectorDraw;

    var _projection;

    var _sourceDraw;

    var lastFeature;

    var _drawInt;

    /**
   * draw tool enabled.
   * @type {boolean}
   */
    
    var _modDrawEnabled = false;

    var _drawTooltipComponent;

    var _drawTooltip;

    var tooltip;

    let _snap;

    let _modify;

    let medianPointStyle = [ 
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 3,
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)',
            }),
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'orange',
                }),
            }),
            geometry: function (feature) {
                // return the coordinates of the first ring of the polygon
                const coordinates = feature.getGeometry().getCoordinates()[0];
                return new ol.geom.MultiPoint(coordinates);
            },
        }),
    ];

    var _styleDraw = new ol.style.Style({
        fill: new ol.style.Fill({
            color: "#f00",
        }),
        stroke: new ol.style.Stroke({
            color: "#000",
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: "#2fc2c3",
            }),
        }),
    });

    var isDrawing = false;

    var _createDrawTooltip = function (feature) {
        // if (_drawTooltipComponent) {
        //     _drawTooltipComponent.parentNode.removeChild(_drawTooltipComponent);
        // }

        // Creation of new HTML element
        _drawTooltipComponent = document.createElement("div");
        _drawTooltipComponent.className = "tooltip hidden";

        // Style of the overlay (top of the point)
        _drawTooltipComponent.style.backgroundColor = "white";
        _drawTooltipComponent.style.border = "1px solid black";
        _drawTooltipComponent.style.padding = "5px";
        _drawTooltipComponent.style.borderRadius = "4px";
        _drawTooltipComponent.style.fontSize = "12px";
        _drawTooltipComponent.style.color = "black";
        _drawTooltipComponent.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.5)";
        _drawTooltipComponent.style.whiteSpace = "nowrap"; // Avoid the return to the line

        _drawTooltip = new ol.Overlay({
            element: _drawTooltipComponent,
            offset: [0, -15],
            positioning: "bottom-center",
        });

        _map.addOverlay(_drawTooltip);

        feature.set("_drawTooltip", _drawTooltip);
        feature.set("_drawTooltipComponent", _drawTooltipComponent);

        return _drawTooltip;
    };

    var _enableDrawTool = function () {
        $("#drawoptions").show();
        $("#drawBtn").addClass("active");
        // _createWindowInfo("Polygon");

        _modDrawEnabled = true;
    }

    var _createWindowInfo = function (type) {

        console.log(type);

        let iconClass = type === "Point" ? "fas fa-map-pin" : "fas fa-draw-polygon";

        // Add HTML component modal to the DOM
        var windowInfo = [
            '<div id="myWindowInfo" class="hidden">',
                '<div class="window window-header">',
                    `<i class="${iconClass} icon-draw"></i>`,
                    '<input id="input-button" type="text" placeholder="Saisir le nom">',
                    '<i id="window-trash" class="icon-draw clickable fas fa-trash" onclick="draw.clearFeature()";></i>',
                    '<i id="window-close" class="icon-draw clickable far fa-times-circle" onclick="draw.disable();"></i>',
                '</div>',
            '</div>',
        ].join("");

        let existingWindowInfo = $("#myWindowInfo"); // We get the windowInfo
        if (existingWindowInfo.length) { 
            existingWindowInfo.replaceWith(windowInfo);
        } else {   
            $("#page-content-wrapper").append(windowInfo);
        };
        $("#myWindowInfo").removeClass("hidden");
    };

    var _calculateDistanceBtwPoint = function (point1, point2) {
        let distanceX = point1[0] - point2[0];
        let distanceY = point1[1] - point2[1];
        
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    };

    var _resetInteraction = function () {
        _map.removeInteraction(_drawInt);
        _map.removeInteraction(_snap);
    };

    var _addDrawInteraction = function (type) {

        if(isDrawing) {
            console.log("_resetInteraction");
            _resetInteraction();
        };

        _createWindowInfo(type);

        $("#myWindowInfo").removeClass("hidden");

        if(!isDrawing) {
            _drawInt = new ol.interaction.Draw({
                source: _sourceDraw,
                type: type
            });

            _snap = new ol.interaction.Snap ({
                source: _sourceDraw,
            });

            _map.addInteraction(_drawInt);
            _map.addInteraction(_snap);
        
            isDrawing = true;
        };

        _drawInt.on("drawstart", function(evt){
            
            $("#myWindowInfo").removeClass("forward"); // Surbrillance

            let feature = evt.feature; // We get the feature
            let geomFeature = feature.getGeometry(); // We get the geometry of the feature
            let inputNameFeature = (geomFeature.getType() === "Point") ? "Repère sans nom" : "Polygone sans nom";

            // Create a tooltip for a feature
            tooltip = _createDrawTooltip(feature);

            feature.set(geomFeature.getType() === "Point" ? "Nom du repère" : "Nom du polygone", inputNameFeature);

            _drawTooltipComponent.innerHTML = inputNameFeature;

            tooltip.setPosition(evt.target.sketchCoords_);

            $(_drawTooltipComponent).removeClass("hidden");

            lastFeature = feature;

        },this);

        _drawInt.on("drawend", function(evt) {

            feature = evt.feature;

            $("#myWindowInfo").addClass("forward");

            if(type === "LineString") {
                let geometry = feature.getGeometry();
                let coordinates = geometry.getCoordinates();

                let firstPoint = coordinates[0];
                let lastPoint = coordinates[coordinates.length - 1];

                let tolerance = 3000;

                if(_calculateDistanceBtwPoint(firstPoint, lastPoint) <= tolerance){
                    console.log("Same point");
                    let newGeometry = new ol.geom.Polygon([coordinates]);
                    feature.setGeometry(newGeometry);
                };

                let line = feature.getGeometry();
                let coordinatesLine = line.getType() === "LineString" ? line.getCoordinates() : line.getCoordinates()[0];
                // Create new empty array
                let newCoord = []; 
                let start;
                let end;
                // calculate median coordinates for each segment
                for (let i = 0; i < coordinatesLine.length - 1; i++) {
                    start = coordinatesLine[i];
                    end = coordinatesLine[i + 1];
                    
                    // Add the first point to the array
                    newCoord.push(start); 

                    // calculate median point coordinates
                    var midpoint = [
                        (start[0] + end[0]) / 2,
                        (start[1] + end[1]) / 2,
                    ];

                    // Add the middle point to the array
                    newCoord.push(midpoint); 

                };
                // Then, add the last point
                newCoord.push(end); 

                // Set new coordinates to the feature
                feature.getGeometry().setCoordinates(line.getType() === "LineString" ? newCoord : [newCoord]); 
            };

            let delai;
    
            document.getElementById("input-button").addEventListener("input", function() {

                // Reset the timer
                clearTimeout(delai); 
    
                let inputUser = document.getElementById("input-button").value;
            
                if(!inputUser) {
                    return;
                };
                

                feature.getGeometry().set(feature.getGeometry().getType() === "Point" ? "Nom du repère" : "Nom du polygone", inputUser);

                delai = setTimeout(function() {
                    _drawTooltipComponent.innerHTML = inputUser;
                    document.getElementById("input-button").value = "";
                    $("#myWindowInfo").removeClass("forward");
                },
                // Time in second 
                1000); 
            });

            _drawTooltipComponent.className = "tooltip2 tooltip-measure-static";

            _drawInt.setActive(false);

            isDrawing = false;

        },this);
    };

    var _deleteFeatureDraw = function () {
        _map.removeOverlay(tooltip);
        _sourceDraw.removeFeature(feature);
    };

    var _clearToolDraw = function () {
        $("#drawPoint").removeClass("active");
        $("#drawBtn").removeClass("active");
        $("#drawPolygon").removeClass("active");
        $("#drawoptions").hide();
        $("#myWindowInfo").addClass("hidden");
        $("#myWindowInfo").removeClass("forward");
        let inputButton = document.getElementById("inputButton");
        if(inputButton) {
            inputButton.value = "";
        }
    };

    // Clear all element add on the map
    var _clearOldDraw = function () {
        _sourceDraw.clear();
        $(".tooltip-measure-static").remove();
    };

    /**
     * _resetToolDraw. used to reset this tool
     */
    var _resetToolDraw = function () {
        _clearOldDraw();
        _map.removeInteraction(_drawInt);
        _map.removeOverlay(_drawTooltip);
        _modDrawEnabled = false;
        _clearToolDraw();
    };

    /**
     * Public Method: _toggle exported as toggle
     *
     * Description
     **/
    var _toggle = function () {
        console.log("Toggle function called");
        if(_modDrawEnabled) { // If the module draw is active
            console.log("Disabling draw tool");
            mviewer.unsetTool("draw");
        } else { // If the module draw is not active
            console.log("Enabling draw tool");
            mviewer.setTool("draw", "Polygon");
        };
    };
 
    var _initToolDraw = function () {
        _map = mviewer.getMap();
        _projection = mviewer.getProjection().getCode(); // For change the projection if necessary
        _sourceDraw = new ol.source.Vector(); // New source
        vectorDraw = new ol.layer.Vector({ // New vector
            source: _sourceDraw,
            style: medianPointStyle,
        });

        _modify = new ol.interaction.Modify ({
            source: _sourceDraw,
        });
    
        _map.addInteraction(_modify);

        // Add HTML elements to the DOM
        var button = [
            '<button class="mv-modetools btn btn-default btn-raised" href="#"',
            ' onclick="mviewer.tools.draw.toggle();" id="drawBtn" title="Dessiner" i18n="draw.button.main"',
            ' tabindex="118 " accesskey="4">',
            '<i class="fas fa-pencil-ruler"></i>',
            "</button>",
        ].join("");
        var buttonoptions = [
            '<div id="drawoptions" style="display:none;" class="btn-group btn-group-sm"',
            ' role="group" aria-label="true">',
            '<button id="drawPoint" title="Point" i18n="draw.button.point" type="Point"',
            ' class="btn btn-default button-tools" onclick="draw.addDrawInteraction(\'Point\');">',
            '<i class="fas fa-map-pin"></i>',
            "</button>",
            '<button id="drawPolygon" title="Trajet ou Polygone" type="LineString"',
            ' class="btn btn-default button-tools" i18n="draw.button.line" onclick="draw.addDrawInteraction(\'LineString\');">',
            '<i class="fas fa-draw-polygon"></i>',
            "</button>",
            "</div>",
        ].join("");

        $("#toolstoolbar").append(button);
        $(buttonoptions).insertAfter("#toolstoolbar");

        _map.addLayer(vectorDraw);
    };

    return {
        init: _initToolDraw,
        enable: _enableDrawTool,
        toggle: _toggle,
        disable: _resetToolDraw,
        addDrawInteraction: _addDrawInteraction,
        clearFeature: _deleteFeatureDraw,
    };
})();