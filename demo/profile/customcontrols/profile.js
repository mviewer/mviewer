mviewer.customControls.profile = (function() {
    /*
     * Private
     */
    var _idlayer = 'profile';

    var _draw;

    var _source;

    var _vector;

    var _line;

    var _chart;

    var _rawdata;

    var _feature;

    var _sequence;

    var _referentiel;

    var _enableUpdate;

    var _formatDistance = function(d) {
        var result = "";
        if (d < 1000) {
            result = d + " m";
        } else {
            result = (d / 1000).toFixed(1) + " km";
        }
        return result;
    };


    var _initChart = function() {
        var target = parseInt($("#profile-view").val()) || 0;
        var height = ["150px", "200px"]
        console.log( "Initialisation" );
        var chartPanel = ['<div class="profile-addon panel-graph" style="height: '+height[target]+';">',
            '<canvas class="chart1" id="profile-chart"></canvas></div>'].join("");

        if (target === 0) {
            $("#profile-addon").append(chartPanel);
        } else {
            $("#bottom-panel .popup-content").append(chartPanel);
        }
        $(".profile-addon.panel-graph").mouseout(function() {
            mviewer.hideLocation();
        });
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            spanGaps: false,
            elements: {
                line: {
                    tension: 0.000001
                }
            },
            plugins: {
                filler: {
                    propagate: false
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var point = [_rawdata[tooltipItem.index][1], _rawdata[tooltipItem.index][2]];
                        var d = parseFloat(_rawdata[tooltipItem.index][0]);
                        var d2 = _formatDistance(d);
                        mviewer.showLocation('EPSG:3857', point[0], point[1]);
                        return ["distance : " + _formatDistance(d), "altitude : " + parseInt(data.datasets[0].data[tooltipItem.index]).toLocaleString() + " m"];
                    }
                }
            }
        };
        _chart = new Chart("profile-chart", {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    backgroundColor: "rgba(61,179,158, 0.6)",
                    borderColor: "rgba(61,179,158, 1)",
                    pointBackgroundColor: "rgba(61,179,158, 1)",
                    pointBorderColor: "rgba(61,179,158, 1)",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: "rgba(61,179,158, 1)",
                    data: [],
                    label: 'Altitude',
                    fill: "#00FF00"
                }]
            },
            options: options
        });

    };

    var _drawChart = function(data) {
        var chart_target = parseInt($("#profile-view").val());
        // test if element exists
        _chart.data.labels = data.labels;
        _chart.data.datasets[0].data = data.data;
        _chart.update();
        if (chart_target == 1) {
            $("#bottom-panel").addClass("active").css("max-height", 250);
        } else {
            $("#bottom-panel").removeClass("active");
        }

    };


    var _updateChart = function(dataxml) {
        var response = $.xml2json(dataxml);
        console.log(response);
        if (response.Status.ProcessSucceeded) {
            var result = JSON.parse(response.ProcessOutputs.Output.Data.LiteralData);
            var mydata = {
                "labels": [],
                "data": []
            };
            _rawdata = result.profile.points;
            result.profile.points.forEach(function(p, i) {
                if (i == 0 || i == result.profile.points.length - 1) {
                    mydata.labels.push(_formatDistance(parseFloat(p[0])));
                } else {
                    mydata.labels.push("");
                }
                mydata.data.push(p[3]);
            });
            _drawChart(mydata);
        } else {
            mviewer.alert(response.Status.ProcessFailed.ExceptionReport.Exception.ExceptionText, "alert-info");
        }
        $("#loading-profile").hide();
    };

    var _executeWPS = function(feature) {
        $("#loading-profile").show();
        _feature = feature;
        var wpsIdentifier = "getProfileProcess";
        var frequence = parseInt($("#profile-frequence").val()) || 200;
        var projection = 3857;
        var referentiel = $("#profile-referentiel").val() || "bdalti";
        var lineString = feature.getGeometry().getCoordinates().join(" ");
        var xml = ['<?xml version="1.0" encoding="UTF-8"?>',
            '<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" version="1.0.0"',
            ' service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">',
            '<ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">' + wpsIdentifier + '</ows:Identifier>',
            '<wps:DataInputs>',
            '<wps:Input>',
            '<ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">distance</ows:Identifier>',
            '<ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">Distance, pas utilise</ows:Title>',
            '<wps:Data><wps:LiteralData>' + frequence + '</wps:LiteralData></wps:Data>',
            '</wps:Input>',
            '<wps:Input>',
            '<ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">outputformat</ows:Identifier>',
            '<ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">Format genere en sortie</ows:Title>',
            '<wps:Data><wps:LiteralData>json</wps:LiteralData></wps:Data>',
            '</wps:Input>',
            '<wps:Input>',
            '<ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">data</ows:Identifier>',
            '<ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">Geometrie au format GML</ows:Title>',
            '<wps:Data><wps:ComplexData mimeType="text/xml">',
            '<![CDATA[<wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs">',
            '<gml:featureMember xmlns:gml="http://www.opengis.net/gml">',
            '<feature:features xmlns:feature="http://mapserver.gis.umn.edu/mapserver" fid="OpenLayers_Feature_Vector_319">',
            '<feature:geometry><gml:LineString><gml:coordinates decimal="." cs="," ts=" ">',
            lineString,
            '</gml:coordinates></gml:LineString></feature:geometry>',
            /*'<feature:profile>1</feature:profile><feature:color>FF0000</feature:color>',*/
            '</feature:features></gml:featureMember></wfs:FeatureCollection>]]>',
            '</wps:ComplexData></wps:Data>',
            '</wps:Input>',
            '<wps:Input>',
            '<ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">projection</ows:Identifier>',
            '<ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">Projection - code EPSG utilise</ows:Title>',
            '<wps:Data><wps:LiteralData>' + projection + '</wps:LiteralData></wps:Data>',
            '</wps:Input>',
            '<wps:Input>',
            '<ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">referentiel</ows:Identifier>',
            '<ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">Referentiel utilise en entree</ows:Title>',
            '<wps:Data><wps:LiteralData>' + referentiel + '</wps:LiteralData></wps:Data>',
            '</wps:Input>',
            '</wps:DataInputs>',
            '<wps:ResponseForm><wps:ResponseDocument storeExecuteResponse="true">',
            '<wps:Output asReference="false">',
            '<ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">result</ows:Identifier>',
            '<ows:Title xmlns:ows="http://www.opengis.net/ows/1.1"/><ows:Abstract xmlns:ows="http://www.opengis.net/ows/1.1"/>',
            '</wps:Output></wps:ResponseDocument></wps:ResponseForm></wps:Execute>'
        ].join('');

        $.ajax({
            type: "POST",
            url: mviewer.ajaxURL("https://geobretagne.fr/wps/mnt"),
            data: xml,
            contentType: "text/xml",
            dataType: "xml",
            success: _updateChart,
            error: function(xhr, ajaxOptions, thrownError) {
                mviewer.alert("Problème avec la requête.\n" + thrownError, "alert-info");
                $("#loading-profile").hide();
            }
        });
        $("#profile-update").prop('disabled', true);
    };

    return {
        /*
         * Public
         */

        init: function() {
            // mandatory - code executed when panel is opened
            info.disable();
            _enableUpdate = false;
            // hack to hide slider opacity
            $(".mv-layer-options[data-layerid='profile'] .form-group-opacity").hide();

            if (typeof Chart === 'function') {
                _initChart();
            } else {
                $.get('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js', function() {
                    _initChart();

                });
            }

        },

        drawLine: function() {
            var shadowStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "rgba(255,255,255, 0.7)",
                    width: 6
                }),
                zIndex: 1
            });

            var style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: "rgba(61,179,158, 1)",
                    width: 2
                }),
                zIndex: 2
            });

            _draw = new ol.interaction.Draw({
                type: 'LineString'
            });
            mviewer.customLayers.profile.layer.getSource().clear();
            _draw.on('drawend', function(event) {
                _line = event.feature.getGeometry().getCoordinates();
                _feature = event.feature;
                _executeWPS(event.feature);
                //Add styled feature to the map
                event.feature.setStyle([shadowStyle, style]);
                mviewer.customLayers.profile.layer.getSource().addFeature(event.feature);
                mviewer.getMap().removeInteraction(_draw);
            });
            mviewer.getMap().addInteraction(_draw);


        },

        updateChart: function() {
            if (_feature) {
                _executeWPS(_feature);
            } else {
                mviewer.alert("Veuillez tracer une ligne...", "alert-info");
            }
        },

        updateTarget: function (target) {
            _chart.destroy();
            $(".profile-addon.panel-graph").remove();
            _initChart();
            this.updateChart();
        },

        updateOptions: function(e) {
            _enableUpdate = true;
            $("#profile-update").prop('disabled', false);
        },

        destroy: function() {
            // mandatory - code executed when panel is closed
            _draw = null;
            _line = null;
            _chart.destroy();
            _rawdata = null;
            _sequence = null;
            _referentiel = null;
            _feature = null;
            _enableUpdate = null;
            $(".profile-addon.panel-graph").remove();
            mviewer.hideLocation();
            mviewer.customLayers.profile.layer.getSource().clear();
            info.enable();
        }
    };

}());