=== WP GPX Maps ===

Contributors: bastianonm, Stephan Klein, Michel Selerin, TosattoSimonePio, Kniebremser
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8VHWLRW6JBTML
Tags: maps, gpx, gps, graph, chart, leaflet, track, garmin, image, nextgen-gallery, nextgen, exif, OpenStreetMap, OpenCycleMap, Hike&Bike, heart rate, heartrate, cadence
Requires at least: 5.2.0
Tested up to: 6.4.1
Requires PHP: 7.3+
Stable tag: 1.7.08

Draws a GPX track with altitude graph. You can also display your nextgen gallery images in the map.

== Description ==

This plugin has, as input, the GPX file with the track you've made and as output it shows the map of the track and an interactive altitude graph (where available).

<strong>Fully configurable:</strong>

- Custom colors
- Custom icons
- Multiple language support

<strong>Supported charts:</strong>

- Altitude
- Speed
- Heart rate
- Temperature
- Cadence
- Grade

<strong>NextGen Gallery Integration:</strong>

Display your NextGen Gallery images inside the map!
Even if you don't have a GPS camera, this plugin can retrive the image position starting from the image date and your GPX file.

<strong>Post Attachments Integration:</strong>

This version is extended by: <a href="https://klein-gedruckt.de/2015/03/wordpress-plugin-wp-gpx-maps/" target="_blank" rel="noopener noreferrer">Stephan Klein</a> and supports displaying all images attached to a post without using NGG.

Try this plugin: <a href="https://devfarm.it/wp-gpx-maps-demo/" target="_blank" rel="noopener noreferrer">https://devfarm.it/wp-gpx-maps-demo/</a>

<strong>Support:</strong>

If you need help, please use: <a href="http://www.devfarm.it/forums/forum/wp-gpx-maps/" target="_blank" rel="noopener noreferrer">www.devfarm.it Support Forum</a>

Would you like to help fix bugs or further develop the plugin? On <a href="https://github.com/devfarm-it/wp-gpx-maps" target="_blank" rel="noopener noreferrer">Github</a> you can contribuite easly with your code.

<strong>Translations:</strong>

Translators are welcome to contribute to the plugin. Please use the <a href="https://translate.wordpress.org/projects/wp-plugins/wp-gpx-maps/)" target="_blank" rel="noopener noreferrer">WordPress translation website</a>.

The language files in the plugin contain 18 translatable texts for 13 languages:

- Catalan ca
- Dutch nl_NL
- English (default)
- French fr_FR
- Hungarian hu_HU
- Italian it_IT
- Norwegian nb_NO
- Polish pl_PL
- Portuguese (Brazilian) pt_BR
- Russian ru_RU
- Spanish es_ES
- Swedish sv_SE
- Turkish tr_TR
- Bulgarian bg_BG
- Slovak cs_CZ
- Norwegian nb_NO
- Japanese ja_JP

(Many thanks to all guys who helped me with the translations)

<strong>Supported GPX namespaces are:</strong>

1. http://www.topografix.com/GPX/1/0

1. <a href="http://www.topografix.com/GPX/1/1" target="_blank" rel="noopener noreferrer">www.topografix.com/GPX/1/1</a>

1. http://www.garmin.com/xmlschemas/GpxExtensions/v3

1. http://www.garmin.com/xmlschemas/TrackPointExtension/v1

Thanks to: <a href="http://www.securcube.net/" target="_blank" rel="noopener noreferrer">www.securcube.net</a>, <a href="http://www.devfarm.it/" target="_blank" rel="noopener noreferrer">www.devfarm.it</a>

Icons made by <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer">Freepik</a> from <a href="https://www.flaticon.com/" target="_blank" rel="noopener noreferrer">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">Creative Commons BY 3.0</a>

== Installation ==

1. Use the classic wordpress plugin installer or copy the plugins folder to the `/wp-content/plugins/` directory

1. Activate the plugin through the 'Plugins' menu in WordPress

1. Add the shortcode [sgpx gpx="&gt;relative path to your gpx&lt;"] or [sgpx gpx="&gt;http://somesite.com/files/yourfile.gpx&lt;"]

== Frequently Asked Questions ==

= Which map types are available? =

You can use the following map types:

1. <strong>OSM1</strong> = Open Street Map (Default setting)
1. <strong>OSM2</strong> = Open Cycle Map / Thunderforest - Open Cycle Map (API Key required)
1. <strong>OSM3</strong> = Thunderforest - Outdoors (API Key required)
1. <strong>OSM4</strong> = Thunderforest - Transport (API Key required)
1. <strong>OSM5</strong> = Thunderforest - Landscape (API Key required)
1. <strong>OSM7</strong> = Open Street Map - Humanitarian map style
1. <strong>OSM9</strong> =  Hike & Bike
1. <strong>OSM10</strong> = Open Sea Map

If you use the OpenCycleMap without the API key, a watermark appears on the card: "API Key required".

The Thunderforest maps Outdoors, Transport and Landscape are only displayed with an API Key.

= Which shortcode attributes are available? =

You can use the following shortcodes:

1. <strong>gpx:</strong> Relative path to the GPX file
1. <strong>width:</strong> Map width (Value in percent)
1. <strong>mheight:</strong> Map height (Value in pixeln)
1. <strong>gheight:</strong> Graph height (Value in pixeln)
1. <strong>skipcache:</strong> Do not use cache. If TRUE might be very slow (Default is false)
1. <strong>download:</strong> Allow users to download your GPX file (Default is false)
1. <strong>summary:</strong> Print summary details of your GPX track (Default is false)
1. <strong>summarytotlen:</strong> Print total distance in summary table (Default is false)
1. <strong>summarymaxele:</strong> Print max elevation in summary table (Default is false)
1. <strong>summaryminele:</strong> Print min Elevation in summary table (Default is false)
1. <strong>summaryeleup:</strong> Print total climbing in summary table (Default is false)
1. <strong>summaryeledown:</strong> Print total descent in summary table (Default is false)
1. <strong>summaryavgspeed:</strong> Print average Speed in summary table (Default is false)
1. <strong>summarytotaltime:</strong> Print total time in summary table (Default is false)
1. <strong>mtype:</strong> Map types
1. <strong>mlinecolor:</strong> Map line color (Default is #3366cc)
1. <strong>zoomonscrollwheel:</strong> Zoom on map when mouse scroll wheel (Default is false)
1. <strong>waypoints:</strong> Print the gpx waypoints inside the map (Default is false)
1. <strong>startIcon:</strong> Start track icon
1. <strong>endIcon:</strong> End track icon
1. <strong>currentIcon:</strong> Current position icon (when mouse hover)
1. <strong>waypointicon:</strong> Custom waypoint icon
1. <strong>showele:</strong> Show elevation data inside the chart (Default is true)
1. <strong>uom:</strong> Distance/altitude unit of measure
1. 0 = meters/meters (Default setting)
1. 1 = feet/miles
1. 2 = meters/kilometers
1. 3 = meters/nautical miles
1. 4 = meters/miles
1. 5 = feet/nautical miles
1. <strong>glinecolor:</strong> Altitude line color (Default is #3366cc)
1. <strong>chartFrom1:</strong> Minimun value for altitude chart
1. <strong>chartTo1:</strong> Maxumin value for altitude chart
1. <strong>showspeed:</strong> Show speed inside the chart (Default is false)
1. <strong>glinecolorspeed:</strong> Speed line color (Default is #ff0000)
1. <strong>uomspeed:</strong> Unit of measure for speed
1. 0 = m/s (Default setting)
1. 1 = km/h
1. 2 = miles/h
1. 3 = min/km
1. 4 = min/miles
1. 5 = Nautical Miles/Hour (Knots)
1. 6 = min/100 meters
1. <strong>chartFrom2:</strong> Minimun value for speed chart
1. <strong>chartTo2:</strong> Maxumin value for speed chart
1. <strong>showhr:</strong> Show heart rate inside the chart (Default is false)
1. <strong>glinecolorhr:</strong> Heart rate line color (Default is #ff77bd)
1. <strong>showatemp:</strong> Show temperature inside the chart (Default is false)
1. <strong>glinecoloratemp:</strong> Temperature line color (Default is #ff77bd)
1. <strong>showcad:</strong> Show cadence inside the chart (Default is false)
1. <strong>glinecolorcad:</strong> Cadence line color (Default is #beecff)
1. <strong>showgrade:</strong> Show grade inside the chart (Default is false)
1. <strong>glinecolorgrade:</strong> Grade line color (Default is #beecff)
1. <strong>nggalleries:</strong> NextGen Gallery id or a list of Galleries id separated by a comma
1. <strong>ngimages:</strong> NextGen Image id or a list of Images id separated by a comma
1. <strong>attachments:</strong> Show all images that are attached to post (Default is false)
1. <strong>dtoffset:</strong> The difference (in seconds) between your gpx tool date and your camera date
1. <strong>pointsoffset:</strong> Skip points closer than XX meters (Default is 10)
1. <strong>donotreducegpx:</strong> Print all the point without reduce it (Default is false)

= What happening if I've a very large GPX files? =

This plugin will print a small amout of points to speedup javascript and pageload.

= Is it free? =

Yes!

== Screenshots ==
1. Simple GPX
1. GPX with waypoints
1. Admin area - List of tracks
1. Admin area - Settings
1. Altitude & Speed
1. Altitude & Speed & Heart rate

== Changelog ==

= 1.7.08 =
* Security fix
= 1.7.07 =
* Update settings variables echo
= 1.7.06 =
* Fix vulnerability
= 1.7.05 =
* Fix NextGen warnings
= 1.7.04 =
* Fix php8+ errors
= 1.7.03 =
* fix download file link
* fix error with images exif parsing
= 1.7.02 =
* fix admin error
= 1.7.01 =
* General: Removed Maptoolkit (code OSM6) map provider. Requested by H.F. (Maptoolkit Managing director)
* General: Added new map type "Thunderforest - Outddors" (OSM3)
* Admin: Added admin notices in the dashboard
* Settings Tab: In the map selection changed to the correct maps provider from "Open Cycle Map"* Settings Tab: to "Thunderforest"
* Administration Tab: New Tab with the settings "Editor & Author upload" and "Show update notice"
* Help Tab: In the map selection changed to the correct maps provider from "Open Cycle Map" to "Thunderforest"
* Output: In the map selection changed to the correct maps provider from "Open Cycle Map" to "Thunderforest"
* Output: Fixed in map footer for each map, the corresponding map provider is displayed with URL
* Code: Added PHP version notices, WordPress 5.3 requires PHP 5.6.20
* Code: Added Missing entries for add and delete options
* Code: Style for output moved in a seperate CSS file
* Code: Adjustments a la WPCS
* Code: Small CSS design optimizations for the tabs
* Code: Upgrade bootstrap-table to 1.13.2
* Code: Removed german language file (now over translate.wordpress.org)
= 1.7.00 =
* Added: Authors can upload GPX tracks in a folder called as *your user name*, inside [../wp-upload dir/gpx/[*your user name*] (thanks to wildcomputations)
* Added: Authors an Admins can see the current values for shortcodes in help tab
* Added: Button to instant copy the shortcode of the selected GPX file in the tab track
* Added: different size logos for the plugin store (icon.svg, icon128x128.png and icon256x256.png) [inside ../plugins/wp-gpx-maps/assets]
* Changed: Settings tab is for non-Admin users is not more visible
* Tweak: Help tab is easier to read
* Tweak: Plugin is now complete translatable (Backend + Frontend)
* Tweak: WordPress coding standards
* Upgrade: Leaflet to 1.5.1
* Upgrade: leaflet.fullscreen to 1.4.5
* Upgrade: Chart.min.js to 2.8.0
= 1.6.07 =
* resolve admin error
= 1.6.06 =
* Added average values under the graph (thanks to cyclinggeorgian)
= 1.6.04 =
* NGG gallery is working
* Getting HR, Cad and Temp working again (thanks to cyclinggeorgian)
* Fix javascript errors
* Fix multiple traks gpx
= 1.6.03 =
* Fix syntax error causing graph not to display (thanks to nickstabler)
= 1.6.02 =
* Resolved errors with start and end icons
= 1.6.01 =
* Removed Gogole maps. Leafletjs instead.
* -- NextGen Gallery is not working, due next gen image format changed -- I'll fix soon
= 1.5.05 =
* renamed javascript functions to avoid collision with other plugins
* reduced chart line thickness
= 1.5.04 =
* fix uom
* fix file not found
= 1.5.03 =
* fix random error
= 1.5.02 =
* Security improvements
= 1.5.01 =
* Improved security
* Included javascript
* Multiple file upload
* Implemented sorting in file list
* Renamed internal function to improve wp compatibility
= 1.5.00 =
* replaced highcharts with chartjs. This is a forced choice due highcharts license issue, view:  https://devfarm.it/wordpress-plugin/wordpress-plugin-directory-notice-wp-gpx-maps-temporarily-disabled/
= 1.3.16 =
* Added Norwegian nb_NO translation (thanks to thordivel)
* Added Japanese ja_JP translation (thanks to dentos)
= 1.3.15 =
* Switched to HTTPS where possible (thanks to delitestudio)
= 1.3.14 =
* Added Thunderforest Api Key on settings: for OpenCycleMap
= 1.3.13 =
* Added google maps api key on settings
* Removed parameter 'sensor' on google maps js
* Added unit of measure of speed for swimmers: min/100 meters
= 1.3.12 =
* Fix incompatibility with Debian PHP7 (thanks to phbaer) https://github.com/devfarm-it/wp-gpx-maps/pull/5
= 1.3.10 =
* Improved german translations (thanks to Konrad) http://tadesse.de/7882/2015-wanderung-ostrov-tisa-ii/
= 1.3.9 =
* Retrieve waypoints in JSON, possibility to add a custom marker (Changed by Michel Selerin)
= 1.3.8 =
* Improved Google Maps visualization
= 1.3.7 =
* NextGen Gallery's Attachment support. Thanks to Stephan Klein (https://klein-gedruckt.de/2015/03/wordpress-plugin-wp-gpx-maps/)
= 1.3.6 =
* Fix: remote file download issue
* Fix: download file link with WPML
* Improved cache with filetime (thanks to David)
= 1.3.5 =
* Fix: Garmin cadence again
* Fix: WP Tabs
= 1.3.4 =
* Fix: Garmin cadence
* Infowindows closing on mouseout
= 1.3.3 =
* Add feet/Nautical Miles units (thanks to elperepat)
* Update OpenStreetMaps Credits
* WP Tabs fix
= 1.3.2 =
* fix: left axis not visible (downgrade highcharts to v3.0.10)
* fix: fullscreen map js error
= 1.3.1 =
* fix: http/https javascript registration
* fix: full screen map css issue
= 1.3.0 =
* Speed improvement
* Rewritten js classes
* Added Temperature chart
* Added HTML5 Gps position (you can now follow the gpx with your mobile phone/tablet/pc)
= 1.2.6 =
* Speed improvement
= 1.2.5 =
* Added Catalan translation, thanks to Edgar
* Updated Spanish translation, thanks to Dani
* Added different types of distance:  Normal, Flat (don't consider altitude) and Climb distance
= 1.2.4 =
* Added Bulgarian translation, thanks to Svilen Savov
* Added possibility to hide the elevation chart
= 1.2.2 =
* Smaller map type selector
* Fix: Google maps exception for NextGen Gallery
= 1.2.1 =
* Fix: NextGen Gallery 1.9 compatibility
= 1.2.0 =
* NextGen Gallery 2 support
* NextGen Gallery Pro support
= 1.1.46 =
* Added meters/miles chart unit of measure
* Added Russian translation, thanks to G.A.P
= 1.1.45 =
* Added nautical miles as distance (Many thanks to Anders)
= 1.1.44 =
* Added Chart zoom feature
* Some small bug fixes
= 1.1.43 =
* Added Portuguese (Brazilian) translation, thanks to André Ramos
* new map: Open Cycle Map - Transport
* new map: Open Cycle Map - Landscape
= 1.1.42 =
* qTranslate compatible
= 1.1.41 =
* Added Polish translation, thanks to Sebastian
* Fix: Spanish translation
* Minor javascript improvement
= 1.1.40 =
* Improved italian translation
* Added grade chart (beta)
= 1.1.39 =
* Added French translation, thanks to Hervé
* Added Nautical Miles per Hour (Knots) unit of measure
= 1.1.38 =
* Fix: garmin gpx cadence and heart rate
* Updated Turkish translation, thanks to Edip
* Added Hungarian translation, thanks to Tami
= 1.1.36 =
* Even Editor and Author users can upload their own gpx. Administrators can see all the administrators gpx. The other users can see only their uploads
= 1.1.35 =
* Fix: In the post list, sometime, the maps was not displaying correctly ( the php rand() function was not working?? )
* Various improvements for multi track gpx. Thanks to GPSracks.tv
* Summary table is now avaiable even without chart. Thanks to David
= 1.1.34 =
* 2 decimals for unit of measure min/km and min/mi
* translation file updated (a couple of phrases added)
* File list reverse order (from the newer to the older)
* nggallery integration: division by zero fixed
= 1.1.33 =
* Decimals reducted to 1 for unit of measure min/km and min/mi
* map zoom and center position is working with waypoints only files
* automatic scale works again (thanks to MArkus)
= 1.1.32 =
* You can exclude cache (slower and not recommended)
* You can decide what show in the summary table
* German translation (thanks to Ali)
= 1.1.31 =
* Fixed fullscreen map image slideshow
= 1.1.30 =
* Multi track gpx support
* Next Gen Gallery images positions derived from date. You can adjust the date with the shortcode attribute dtoffset
* If you set Chart Height (shortcode gheight) = 0 means hide the graph
* Fix: All images should work, independent from browser cache
= 1.1.29 =
* Decimal separator is working with all the browsers
* minutes per mile and minutes per kilometer was wrong
= 1.1.28 =
* Decimal and thousand separator derived from browser language
* Added summary table (see settings): Total distance, Max elevation, Min elevation, Total climbing, Total descent, Average speed
* Added 2 speed units of measure: minutes per mile and minutes per kilometer
= 1.1.26 =
* Multilanguage implementation (only front-end). I've implemented the italian one, I hope somebody will help me with other languages..
* Map Full screen mode (I'm sure it's not working in ie6. don't even ask!)
* Added waypoint custom icon
= 1.1.25 =
* Added possibility to download your gpx
= 1.1.23 =
* Security fix, please update!
= 1.1.22 =
* enable map zoom on scroll wheel (check settings)
* test attributes in get params
= 1.1.21 =
* google maps images fixed (templates with bad css)
* upgrade to google maps 3.9
= 1.1.20 =
* google maps images fixed in <a href="http://wordpress.org/extend/themes/yoko">Yoko theme</a>
= 1.1.19 =
* include jQuery if needed
= 1.1.17 =
* Remove zero values from cadence and heart rate charts
* nextgen gallery improvement
= 1.1.16 =
* Cadence chart (where available)
* minor bug fixes
= 1.1.15 =
* migration from google chart to highcharts. Highcharts are much better than google chart! This is the base for a new serie of improvements. Stay in touch for the next releases!
* heart rate chart (where available)
= 1.1.14 =
* added css to avoid map bars display issue
= 1.1.13 =
* added new types of maps: Open Street Map, Open Cycle Map, Hike & Bike.
* fixed nextgen gallery caching problem
= 1.1.12 =
* nextgen gallery display bug fixes

== Upgrade Notice ==
