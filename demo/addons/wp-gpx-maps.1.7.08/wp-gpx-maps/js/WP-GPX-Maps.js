/*
Plugin Name: WP-GPX-Maps
Plugin URI: http://www.devfarm.it/
Description: Draws a gpx track with altitude graph
Version: 1.6.02
Author: Bastianon Massimo
Author URI: http://www.devfarm.it/
*/


let wpgpxmaps_FEET_MILES = "1";
let wpgpxmaps_METERS_KILOMETERS = "2";
let wpgpxmaps_METERS_NAUTICALMILES = "3";
let wpgpxmaps_METER_MILES = "4";
let wpgpxmaps_FEET_NAUTICALMILES = "5";
let wpgpxmaps_MINUTES_PER_100METERS = "6";
let wpgpxmaps_KNOTS = "5";
let wpgpxmaps_MINUTES_PER_MILES = "4";
let wpgpxmaps_MINUTES_PER_KM = "3";
let wpgpxmaps_MILES_PER_HOURS = "2";
let wpgpxmaps_KM_PER_HOURS = "1";

var WPGPXMAPS = {

	Utils: {

		/* In case of multiple polylines this function divide the points of each polyline. */
		DividePolylinesPoints: function( mapData ) {

			var lastCut = 0;
			var result = [];
			var _len = mapData.length;

			for ( i = 0; i < _len; i++ ) {
				if ( null == mapData[i]) {
					result.push( mapData.slice( lastCut == 0 ? 0 : lastCut + 1, i ) );
					lastCut = i;
				}
			}
			if ( ( _len - 1 ) != lastCut ) {
				result.push( mapData.slice( lastCut ) );
			}
			return result;

		},

		GetItemFromArray: function( arr, index ) {
			try {
				return arr[index];
			} catch ( e ) {
				return [ 0, 0 ];
			}
		}

	},

	MapEngines: {

		/* NOT WORKING AND TESTED! old code copy&paste */
		GoogleMaps: function() {

			var ngImageMarkers = [];

			this.map = null,
			this.EventSelectChart = null,
			this.Polylines = [],
			this.init = function( targetElement, mapType, scrollWheelZoom, ThunderforestApiKey ) {
				var mapTypeIds = [];
				for ( var type in google.maps.MapTypeId ) {
					mapTypeIds.push( google.maps.MapTypeId[type]);
				}

				mapTypeIds.push( 'OSM1' );
				mapTypeIds.push( 'OSM2' );
				mapTypeIds.push( 'OSM3' );
				mapTypeIds.push( 'OSM4' );
				mapTypeIds.push( 'OSM5' );
				//mapTypeIds.push( 'OSM6' );

				switch ( mapType ) {
					case 'TERRAIN': { mapType = google.maps.MapTypeId.TERRAIN; break;}
					case 'SATELLITE': { mapType = google.maps.MapTypeId.SATELLITE; break;}
					case 'ROADMAP': { mapType = google.maps.MapTypeId.ROADMAP; break;}
					case 'OSM1': { mapType = 'OSM1'; break;}
					case 'OSM2': { mapType = 'OSM2'; break;}
					case 'OSM3': { mapType = 'OSM3'; break;}
					case 'OSM4': { mapType = 'OSM4'; break;}
					case 'OSM5': { mapType = 'OSM5'; break;}
					//case 'OSM6': { mapType = 'OSM6'; break;}
					default: { mapType = google.maps.MapTypeId.HYBRID; break;}
				}

				if ( 'TERRAIN' == mapType || 'SATELLITE' == mapType || 'ROADMAP' == mapType ) {

					// Google maps.

				} else {

					// Show OpenStreetMaps credits.

					$( el_osm_credits ).show();
				}

				this.map = new google.maps.Map( el_map, {
					mapTypeId: mapType,
					scrollwheel: ( 'true' == zoomOnScrollWheel ),
					mapTypeControlOptions: {
						style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
						mapTypeIds: mapTypeIds
					}
				});

				/* Map type: Open Street Mao */
				this.map.mapTypes.set( 'OSM1', new google.maps.ImageMapType({
					getTileUrl: function( coord, zoom ) {
						return 'https://tile.openstreetmap.org/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
					},
					tileSize: new google.maps.Size( 256, 256 ),
					name: 'OSM',
					alt: 'Open Street Map',
					maxZoom: 18
				}) );

				/* Map type: Thunderforest - Open Cycle Map with API key or Open Cycle Map - Cycle */
				this.map.mapTypes.set( 'OSM2', new google.maps.ImageMapType({
					getTileUrl: function( coord, zoom ) {
						if ( hasThunderforestApiKey ) {
							return 'https://a.tile.thunderforest.com/cycle/' + zoom + '/' + coord.x + '/' + coord.y + '.png?apikey=' + ThunderforestApiKey;
						} else {
							return 'http://a.tile.opencyclemap.org/cycle/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
						}
					},
					tileSize: new google.maps.Size( 256, 256 ),
					name: 'TF-OCM',
					alt: 'Thunderforest - Open Cycle Map',
					maxZoom: 18
				}) );

				/* Map type: Thunderforest - Transport with API key */
				this.map.mapTypes.set( 'OSM3', new google.maps.ImageMapType({
					getTileUrl: function( coord, zoom ) {
						return 'https://a.tile.thunderforest.com/outdoors/' + zoom + '/' + coord.x + '/' + coord.y + '.png?apikey=' + ThunderforestApiKey;
					},
					tileSize: new google.maps.Size( 256, 256 ),
					name: 'TF-Outd',
					alt: 'Thunderforest - Outdoors',
					maxZoom: 18
				}) );

				/* Map type: Thunderforest - Transport with API key */
				this.map.mapTypes.set( 'OSM4', new google.maps.ImageMapType({
					getTileUrl: function( coord, zoom ) {
						return 'https://a.tile.thunderforest.com/transport/' + zoom + '/' + coord.x + '/' + coord.y + '.png?apikey=' + ThunderforestApiKey;
					},
					tileSize: new google.maps.Size( 256, 256 ),
					name: 'TF-Tran',
					alt: 'Thunderforest - Transport',
					maxZoom: 18
				}) );

				/* Map type: Thunderforest - Landscape with API key */
				this.map.mapTypes.set( 'OSM5', new google.maps.ImageMapType({
					getTileUrl: function( coord, zoom ) {
						return 'https://a.tile.thunderforest.com/landscape/' + zoom + '/' + coord.x + '/' + coord.y + '.png?apikey=' + ThunderforestApiKey;
					},
					tileSize: new google.maps.Size( 256, 256 ),
					name: 'TF-Land',
					alt: 'Thunderforest - Landscape',
					maxZoom: 18
				}) );

				/* Map type: MapToolKit - Terrain */
				//this.map.mapTypes.set( 'OSM6', new google.maps.ImageMapType({
				//	getTileUrl: function( coord, zoom ) {
				//		return 'https://tile2.maptoolkit.net/terrain/' + zoom + '/' + coord.x + '/' + coord.y + '.png';
				//	},
				//	tileSize: new google.maps.Size( 256, 256 ),
				//	name: 'MTK-Terr',
				//	alt: 'MapToolKit - Terrain',
				//	maxZoom: 18
				//}) );
			},

			this.AppPolylines = function( mapData, color1, currentIcon, startIcon, endIcon ) {

				var points = [];
				var lastCut = 0;
				var polylinenes = [];
				var polyline_number = 0;
				var color = 0;
				for ( i = 0; i < mapData.length; i++ ) {
					if ( null == mapData[i]) {
						var poly = new google.maps.Polyline({
							path: points.slice( lastCut, i ),
							strokeColor: color,
							strokeOpacity: .7,
							strokeWeight: 4,
							map: this.map
						});
						polylinenes.push( poly );
						lastCut = i;
						polyline_number = polyline_number + 1;

						// var p = new google.maps.LatLng(mapData[i-1][0], mapData[i-1][1]);
						// points.push(p);
						// bounds.extend(p);

					} else {
						var p = new google.maps.LatLng( mapData[i][0], mapData[i][1]);
						points.push( p );
						bounds.extend( p );
					}
				}

				if ( points.length != lastCut ) {
					if ( polyline_number < color1.length ) {
						color = color1[polyline_number];
					} else {
						color = color1[color1.length - 1];
					}
					var poly = new google.maps.Polyline({
						path: points.slice( lastCut ),
						strokeColor: color,
						strokeOpacity: .7,
						strokeWeight: 4,
						map: this.map
					});
					polylinenes.push( poly );
					currentPoints = [];
					polyline_number = polyline_number + 1;
				}

				if ( startIcon != '' ) {
					var startIconImage = new google.maps.MarkerImage( startIcon );
					var startMarker = new google.maps.Marker({
						position: points[0],
						map: this.map,
						title: 'Start',
						animation: google.maps.Animation.DROP,
						icon: startIconImage,
						zIndex: 10
					});

				}

				if ( endIcon != '' ) {
					var endIconImage = new google.maps.MarkerImage( endIcon );
					var startMarker = new google.maps.Marker({
						position: points[ points.length -1 ],
						map: this.map,
						title: 'End',
						animation: google.maps.Animation.DROP,
						icon: endIconImage,
						zIndex: 10
					});

				}

				var first = WPGPXMAPS.Utils.GetItemFromArray( mapData, 0 );

				if ( currentIcon == '' ) {
					currentIcon = 'https://maps.google.com/mapfiles/kml/pal4/icon25.png';
				}

				var current = new google.maps.MarkerImage( currentIcon,
					new google.maps.Size( 32, 32 ),
					new google.maps.Point( 0, 0 ),
					new google.maps.Point( 16, 16 )
				);

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng( first[0], first[1]),
					title: 'Current',
					icon: current,
					map: this.map,
					zIndex: 10
				});

				for ( i = 0; i < polylinenes.length; i++ ) {
					google.maps.event.addListener( polylinenes[i], 'mouseover', function( event ) {
						if ( marker ) {
							marker.setPosition( event.latLng );
							marker.setTitle( lng.currentPosition );
							if ( myChart ) {
								var l1 = event.latLng.lat();
								var l2 = event.latLng.lng();
								var ci = getClosestIndex( mapData, l1, l2 );
								var activeElements = [];
								var seriesLen = myChart.data.datasets.length;
								for ( var i = 0; i < seriesLen;i++ ) {
									activeElements.push( myChart.chart.getDatasetMeta( i ).data[ci]);
								}
								if ( activeElements.length > 0 ) {
									myChart.options.customLine.x = activeElements[0]._model.x;
									if ( isNaN( myChart.tooltip._eventPosition ) ) {
										myChart.tooltip._eventPosition = {
												x: activeElements[0]._model.x,
												y: activeElements[0]._model.y
											};
									}
									myChart.tooltip._active = activeElements;
									myChart.tooltip.update ( true );
									myChart.draw();
								}

							}
						}
					});
				}
			},
			this.AddWaypoints = function( waypoints, waypointIcon ) {
			},
			this.MoveMarkerToPosition = function( LatLon, updateChart ) {
			};
		},

		Leaflet: function() {
			this.Bounds = [],
			this.lng = {},
			this.map = null,
			this.EventSelectChart = null,
			this.Polylines = [],
			this.CurrentPositionMarker = null,
			this.CurrentGPSPositionMarker = null,
			this.init = function( targetElement, mapType, scrollWheelZoom, ThunderforestApiKey ) {

				this.map = L.map( targetElement,
					{
						scrollWheelZoom: scrollWheelZoom
					}
				);

				/* create fullscreen control. */
				var fsControl = new L.Control.FullScreen();

				/* Add fullscreen control to the map. */
				this.map.addControl( fsControl );

				L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: 'Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				}).addTo( this.map );

				var hasThunderforestApiKey = ( ThunderforestApiKey + '' ).length > 0;

				var baseMaps = {};

				var overlayMaps = { };

				var defaultMpaLayer = null;

				if ( hasThunderforestApiKey ) {

					/* Map type: Thunderforest - OpenCycleMap with API key */
					baseMaps['Thunderforest - Cycle'] = L.tileLayer( 'https://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=' + ThunderforestApiKey, {
						maxZoom: 18,
						attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors, ' +
							'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
							'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
					});

				} else {

					/* Map type: Open Cycle Map - Cycle */
					baseMaps['Open Cycle Map'] = L.tileLayer( 'http://a.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
						maxZoom: 18,
						attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors, ' +
							'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
							'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
					});

				}

				/* Map type: Thunderforest - Outdoors with API key */
				baseMaps['Thunderforest - Outdoors'] = L.tileLayer( 'https://a.tile.thunderforest.com/outddors/{z}/{x}/{y}.png?apikey=' + ThunderforestApiKey, {
					maxZoom: 18,
					attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors, ' +
						'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				});

				/* Map type: Thunderforest - Transport with API key */
				baseMaps['Thunderforest - Transport'] = L.tileLayer( 'https://a.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=' + ThunderforestApiKey, {
					maxZoom: 18,
					attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors, ' +
						'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				});

				/* Map type: Thunderforest - Landscape with API key */
				baseMaps['Thunderforest - Landscape'] = L.tileLayer( 'https://a.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=' + ThunderforestApiKey, {
					maxZoom: 18,
					attribution: 'Maps &copy; <a href="https://www.thunderforest.com/">Thunderforest</a> contributors, ' +
						'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				});

				/* Map type: Open Street Map */
				baseMaps['Open Street Map'] = L.tileLayer( 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: 'Maps &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
						'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				});

				///* Map type: MapToolKit - Terrain */
				//baseMaps['MapToolKit - Terrain'] = L.tileLayer( 'https://tile2.maptoolkit.net/terrain/{z}/{x}/{y}.png', {
				//	maxZoom: 18,
				//	attribution: 'Maps &copy; <a href="https://www.maptoolkit.net/">Maptoolkit</a> contributors, ' +
				//		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				//		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				//});

				/* Map type: Open Street Map - Humanitarian Map Style */
				baseMaps['Humanitarian Map Style'] = L.tileLayer( 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: 'Maps &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
						'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				});

				/*
				Map type: Open Ski Map
				baseMaps['Open Ski Map'] = L.tileLayer( 'http://tiles.skimap.org/openskimap/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
						'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				});
				*/

				/* Map type: Hike & Bike */
				baseMaps['Hike & Bike'] = L.tileLayer( 'http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: 'Maps &copy; <a href="https://hikebikemap.org/">Hike & Bike Map</a> contributors, ' +
						'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				});

				/* Map type: Open Sea Map */
				baseMaps['Open Sea Map'] = L.tileLayer( 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: 'Maps &copy; <a href="https://www.openseamap.org/">OpenSeaMap</a> contributors, ' +
						'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				});
				
				baseMaps['GSI Map (Japan)'] = L.tileLayer( 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
				});

				switch ( mapType ) {

					/* Map type: Open Street Map */
					case 'OSM1': {
						baseMaps['Open Street Map'].addTo( this.map );
						break;
					}

					/* Map type: Thunderforest - Open Cycle Maps with API key */
					case 'OSM2': {
						baseMaps['Thunderforest - Cycle'].addTo( this.map );
						break;
					}

					/* Map type: Thunderforest - Outdoors with API key */
					case 'OSM3': {
						baseMaps['Thunderforest - Outdoors'].addTo( this.map );
						break;
					}

					/* Map type: Thunderforest - Landscape with API key */
					case 'OSM4': {
						baseMaps['Thunderforest - Transport'].addTo( this.map );
						break;
					}

					/* Map type: Thunderforest - Landscape with API key */
					case 'OSM5': {
						baseMaps['Thunderforest - Landscape'].addTo( this.map );
						break;
					}

					///* Map type: MapToolKit - Terrain */
					//case 'OSM6': {
					//	baseMaps['MapToolKit - Terrain'].addTo( this.map );
					//	break;
					//}

					/* Map type: Open Street Map - Humanitarian Map Style*/
					case 'OSM7': {
						baseMaps['Humanitarian Map Style'].addTo( this.map );
						break;
					}

					/*
					Map type: Open Ski Map
					case 'OSM8': {
						baseMaps['Open Ski Map'].addTo( this.map );
						break;
					}
					*/

					/* Map type: Hike & Bike */
					case 'OSM9': {
						baseMaps['Hike & Bike'].addTo( this.map );
						break;
					}

					/* Map type: Open Sea Map */
					case 'OSM10': {
						baseMaps['Open Sea Map'].addTo( this.map );
						break;
					}

					case 'OSM11': {
						baseMaps['GSI Map (Japan)'].addTo( this.map );
						break;
					}

					/* Map type: Open Street Map */
					default: {
						baseMaps['Open Street Map'].addTo( this.map );
					}

				}

				L.control.layers( baseMaps, overlayMaps ).addTo( this.map );

			},

			this.AppPolylines = function( mapData, color1, currentIcon, startIcon, endIcon ) {

				var first = WPGPXMAPS.Utils.GetItemFromArray( mapData, 0 );

				if ( '' == currentIcon ) {
					currentIcon = 'https://maps.google.com/mapfiles/kml/pal4/icon25.png';
				}

				var CurrentPositionMarker = L.marker( first, { icon: L.icon ({
					iconUrl: currentIcon,
					iconSize: [ 32, 32 ], // Size of the icon.
					iconAnchor: [ 16, 16 ] // Point of the icon which will correspond to marker's location.
				})
				});
				CurrentPositionMarker.addTo( this.map );
				CurrentPositionMarker.title = 'Current';

				this.CurrentPositionMarker = CurrentPositionMarker;

				var pointsArray = WPGPXMAPS.Utils.DividePolylinesPoints( mapData );

				var lng = this.lng;
				var EventSelectChart = this.EventSelectChart;

				this.Bounds = mapData;

				this.CenterMap();

				for ( i = 0; i < pointsArray.length; i++ ) {
					if ( i < color1.length ) {
						color = color1[i];
					} else {
						color = color1[color1.length - 1];
					}
					try {
						var polyline = L.polyline(  pointsArray[i], {color: color}).addTo( this.map );
						this.Polylines.push( polyline );

						var context = this;

						this.Polylines[i].on( 'mousemove', function( e ) {
							context.MoveMarkerToPosition([ e.latlng.lat, e.latlng.lng ], true );
						});
					} catch ( err ) {
					}
				}

				if ( startIcon != '' ) {

					var startMarker = L.marker( mapData[0], {icon: L.icon({
						iconUrl: startIcon,
						iconSize: [ 32, 32 ], // Size of the icon.
						iconAnchor: [ 16, 16 ] // Point of the icon which will correspond to marker's location.
					})
					});

					startMarker.addTo( this.map );
					startMarker.title = 'Start';
				}

				if ( endIcon != '' ) {

					var endMarker = L.marker( mapData[ mapData.length - 1 ], {icon: L.icon({
						iconUrl: endIcon,
						iconSize: [ 32, 32 ], // size of the icon
						iconAnchor: [ 16, 16 ] // point of the icon which will correspond to marker's location
					})
					});

					endMarker.addTo( this.map );
					endMarker.title = 'End';
				}

				/*
				var current = new google.maps.MarkerImage(currentIcon,
					new google.maps.Size(32, 32),
					new google.maps.Point(0,0),
					new google.maps.Point(16, 16)
				);

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(first[0], first[1]),
					title:"Start",
					icon: current,
					map: map,
					zIndex: 10
				});

				for (i=0; i < polylinenes.length; i++)
				{

					google.maps.event.addListener(polylinenes[i],'mouseover',function(event){
						if (marker)
						{
							marker.setPosition(event.latLng);
							marker.setTitle(lng.currentPosition);
							if (myChart)
							{
								var l1 = event.latLng.lat();
								var l2 = event.latLng.lng();
								var ci = getClosestIndex(mapData,l1,l2);
								var activeElements = [];
								var seriesLen = myChart.data.datasets.length;
								for(var i=0; i<seriesLen;i++)
								{
									activeElements.push(myChart.chart.getDatasetMeta(i).data[ci]);
								}
								if (activeElements.length > 0)
								{
									myChart.options.customLine.x = activeElements[0]._model.x;
									if (isNaN(myChart.tooltip._eventPosition))
									{
										myChart.tooltip._eventPosition = {
												x: activeElements[0]._model.x,
												y: activeElements[0]._model.y
											};
									}
									myChart.tooltip._active = activeElements;
									myChart.tooltip.update(true);
									myChart.draw();
								}

							}
						}
					});
				}
				*/

			},

			this.AddWaypoints = function( waypoints, waypointIcon ) {

				var icon = L.icon({
					iconUrl: 'https://maps.google.com/mapfiles/ms/micons/flag.png',
					iconSize: [ 32, 32 ], // Size of the icon.
					iconAnchor: [ 16, 16 ] // Point of the icon which will correspond to marker's location.
				});

				if ( waypointIcon != '' ) {
					icon = L.icon({
						iconUrl: 'waypointIcon',
						iconSize: [ 32, 32 ], // Size of the icon.
						iconAnchor: [ 16, 16 ] // Point of the icon which will correspond to marker's location.
					});
				}

				for ( i = 0; i < waypoints.length; i++ ) {
					var wpt = waypoints[i];

					this.Bounds.push([ wpt.lat, wpt.lon ]);

					var lat = wpt.lat;
					var lon = wpt.lon;
					var sym = wpt.sym;
					var typ = wpt.type;

					if ( icon.img ) {
						icon.iconUrl = wpt.img;
						wsh = '';
					}
					var marker = L.marker([ lat, lon ], {icon: icon });
					var cnt = '';

					if ( wpt.name == '' ) {
						cnt = "<div>" + unescape( wpt.desc ) + "</div>";
					} else {
						cnt = "<div><b>" + wpt.name + "</b><br />" + unescape( wpt.desc ) + "</div>";
					}
					cnt += "<br /><p><a href='https://maps.google.com?daddr=" + lat + "," + lon + "' target='_blank'>Itin&eacute;raire</a></p>";
					marker.addTo( this.map ).bindPopup( cnt );
				}
				this.CenterMap();
			},

			this.MoveMarkerToPosition = function( LatLon, updateChart ) {
				if ( null == this.CurrentPositionMarker )
					return;

				this.CurrentPositionMarker.setLatLng( LatLon );

				if ( this.lng )
					this.CurrentPositionMarker.title = this.lng.currentPosition;

				if ( true == updateChart && this.EventSelectChart )
					this.EventSelectChart( LatLon );

			},
			this.CenterMap = function() {
				this.map.fitBounds( this.Bounds );
			};
		}
	}
};

( function( $ ) {

    $.fn.wpgpxmaps = function( params ) {

		var targetId = params.targetId;
		var mapType = params.mapType;
		var mapData = params.mapData;
		var graphDist = params.graphDist;
		var graphEle = params.graphEle;
		var graphSpeed = params.graphSpeed;
		var graphHr = params.graphHr;
		var graphAtemp = params.graphAtemp;
		var graphCad = params.graphCad;
		var graphGrade = params.graphGrade;
		var waypoints = params.waypoints;
		var unit_of_measure = params.unit;
		var unit_of_measure_speed = params.unitspeed;
		var color1 = params.color1;
		var color2 = params.color2;
		var color3 = params.color3;
		var color4 = params.color4;
		var color5 = params.color5;
		var color6 = params.color6;
		var color7 = params.color7;
		var chartFrom1 = params.chartFrom1;
		var chartTo1 = params.chartTo1;
		var chartFrom2 = params.chartFrom2;
		var chartTo2 = params.chartTo2;
		var startIcon = params.startIcon;
		var waypointIcon = params.waypointIcon;
		var endIcon = params.endIcon;
		var currentIcon = params.currentIcon;
		var zoomOnScrollWheel = params.zoomOnScrollWheel;
		var lng = params.langs;
		var pluginUrl = params.pluginUrl;
		var usegpsposition = params.usegpsposition;
		var currentpositioncon = params.currentpositioncon;
		var ThunderforestApiKey = params.TFApiKey;

		var hasThunderforestApiKey = ( ThunderforestApiKey + '' ).length > 0;

		var _formats = [];

		/* Unit of measure settings. */
		var l_s;
		var label_x;
		var label_y;
		var l_grade = { suf: '%', dec: 1 };
		var l_hr = { suf: '', dec: 0 };
		var l_cad = { suf: '', dec: 0 };

		var el = document.getElementById( 'wpgpxmaps_' + targetId );
		var el_map = document.getElementById( 'map_' + targetId );
		var el_chart = document.getElementById( 'chart_' + targetId );
		var el_report = document.getElementById( 'report_' + targetId );
		var el_osm_credits = document.getElementById( 'wpgpxmaps_' + targetId + '_osm_footer' );

		var mapWidth = el_map.style.width;

		var map = new WPGPXMAPS.MapEngines.Leaflet();
		map.lng = lng;
		map.init(
			'map_' + targetId,
			mapType,
			( 'true' == zoomOnScrollWheel ),
			ThunderforestApiKey
		);

		map.EventSelectChart = function( LatLon ) {

			if ( myChart ) {
				var l1 = LatLon[0];
				var l2 = LatLon[1];
				var ci = getClosestIndex( mapData, l1, l2 );
				var activeElements = [];
				var seriesLen = myChart.data.datasets.length;
				for ( var i = 0; i < seriesLen;i++ ) {
					activeElements.push( myChart.chart.getDatasetMeta( i ).data[ci]);
				}
				if ( activeElements.length > 0 ) {
					myChart.options.customLine.x = activeElements[0]._model.x;
					if ( isNaN( myChart.tooltip._eventPosition ) ) {
						myChart.tooltip._eventPosition = {
								x: activeElements[0]._model.x,
								y: activeElements[0]._model.y
							};
					}
					myChart.tooltip._active = activeElements;
					myChart.tooltip.update( true );
					myChart.draw();
				}
			}
		};

		// var bounds = new google.maps.LatLngBounds();

		if ( 'true' == usegpsposition ) {

			/* Try HTML5 geolocation. */
			if ( navigator.geolocation ) {
				var context = map;
				navigator.geolocation.watchPosition( function( position ) {
					var radius = position.coords.accuracy / 2;

					/* User position. */
					var pos = [ position.coords.latitude, position.coords.longitude ];

					if ( null == context.CurrentGPSPositionMarker ) {
						if ( '' == currentpositioncon  ) {
							currentpositioncon = 'https://maps.google.com/mapfiles/kml/pal4/icon25.png';
						}

						context.CurrentGPSPositionMarker = L.marker( pos, {icon: L.icon({
							iconUrl: currentpositioncon,
							iconSize: [ 32, 32 ], // Size of the icon.
							iconAnchor: [ 16, 16 ] // Point of the icon which will correspond to marker's location.
						})
						})
						.addTo( context.map )
						.bindPopup( lng.currentPosition )
						.openPopup();

					} else {
						context.CurrentGPSPositionMarker.setLatLng( pos );
					}
					context.Bounds.push( pos );
					context.CenterMap();
				},
				function( e ) {

					// Some errors.

				},
				{
				enableHighAccuracy: false,
				timeout: 5000,
				maximumAge: 0
				});
			}
		}

		/* Print WayPoints. */
		if ( ! jQuery.isEmptyObject( waypoints ) && waypoints.length > 0 ) {
			map.AddWaypoints( waypoints, waypointIcon );
		}

		/* Print Images. */
		jQuery( "#ngimages_" + targetId ).attr( "style", "display:block;position:absolute;left:-50000px" );

		var nggImages = jQuery( "#ngimages_" + targetId + " span" ).toArray();

		if ( nggImages !== undefined && nggImages.length > 0 ) {
			var photos = [];

			for ( var i = 0; i < nggImages.length; i++ ) {

				var ngg_span = nggImages[i];
				var ngg_span_a = ngg_span.children[0];

				var pos = [
					Number( ngg_span.getAttribute( 'lat' ) ),
					Number( ngg_span.getAttribute( 'lon' ) )
				];

				map.Bounds.push( pos );

				photos.push({
					'lat': pos[0],
					'lng': pos[1],
					'name': ngg_span_a.children[0].getAttribute( 'alt' ),
					'url': ngg_span_a.children[0].getAttribute( 'src' ),
					'thumbnail': ngg_span_a.children[0].getAttribute( 'src' )
				});

			}

			if ( photos.length > 0 ) {
				var photoLayer = L.photo.cluster().on( 'click', function( evt ) {
					var photo = evt.layer.photo;
					var template = '<img src="{url}" /></a><p>{name}</p>';
					evt.layer.bindPopup( L.Util.template( template, photo ), {
					minWidth: 'auto'
				}).openPopup();
			});

				photoLayer.add( photos ).addTo( map.map );

				map.CenterMap();

				/*
				var showHideImagesCustomControl = L.Control.extend({

					options: {
						position: 'topleft'
						//control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
					},

				  onAdd: function (map) {

					var container = document.createElement('img');
					container.class= "leaflet-bar leaflet-control leaflet-control-custom"
					container.style.backgroundColor = 'white';
					container.style.width = '30px';
					container.style.height = '30px';
					container.src = pluginUrl + "/wp-gpx-maps/img/hideImages.png";
					container.style.cursor = 'pointer';
					container.title = lng.hideImages;

					container.onclick = function(){

						var isImagesHidden = (controlUIhi.isImagesHidden == true);
						var mapDiv = map.getDiv();
						var center = map.getCenter();

						if (isImagesHidden)
						{
							for (var i=0; i<ngImageMarkers.length; i++) {
								ngImageMarkers[i].setMap(map);
							}
							controlUIhi.src = pluginUrl + "/wp-gpx-maps/img/hideImages.png";
							controlUIhi.title = lng.hideImages;
						}
						else
						{
							for (var i=0; i<ngImageMarkers.length; i++) {
								ngImageMarkers[i].setMap(null);
			}
							controlUIhi.src = pluginUrl + "/wp-gpx-maps/img/showImages.png";
							controlUIhi.title = lng.showImages;
						}
						controlUIhi.isImagesHidden = !isImagesHidden;
						return false;

					}

					return container;
				  },

				});

				map.map.addControl(new showHideImagesCustomControl());
				*/

			}

		}

		/*

		// Nextgen Pro Lightbox FIX
		var _xx = jQuery("#ngimages_" + targetId + " .nextgen_pro_lightbox");
		if (_xx.length > 0)
		{

			var rnd1 = Math.random().toString(36).substring(7);
			var rnd2 = Math.random().toString(36).substring(7);

			//get first gallery without images
			for (var _temp in galleries) {
				var _gal = galleries[_temp];

				if (_gal.source == "random_images" && _gal.wpgpxmaps != true )
				{

					_gal.source == "galleries";
					_gal.wpgpxmaps = true;
					_transient_id = _temp.replace("gallery_","")
					_gal["entity_ids"] = [];
					_gal["image_ids"] = [];
					_gal["gallery_ids"] = [96];
					for (var i=0;i<_xx.length;i++)
					{
						var __xx = jQuery(_xx[i]);
						__xx.attr("data-nplmodal-gallery-id", _transient_id);
						_gal["image_ids"].push(__xx.attr("data-image-id"));
					}
					break;
				}
			}
		}
		*/

		/* Print Track. */
		if ( mapData != '' ) {
			map.AppPolylines( mapData, color1, currentIcon, startIcon, endIcon );
		}

		/*
		map.setCenter(bounds.getCenter());
		map.fitBounds(bounds);
		*/

		// Fix post tabs. */
		var $_tab = $( el ).closest( ".wordpress-post-tabs, .tab-pane" ).eq( 0 );
		if ( $_tab ) {
			var contextMap = map;

			var FixMapSize = function( e ) {
				setTimeout( function( e ) {

					// google.maps.event.trigger(map, 'resize');
					contextMap.map.invalidateSize();
					contextMap.CenterMap();
					tabResized = true;
				}, 300 );
			};

			$( ".wpsm_nav-tabs a" ).click( FixMapSize );

			$( "div > ul > li > a", $_tab ).click( FixMapSize );
		}


		var graphh = jQuery( '#myChart_' + params.targetId ).css( "height" );

		if ( graphDist != '' && ( graphEle != '' || graphSpeed != '' || graphHr != '' || graphAtemp != '' || graphCad != '' ) && graphh != '0px' ) {

			var valLen = graphDist.length;

			if ( wpgpxmaps_FEET_MILES == unit_of_measure ) {

				/* feet / miles */
				label_x = { suf: 'mi', dec: 1 };
				label_y = { suf: 'ft', dec: 0 };

			} else if ( wpgpxmaps_METERS_KILOMETERS == unit_of_measure ) {

				/* meters / kilometers */
				label_x = { suf: 'km', dec: 1 };
				label_y = { suf: 'm', dec: 2 };

			} else if ( wpgpxmaps_METERS_NAUTICALMILES == unit_of_measure ) {

				/* meters / nautical miles */
				label_x = { suf: 'NM', dec: 1 };
				label_y = { suf: 'm', dec: 0 };

			} else if ( wpgpxmaps_METER_MILES == unit_of_measure ) {

				/* meters / miles */
				label_x = { suf: 'mi', dec: 1 };
				label_y = { suf: 'm', dec: 0 };

			} else if ( wpgpxmaps_FEET_NAUTICALMILES == unit_of_measure ) {

				/* feet / nautical miles */
				label_x = { suf: 'NM', dec: 1 };
				label_y = { suf: 'ft', dec: 0 };

			} else {

				/* meters / meters */
				label_x = { suf: 'm', dec: 0 };
				label_y = { suf: 'm', dec: 0 };

			}

			var nn = 1111.1;
			var _nn = nn.toLocaleString();
			var _nnLen = _nn.length;
			var decPoint = _nn.substring( _nnLen - 2, _nnLen - 1 );
			var thousandsSep = _nn.substring( 1, 2 );

			if ( '1' == decPoint )
				decPoint = '.';

			if ( '1' == thousandsSep )
				thousandsSep = '';

			/* Define the options. */
			var hoptions = {
				type: 'line',
				data: {
					datasets: []
				},
				borderWidth: 1,
				options: {
					animation: {

						// duration: 0,
						// general animation time
					},
					hover: {

						// animationDuration: 0,
						// duration of animations when hovering an item
					},

					// responsiveAnimationDuration: 0,
					// animation duration after a resize
					customLine: {
						color: 'gray'
					},
					scales: {
						yAxes: [],
						xAxes: [ {
							type: 'linear',
							ticks: {
								suggestedMin: 0,
								max: graphDist[graphDist.length - 1],

								/* Include a dollar sign in the ticks. */
								callback: function( value, index, values ) {
									return Math.round( value, label_x.dec ) + label_x.suf;
								}
							}
						} ]
					},
					tooltips: {
						position: 'average',
						mode: 'index',
						intersect: false,
						callbacks: {
							title: function( tooltipItems, data ) {

								/* Return value for title: */
								var label_x = _formats[0].label_x;
								var x_pos = tooltipItems[0].xLabel;
								var x_dec = label_x.dec;
								var x_unit = label_x.suf;
								return Math.round( x_pos, x_dec ) + x_unit;
							},
							label: function( tooltipItem, data ) {

								/* Format list values: */
								var label = data.datasets[tooltipItem.datasetIndex].label || '';
								var label_y = _formats[tooltipItem.datasetIndex].label_y;
								var y_dec = label_y.dec;
								var y_unit = label_y.suf;
								var y_pos = tooltipItem.yLabel;
								if ( label ) {
									label += ': ';
								}
								label += Math.round( y_pos, y_dec ) + y_unit;
								return label;
							},
							footer: function( tooltipItem ) {

								/* Move the point in map. */
								var i = tooltipItem[0].index;
								var point = WPGPXMAPS.Utils.GetItemFromArray( mapData, i );
								map.MoveMarkerToPosition( point, false );
							}
						}
					}
				},

				plugins: [ {
					beforeEvent: function( chart, e ) {
						if ( ( e.type === 'mousemove' )
						&& ( e.x >= e.chart.chartArea.left )
						&& ( e.x <= e.chart.chartArea.right )
						) {
							chart.options.customLine.x = e.x;
						}
					},
					afterDraw: function( chart, easing ) {
						var ctx = chart.chart.ctx;
						var chartArea = chart.chartArea;
						var x = chart.options.customLine.x;
						if ( ! isNaN( x ) ) {
							ctx.save();
							ctx.strokeStyle = chart.options.customLine.color;
							ctx.moveTo( chart.options.customLine.x, chartArea.bottom );
							ctx.lineTo( chart.options.customLine.x, chartArea.top );
							ctx.stroke();
							ctx.restore();
						}
					}
				} ],
				labels: graphDist
			};

			if ( graphEle != '' ) {
				var myData = mergeArrayForChart( graphDist, graphEle );
				var yaxe = {
					type: 'linear',
					ticks: {

						/* Include a dollar sign in the ticks. */
						// This draw the lateral axis alias
						callback: function( value, index, values ) {
							return Math.round( value, label_y.dec ) + label_y.suf;
						}
					},
					id: 'y-axis-' + ( hoptions.options.scales.yAxes.length + 1 )
				};

				if ( chartFrom1 != '' )	{

					yaxe.min = chartFrom1;
					yaxe.startOnTick = false;

				} else {

					yaxe.min = myData.Min;

				}

				if ( chartTo1 != '' ) {

					yaxe.max = chartTo1;
					yaxe.endOnTick = false;

				} else {

					yaxe.max = myData.Max;
				}

				_formats.push( {"label_x": label_x, "label_y":label_y} );
				hoptions.options.scales.yAxes.push( yaxe );
				hoptions.data.datasets.push( wpgpxmapsGetDataset( lng.altitude, myData.Items, color2, yaxe.id ) );

			}

			if ( graphSpeed != '' ) {


				if ( wpgpxmaps_MINUTES_PER_100METERS == unit_of_measure_speed ) {

					/* min/100 meters */
					l_s = { suf: 'min/100m', dec: 2 };

				} else if ( wpgpxmaps_KNOTS == unit_of_measure_speed ) {

					/* knots */
					l_s = { suf: 'knots', dec: 2 };

				} else if ( wpgpxmaps_MINUTES_PER_MILES == unit_of_measure_speed ) {

					/* min/miles */
					l_s = { suf: 'min/mi', dec: 2 };

				} else if ( wpgpxmaps_MINUTES_PER_KM == unit_of_measure_speed ) {

					/* min/km */
					l_s = { suf: 'min/km', dec: 2 };

				} else if ( wpgpxmaps_MILES_PER_HOURS == unit_of_measure_speed ) {

					/* miles/h */
					l_s = { suf: 'mi/h', dec: 0 };

				} else if ( wpgpxmaps_KM_PER_HOURS == unit_of_measure_speed ) {

					/* km/h */
					l_s = { suf: 'km/h', dec: 0 };

				} else {

					/* dafault m/s */
					l_s = { suf: 'm/s', dec: 0 };

				}

				var myData = mergeArrayForChart( graphDist, graphSpeed );
				var yaxe = {
					type: 'linear',
					ticks: {

						/* Include a dollar sign in the ticks. */
						callback: function( value, index, values ) {
							return Math.round( value, l_s.dec ) + l_s.suf;
						}
					},
					position: 'right',
					scalePositionLeft: false,
					id: 'y-axis-' + ( hoptions.options.scales.yAxes.length + 1 )
				};

				if ( chartFrom2 != '' ) {

					yaxe.min = chartFrom2;
					yaxe.startOnTick = false;

				} else {
					yaxe.min = myData.Min;
				}

				if ( chartTo2 != '' ) {

					yaxe.max = chartTo2;
					yaxe.endOnTick = false;

				} else {
					yaxe.max = myData.Max;
				}

				_formats.push ( l_s );
				hoptions.options.scales.yAxes.push( yaxe );
				hoptions.data.datasets.push( wpgpxmapsGetDataset( lng.speed, myData.Items, color3, yaxe.id ) );
			}

			if ( graphHr != '' ) {
				var myData = mergeArrayForChart( graphDist, graphHr );
				var yaxe = {
					type: 'linear',
					ticks: {

						/* Include a dollar sign in the ticks. */
						callback: function( value, index, values ) {
							return Math.round( value, l_hr.dec ) + l_hr.suf;
						}
					},
					position: 'right',
					scalePositionLeft: false,
					id: 'y-axis-' + ( hoptions.options.scales.yAxes.length + 1 )
				};
				hoptions.options.scales.yAxes.push( yaxe );
				hoptions.data.datasets.push( wpgpxmapsGetDataset( lng.heartRate, myData.Items, color4, yaxe.id ) );
				_formats.push( l_hr );
			}

			if ( graphAtemp != '' ) {
				var myData = mergeArrayForChart( graphDist, graphAtemp );
				var yaxe = {
					type: 'linear',
					ticks: {

						/* Include a dollar sign in the ticks. */
						callback: function( value, index, values ) {
							return Math.round( value, 1 ) + "°C";
						}
					},
					position: 'right',
					scalePositionLeft: false,
					id: 'y-axis-' + ( hoptions.options.scales.yAxes.length + 1 )
				};
				hoptions.options.scales.yAxes.push( yaxe );
				hoptions.data.datasets.push( wpgpxmapsGetDataset( lng.atemp, myData.Items, color7, yaxe.id ) );
				_formats.push({ suf: '°C', dec: 1 });
			}


			if ( graphCad != '' ) {

				var myData = mergeArrayForChart( graphDist, graphCad, true );
				var yaxe = {
					type: 'linear',
					ticks: {

						// Include a dollar sign in the ticks.
						callback: function( value, index, values ) {
							return Math.round( value, l_cad.dec ) + l_cad.suf;
						}
					},
					position: 'right',
					scalePositionLeft: false,
					id: 'y-axis-' + ( hoptions.options.scales.yAxes.length + 1 )
				};

				hoptions.options.scales.yAxes.push( yaxe );
				hoptions.data.datasets.push( wpgpxmapsGetDataset( lng.cadence, myData.Items, color5, yaxe.id ) );
				_formats.push( l_cad );

			}

			if ( graphGrade != '' ) {

				var myData = mergeArrayForChart( graphDist, graphGrade );
				var yaxe = {
					type: 'linear',
					ticks: {

						// Include a dollar sign in the ticks.
						callback: function( value, index, values ) {
							return Math.round( value, l_grade.dec ) + l_grade.suf;
						}
					},
					position: 'right',
					scalePositionLeft: false,
					id: "y-axis-" + ( hoptions.options.scales.yAxes.length + 1 )
				};

				_formats.push( l_grade );
				hoptions.options.scales.yAxes.push( yaxe );
				hoptions.data.datasets.push( wpgpxmapsGetDataset( lng.grade, myData.Items, color6, yaxe.id ) );
			}

			var ctx = document.getElementById( 'myChart_' + params.targetId ).getContext( '2d' );
			var myChart = new Chart( ctx, hoptions );

		} else  {
			jQuery( '#myChart_' + params.targetId ).css( "display", "none" );
		}

        return this;
    };

	function mergeArrayForChart( distArr, dataArr, setZerosAsNull ) {
		var l = distArr.length;

		var items = new Array( l );
		var min = 10000;
		var max = -10000;

		for ( i = 0; i < l; i++ ) {
			if ( distArr[i] != null ) {
				var _item = dataArr[i];

				if ( setZerosAsNull === true && _item === 0 ) {
					_item = null;
				}

				items[i] = {
					x: distArr[i],
					y: _item
				};
				if ( _item > max )
					max = _item;
				if ( _item < min )
					min = _item;
			}
		}
		return {
			Items: items,
			Min: min,
			Max: max
		};
	}

	function wpgpxmapsGetDataset( name, data, color, id ) {
		return {
			label: name, // jQuery("<div/>").html(name).text(), // convert html special chars to text, ugly but it works
			data: data,
			borderColor: color,
			backgroundColor: hexToRgbA( color, .3 ),
			pointRadius: 0,
			borderWidth: 1,
			pointHoverRadius: 1,
			yAxisID: id
		};
	}

	function hexToRgbA( hex, a ) {
		var c;
		if ( /^#([A-Fa-f0-9]{3}){1,2}$/.test( hex ) ) {
			c = hex.substring( 1 ).split( '' );
			if ( c.length == 3 ) {
				c = [ c[0], c[0], c[1], c[1], c[2], c[2] ];
			}
			c = '0x' + c.join( '' );
			return 'rgba(' + [ ( c>>16 )&255, ( c>>8 )&255, c&255 ].join( ',' ) + ',' + a + ' )';
		}
		throw new Error( 'Bad Hex' );
	}


	function getItemFromArray( arr, index ) {
		try {
			return arr[index];
		} catch ( e ) {
			return [ 0, 0 ];
		}
	}


	function getClosestIndex( points, lat, lon ) {
		var dd = 10000;
		var ii = 0;
		for ( i = 0; i < points.length; i++ ) {
			if ( null == points[i])
				continue;

			var d = wpgpxmapsDist( points[i][0], points[i][1], lat, lon );
			if ( d < dd ) {
				ii = i;
				dd = d;
			}
		}
		return ii;
	}

	function getClosestImage( lat, lon, targetId ) {
		var dd = 10000;
		var img;
		var divImages = document.getElementById( "ngimages_" + targetId );
		var img_spans = divImages.getElementsByTagName( "span" );
		for ( var i = 0; i < img_spans.length; i++ ) {
			var imageLat = img_spans[i].getAttribute( 'lat' );
			var imageLon = img_spans[i].getAttribute( 'lon' );

			imageLat = imageLat.replace( ",", "." );
			imageLon = imageLon.replace( ",", "." );

			var d = wpgpxmapsDist( imageLat, imageLon, lat, lon );
			if ( d < dd ) {
				img = img_spans[i];
				dd = d;
			}
		}
		return img;
	}

	function isNumeric( input ) {
		var RE = /^-{0,1}\d*\.{0,1}\d+$/;
		return ( RE.test( input ) );
	}

	function wpgpxmapsDist( lat1, lon1, lat2, lon2 ) {

		// Mathematically not correct but fast.
		var dLat = ( lat2 - lat1 );
		var dLon = ( lon2 - lon1 );
		return Math.sqrt( dLat * dLat + dLon * dLon );
	}

}( jQuery ) );
