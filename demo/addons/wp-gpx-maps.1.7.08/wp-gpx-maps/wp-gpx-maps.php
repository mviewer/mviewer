<?php
/**
 * Plugin Name: WP-GPX-Maps
 * Plugin URI: http://www.devfarm.it/
 * Description: Draws a GPX track with altitude chart
 * Version: 1.7.08
 * Author: Bastianon Massimo
 * Author URI: http://www.devfarm.it/
 * Text Domain: wp-gpx-maps
 * Domain Path: /languages
 *
 * @package WP-GPX-Maps
 */

// error_reporting (E_ALL);

/**
 * Version of the plugin
 */
define( 'WPGPXMAPS_CURRENT_VERSION', '1.7.08' );

require 'wp-gpx-maps-utils.php';
require 'wp-gpx-maps-admin.php';

define("wpgpxmaps_FEET_MILES", "1");
define("wpgpxmaps_METERS_KILOMETERS", "2");
define("wpgpxmaps_METERS_NAUTICALMILES", "3");
define("wpgpxmaps_METER_MILES", "4");
define("wpgpxmaps_FEET_NAUTICALMILES", "5");

define("wpgpxmaps_KM_PER_HOURS", "1");
define("wpgpxmaps_MILES_PER_HOURS", "2");
define("wpgpxmaps_MINUTES_PER_KM", "3");
define("wpgpxmaps_MINUTES_PER_MILES", "4");
define("wpgpxmaps_KNOTS", "5");
define("wpgpxmaps_MINUTES_PER_100METERS", "6");



add_shortcode( 'sgpx', 'wpgpxmaps_handle_shortcodes' );
add_shortcode( 'sgpxf', 'wpgpxmaps_handle_folder_shortcodes' );
register_activation_hook( __FILE__, 'wpgpxmaps_install_option' );
register_deactivation_hook( __FILE__, 'wpgpxmaps_remove_option' );
add_filter( 'plugin_action_links', 'wpgpxmaps_action_links', 10, 2 );
add_action( 'wp_enqueue_scripts', 'wpgpxmaps_enqueue_scripts' );
add_action( 'admin_enqueue_scripts', 'wpgpxmaps_enqueue_scripts_admin' );
add_action( 'plugins_loaded', 'wpgpxmaps_lang_init' );

function wpgpxmaps_lang_init() {

	if ( function_exists( 'load_plugin_textdomain' ) ) {
		load_plugin_textdomain( 'wp-gpx-maps', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
	}

}

function wpgpxmaps_action_links( $links, $file ) {

	static $this_plugin;

	if ( ! $this_plugin ) {
		$this_plugin = plugin_basename( __FILE__ );
	}

	// Check to make sure we are on the correct plugin.
	if ( $file == $this_plugin ) {
		// the anchor tag and href to the URL we want. For a "Settings"
		// link, this needs to be the url of your settings page. Authors
		// access tracks via the admin page.
		if ( current_user_can( 'manage_options' ) ) {
			$menu_root = 'options-general.php';
		} elseif ( current_user_can( 'publish_posts' ) ) {
			$menu_root = 'admin.php';
		}
		$settings_link = '<a href="' . get_bloginfo( 'wpurl' ) . '/wp-admin/' . $menu_root . '?page=WP-GPX-Maps">' . __( 'Settings', 'wp-gpx-maps' ) . '</a>';
		// Add the link to the list.
		array_unshift( $links, $settings_link );
	}
	return $links;

}

function wpgpxmaps_enqueue_scripts_admin( $hook ) {

	if ( strpos( $hook, 'WP-GPX-Maps' ) !== false ) {

		/* Admin Style CSS */
		wp_register_style( 'admin-style', plugins_url( 'css/admin-style.css', __FILE__ ), array(), '1.0.0' );
		wp_enqueue_style( 'admin-style' );
		/* bootstrap-table */
		wp_register_script( 'bootstrap-table', plugins_url( '/js/bootstrap-table.js', __FILE__ ), array(), '1.13.2' );
		wp_enqueue_script( 'bootstrap-table' );
		wp_register_style( 'bootstrap-table', plugins_url( '/css/bootstrap-table.css', __FILE__ ), array(), '1.13.2' );
		wp_enqueue_style( 'bootstrap-table' );
	}

}

function wpgpxmaps_enqueue_scripts() {

	/* Output Style CSS */
	wp_register_style( 'output-style', plugins_url( 'css/wp-gpx-maps-output.css', __FILE__ ), array(), '1.0.0' );
	wp_enqueue_style( 'output-style' );

	/* Leaflet */
	wp_register_style( 'leaflet', plugins_url( '/ThirdParties/Leaflet_1.5.1/leaflet.css', __FILE__ ), array(), '1.5.1' );
	wp_enqueue_style( 'leaflet' );

	/* Leaflet.markercluster */
	wp_register_style( 'leaflet.markercluster', plugins_url( '/ThirdParties/Leaflet.markercluster-1.4.1/MarkerCluster.css', __FILE__ ), array(), '1.4.1,' );
	wp_enqueue_style( 'leaflet.markercluster' );

	/* Leaflet.Photo */
	wp_register_style( 'leaflet.Photo', plugins_url( '/ThirdParties/Leaflet.Photo/Leaflet.Photo.css', __FILE__ ), array(), '0' );
	wp_enqueue_style( 'leaflet.Photo' );

	/* Leaflet.fullscreen */
	wp_register_style( 'leaflet.fullscreen', plugins_url( '/ThirdParties/leaflet.fullscreen-1.4.5/Control.FullScreen.css', __FILE__ ), array(), '1.5.1' );
	wp_enqueue_style( 'leaflet.fullscreen' );

	wp_register_script( 'leaflet', plugins_url( '/ThirdParties/Leaflet_1.5.1/leaflet.js', __FILE__ ), array(), '1.5.1' );
	wp_register_script( 'leaflet.markercluster', plugins_url( '/ThirdParties/Leaflet.markercluster-1.4.1/leaflet.markercluster.js', __FILE__ ), array( 'leaflet' ), '1.4.1' );
	wp_register_script( 'leaflet.Photo', plugins_url( '/ThirdParties/Leaflet.Photo/Leaflet.Photo.js', __FILE__ ), array( 'leaflet', 'leaflet.markercluster' ), '0' );
	wp_register_script( 'leaflet.fullscreen', plugins_url( '/ThirdParties/leaflet.fullscreen-1.4.5/Control.FullScreen.js', __FILE__ ), array( 'leaflet' ), '1.4.5' );

	/* Chartjs */
	wp_register_script( 'chartjs', plugins_url( '/js/Chart.min.js', __FILE__ ), array(), '2.8.0' );

	wp_register_script( 'wp-gpx-maps', plugins_url( 'js/WP-GPX-Maps.js', __FILE__ ), array( 'jquery', 'leaflet', 'chartjs' ), '1.6.02' );

	wp_enqueue_script( 'output-style' );
	wp_enqueue_script( 'leaflet' );
	wp_enqueue_script( 'leaflet.markercluster' );
	wp_enqueue_script( 'leaflet.Photo' );
	wp_enqueue_script( 'leaflet.fullscreen' );
	wp_enqueue_script( 'jquery' );
	wp_enqueue_script( 'chartjs' );
	wp_enqueue_script( 'wp-gpx-maps' );

}

function wpgpxmaps_findValue( $attr, $attributeName, $optionName, $defaultValue ) {

	$val = '';
	if ( isset( $attr[$attributeName] ) ) {
		$val = $attr[$attributeName];
	}
	if ( $val == '' ) {
		$val = get_option( $optionName );
	}
	if ( $val == '' && isset( $_GET[$attributeName] ) && $attributeName != 'download' ) {
		$val = $_GET[$attributeName];
	}
	if ( $val == '' ) {
		$val = $defaultValue;
	}
	return $val;

}

function wpgpxmaps_handle_folder_shortcodes( $attr, $content = '' ) {

	$folder         = wpgpxmaps_findValue( $attr, 'folder', '', '' );
	$pointsoffset   = wpgpxmaps_findValue( $attr, 'pointsoffset', 'wpgpxmaps_pointsoffset', 10 );
	$distanceType   = wpgpxmaps_findValue( $attr, 'distanceType', 'wpgpxmaps_distance_type', 0 );
	$donotreducegpx = wpgpxmaps_findValue( $attr, 'donotreducegpx', 'wpgpxmaps_donotreducegpx', false );
	$unit_of_measure            = wpgpxmaps_findValue( $attr, 'uom', 'wpgpxmaps_unit_of_measure', '0' );

	/* Fix folder path */
	$sitePath = wp_gpx_maps_sitePath();
	$folder   = trim( $folder );
	$folder   = str_replace( array( '/', '\\' ), DIRECTORY_SEPARATOR, $folder );
	$folder   = $sitePath . $folder;

	$files = scandir( $folder );

	foreach ( $files as $file ) {

		if ( strtolower( substr( $file, - 4 ) ) == '.gpx' ) {

			$gpx    = $folder . DIRECTORY_SEPARATOR . $file;
			$points = wpgpxmaps_getPoints( $gpx, $pointsoffset, $donotreducegpx, $distanceType );

			$points_maps       = '';
			$points_graph_dist = '';
			$points_graph_ele  = '';

			if ( is_array( $points_x_lat ) )
			foreach ( array_keys( $points_x_lat ) as $i ) {
				$_lat = (float) $points_x_lat[$i];
				$_lon = (float) $points_x_lon[$i];

				if ( 0 == $_lat && 0 == $_lon ) {
					$points_maps       .= 'null,';
					$points_graph_dist .= 'null,';
					$points_graph_ele  .= 'null,';

				} else {
					$points_maps .= '[' . number_format( (float) $points_x_lat[$i], 7, '.', '' ) . ',' . number_format( (float) $points_x_lon[$i], 7, '.', '' ) . '],';

					$_ele  = (float) $points->ele[$i];
					$_dist = (float) $points->dist[$i];

					if ( wpgpxmaps_FEET_MILES == $unit_of_measure ) {
						/* feet / miles */
						$_dist *= 0.000621371192;
						$_ele  *= 3.2808399;

					} elseif ( wpgpxmaps_METERS_KILOMETERS == $unit_of_measure ) {
						/* meters / kilometers */
						$_dist = (float) ( $_dist / 1000 );

					} elseif ( wpgpxmaps_METERS_NAUTICALMILES == $unit_of_measure ) {
						/* meters / nautical miles */
						$_dist = (float) ( $_dist / 1000 / 1.852 );

					} elseif ( wpgpxmaps_METER_MILES == $unit_of_measure ) {
						/* meters / miles */
						$_dist *= 0.000621371192;

					} elseif ( wpgpxmaps_FEET_NAUTICALMILES == $unit_of_measure ) {
						/* feet / nautical miles */
						$_dist = (float) ( $_dist / 1000 / 1.852 );
						$_ele *= 3.2808399;
					}

					$points_graph_dist .= number_format( $_dist, 2, '.', '' ) . ',';
					$points_graph_ele  .= number_format( $_ele, 2, '.', '' ) . ',';

				}
			}
			print_r( $points );
		}
	}

}

function wpgpxmaps_handle_shortcodes( $attr, $content = '' ) {

	$error = '';
	/* General */
	$gpx            = wpgpxmaps_findValue( $attr, 'gpx', '', '' );
	$w              = wpgpxmaps_findValue( $attr, 'width', 'wpgpxmaps_width', '100%' );
	$mh             = wpgpxmaps_findValue( $attr, 'mheight', 'wpgpxmaps_height', '450px' );
	$gh             = wpgpxmaps_findValue( $attr, 'gheight', 'wpgpxmaps_graph_height', '200px' );
	$distanceType   = wpgpxmaps_findValue( $attr, 'distanceType', 'wpgpxmaps_distance_type', 0 );
	$skipcache      = wpgpxmaps_findValue( $attr, 'skipcache', 'wpgpxmaps_skipcache', '' );
	$download       = wpgpxmaps_findValue( $attr, 'download', 'wpgpxmaps_download', '' );
	$usegpsposition = wpgpxmaps_findValue( $attr, 'usegpsposition', 'wpgpxmaps_usegpsposition', false );
	/* Print Summary Table */
	$summary          = wpgpxmaps_findValue( $attr, 'summary', 'wpgpxmaps_summary', false );
	$p_tot_len        = wpgpxmaps_findValue( $attr, 'summarytotlen', 'wpgpxmaps_summary_tot_len', false );
	$p_max_ele        = wpgpxmaps_findValue( $attr, 'summarymaxele', 'wpgpxmaps_summary_max_ele', false );
	$p_min_ele        = wpgpxmaps_findValue( $attr, 'summaryminele', 'wpgpxmaps_summary_min_ele', false );
	$p_total_ele_up   = wpgpxmaps_findValue( $attr, 'summaryeleup', 'wpgpxmaps_summary_total_ele_up', false );
	$p_total_ele_down = wpgpxmaps_findValue( $attr, 'summaryeledown', 'wpgpxmaps_summary_total_ele_down', false );
	$p_avg_speed      = wpgpxmaps_findValue( $attr, 'summaryavgspeed', 'wpgpxmaps_summary_avg_speed', false );
	$p_avg_cad        = wpgpxmaps_findValue( $attr, 'summaryavgcad', 'wpgpxmaps_summary_avg_cad', false );
	$p_avg_hr         = wpgpxmaps_findValue( $attr, 'summaryavghr', 'wpgpxmaps_summary_avg_hr', false );
	$p_avg_temp       = wpgpxmaps_findValue( $attr, 'summaryavgtemp', 'wpgpxmaps_summary_avg_temp', false );
	$p_total_time     = wpgpxmaps_findValue( $attr, 'summarytotaltime', 'wpgpxmaps_summary_total_time', false );
	/* Map */
	$mt                 = wpgpxmaps_findValue( $attr, 'mtype', 'wpgpxmaps_map_type', 'HYBRID' );
	$color_map          = wpgpxmaps_findValue( $attr, 'mlinecolor', 'wpgpxmaps_map_line_color', '#3366cc' );
	$zoomOnScrollWheel  = wpgpxmaps_findValue( $attr, 'zoomonscrollwheel', 'wpgpxmaps_zoomonscrollwheel', false );
	$showW              = wpgpxmaps_findValue( $attr, 'waypoints', 'wpgpxmaps_show_waypoint', false );
	$startIcon          = wpgpxmaps_findValue( $attr, 'starticon', 'wpgpxmaps_map_start_icon', '' );
	$endIcon            = wpgpxmaps_findValue( $attr, 'endicon', 'wpgpxmaps_map_end_icon', '' );
	$currentpositioncon = wpgpxmaps_findValue( $attr, 'currentpositioncon', 'wpgpxmaps_currentpositioncon', '' );
	$currentIcon        = wpgpxmaps_findValue( $attr, 'currenticon', 'wpgpxmaps_map_current_icon', '' );
	$waypointIcon       = wpgpxmaps_findValue( $attr, 'waypointicon', 'wpgpxmaps_map_waypoint_icon', '' );
	/* Diagram - Elevation */
	$showEle     = wpgpxmaps_findValue( $attr, 'showele', 'wpgpxmaps_show_elevation', true );
	$color_graph = wpgpxmaps_findValue( $attr, 'glinecolor', 'wpgpxmaps_graph_line_color', '#3366cc' );
	$unit_of_measure         = wpgpxmaps_findValue( $attr, 'uom', 'wpgpxmaps_unit_of_measure', '0' );
	$chartFrom1  = wpgpxmaps_findValue( $attr, 'chartfrom1', 'wpgpxmaps_graph_offset_from1', '' );
	$chartTo1    = wpgpxmaps_findValue( $attr, 'chartto1', 'wpgpxmaps_graph_offset_to1', '' );
	/* Diagram - Speed */
	$showSpeed         = wpgpxmaps_findValue( $attr, 'showspeed', 'wpgpxmaps_show_speed', false );
	$color_graph_speed = wpgpxmaps_findValue( $attr, 'glinecolorspeed', 'wpgpxmaps_graph_line_color_speed', '#ff0000' );
	$unit_of_measure_speed          = wpgpxmaps_findValue( $attr, 'uomspeed', 'wpgpxmaps_unit_of_measure_speed', '0' );
	$chartFrom2        = wpgpxmaps_findValue( $attr, 'chartfrom2', 'wpgpxmaps_graph_offset_from2', '' );
	$chartTo2          = wpgpxmaps_findValue( $attr, 'chartto2', 'wpgpxmaps_graph_offset_to2', '' );
	/* Diagram - Heart rate */
	$showHr         = wpgpxmaps_findValue( $attr, 'showhr', 'wpgpxmaps_show_hr', false );
	$color_graph_hr = wpgpxmaps_findValue( $attr, 'glinecolorhr', 'wpgpxmaps_graph_line_color_hr', '#ff77bd' );
	/* Diagram - Temperature */
	$showAtemp         = wpgpxmaps_findValue( $attr, 'showatemp', 'wpgpxmaps_show_atemp', false );
	$color_graph_atemp = wpgpxmaps_findValue( $attr, 'glinecoloratemp', 'wpgpxmaps_graph_line_color_atemp', '#ff77bd' );
	/* Diagram - Cadence */
	$showCad         = wpgpxmaps_findValue( $attr, 'showcad', 'wpgpxmaps_show_cadence', false );
	$color_graph_cad = wpgpxmaps_findValue( $attr, 'glinecolorcad', 'wpgpxmaps_graph_line_color_cad', '#beecff' );
	/* Diagram - Grade */
	$showGrade         = wpgpxmaps_findValue( $attr, 'showgrade', 'wpgpxmaps_show_grade', false );
	$color_graph_grade = wpgpxmaps_findValue( $attr, 'glinecolorgrade', 'wpgpxmaps_graph_line_color_grade', '#beecff' );
	/* Pictures */
	$ngGalleries = wpgpxmaps_findValue( $attr, 'nggalleries', 'wpgpxmaps_map_ngGalleries', '' );
	$ngImages    = wpgpxmaps_findValue( $attr, 'ngimages', 'wpgpxmaps_map_ngImages', '' );
	$attachments = wpgpxmaps_findValue( $attr, 'attachments', 'wpgpxmaps_map_attachments', false );
	$dtoffset    = wpgpxmaps_findValue( $attr, 'dtoffset', 'wpgpxmaps_dtoffset', 0 );
	/* Advanced */
	$pointsoffset   = wpgpxmaps_findValue( $attr, 'pointsoffset', 'wpgpxmaps_pointsoffset', 10 );
	$donotreducegpx = wpgpxmaps_findValue( $attr, 'donotreducegpx', 'wpgpxmaps_donotreducegpx', false );

	$colors_map = "\"" . implode( "\",\"", ( explode( ' ', $color_map ) ) ) . "\"";

	$gpxurl = $gpx;

	/* Add file modification time to cache filename to catch new uploads with same file name */
	$mtime = wp_gpx_maps_sitePath() . str_replace( array( '/', '\\' ), DIRECTORY_SEPARATOR, trim( $gpx ) );
	if ( file_exists( $mtime ) ) {
		$mtime = filemtime( $mtime );
	} else {
		$mtime = 0;
	}
	$cacheFileName = "$gpx,$mtime,$w,$mh,$mt,$gh,$showEle,$showW,$showHr,$showAtemp,$showCad,$donotreducegpx,$pointsoffset,$showSpeed,$showGrade,$unit_of_measure_speed,$unit_of_measure,$distanceType,v1.3.9";

	$cacheFileName = md5( $cacheFileName );

	$gpxcache = gpxCacheFolderPath();

	if ( ! ( file_exists( $gpxcache ) && is_dir( $gpxcache ) ) )
		@mkdir( $gpxcache, 0755, true );

	$gpxcache .= DIRECTORY_SEPARATOR . $cacheFileName . '.tmp';

	/* Try to load cache */
	if ( file_exists( $gpxcache ) && ! ( true == $skipcache ) ) {

		try {
			$cache_str          = file_get_contents( $gpxcache );
			$cache_obj          = unserialize( $cache_str );
			$points_maps        = $cache_obj['points_maps'];
			$points_x_time      = $cache_obj['points_x_time'];
			$points_x_lat       = $cache_obj['points_x_lat'];
			$points_x_lon       = $cache_obj['points_x_lon'];
			$points_graph_dist  = $cache_obj['points_graph_dist'];
			$points_graph_ele   = $cache_obj['points_graph_ele'];
			$points_graph_speed = $cache_obj['points_graph_speed'];
			$points_graph_hr    = $cache_obj['points_graph_hr'];
			$points_graph_atemp = $cache_obj['points_graph_atemp'];
			$points_graph_cad   = $cache_obj['points_graph_cad'];
			$points_graph_grade = $cache_obj['points_graph_grade'];
			$waypoints          = $cache_obj['waypoints'];
			$max_ele            = $cache_obj['max_ele'];
			$min_ele            = $cache_obj['min_ele'];
			$max_time           = $cache_obj['max_time'];
			$min_time           = $cache_obj['min_time'];
			$total_ele_up       = $cache_obj['total_ele_up'];
			$total_ele_down     = $cache_obj['total_ele_down'];
			$avg_speed          = $cache_obj['avg_speed'];
			$avg_cad            = $cache_obj['avg_cad'];
			$avg_hr             = $cache_obj['avg_hr'];
			$avg_temp           = $cache_obj['avg_temp'];
			$tot_len            = $cache_obj['tot_len'];

		} catch ( Exception $e ) {
			$points_maps        = '';
			$points_x_time      = '';
			$points_x_lat       = '';
			$points_x_lon       = '';
			$points_graph_dist  = '';
			$points_graph_ele   = '';
			$points_graph_speed = '';
			$points_graph_hr    = '';
			$points_graph_atemp = '';
			$points_graph_cad   = '';
			$points_graph_grade = '';
			$waypoints          = '';
			$max_ele            = 0;
			$min_ele            = 0;
			$max_time           = 0;
			$min_time           = 0;
			$total_ele_up       = 0;
			$total_ele_down     = 0;
			$avg_speed          = 0;
			$avg_cad            = 0;
			$avgv_hr            = 0;
			$avg_temp           = 0;
			$tot_len            = 0;
		}
	}

	$isGpxUrl = ( preg_match( '/^(http(s)?\:\/\/)/', trim( $gpx ) ) == 1 );


	if ( ( ! isset( $points_maps ) || $points_maps == '' ) && $gpx != '' ) {
	// if (true) {

		$sitePath = wp_gpx_maps_sitePath();

		$gpx = trim( $gpx );

		if ( true == $isGpxUrl ) {
			$gpx = downloadRemoteFile( $gpx );
		} else {
			$gpx = str_replace( array( '/', '\\' ), DIRECTORY_SEPARATOR, $gpx );
			$gpx = $sitePath . $gpx;
		}
		if ( $gpx == '' ) {
			return "No gpx found";
		}

		$points = wpgpxmaps_getPoints( $gpx, $pointsoffset, $donotreducegpx, $distanceType );

		$points_maps        = '';
		$points_graph_dist  = '';
		$points_graph_ele   = '';
		$points_graph_speed = '';
		$points_graph_hr    = '';
		$points_graph_atemp = '';
		$points_graph_cad   = '';
		$points_graph_grade = '';
		$waypoints          = '';

		$points_x_time = $points->dt;
		$points_x_lat  = $points->lat;
		$points_x_lon  = $points->lon;

		$max_ele        = $points->maxEle;
		$min_ele        = $points->minEle;
		$max_time       = $points->maxTime;
		$min_time       = $points->minTime;
		$total_ele_up   = $points->totalEleUp;
		$total_ele_down = $points->totalEleDown;
		$avg_speed      = $points->avgSpeed;
		$avg_cad        = $points->avgCad;
		$avg_hr         = $points->avgHr;
		$avg_temp       = $points->avgTemp;
		$tot_len        = $points->totalLength;

		if ( is_array( $points_x_lat ) )
		foreach ( array_keys(
		$points_x_lat ) as $i ) {
			$_lat = (float) $points_x_lat[$i];
			$_lon = (float) $points_x_lon[$i];

			if ( 0 == $_lat && 0 == $_lon ) {
				$points_maps       .= 'null,';
				$points_graph_dist .= 'null,';
				$points_graph_ele  .= 'null,';

				if ( true == $showSpeed )
					$points_graph_speed .= 'null,';

				if ( true == $showHr )
					$points_graph_hr .= 'null,';

				if ( true == $showAtemp )
					$points_graph_atemp .= 'null,';

				if ( true == $showCad )
					$points_graph_cad .= 'null,';

				if ( true == $showGrade )
					$points_graph_grade .= 'null,';
			} else {
				$points_maps .= '[' . number_format( (float) $points_x_lat[$i], 7, '.', '' ) . ',' . number_format( (float) $points_x_lon[$i], 7, '.', '' ) . '],';

				$_ele  = (float) $points->ele[$i];
				$_dist = (float) $points->dist[$i];

				if ( wpgpxmaps_FEET_MILES == $unit_of_measure ) {
					/* feet / miles */
					$_dist *= 0.000621371192;
					$_ele  *= 3.2808399;

				} elseif ( wpgpxmaps_METERS_KILOMETERS == $unit_of_measure ) {
					/* meters / kilometers */
					$_dist = (float) ( $_dist / 1000 );

				} elseif ( wpgpxmaps_METERS_NAUTICALMILES == $unit_of_measure ) {
					/* meters / nautical miles */
					$_dist = (float) ( $_dist / 1000 / 1.852 );

				} elseif ( wpgpxmaps_METER_MILES == $unit_of_measure ) {
					/* meters / miles */
					$_dist *= 0.000621371192;

				} elseif ( wpgpxmaps_FEET_NAUTICALMILES == $unit_of_measure ) {
					/* feet / nautical miles */
					$_dist = (float) ( $_dist / 1000 / 1.852 );
					$_ele *= 3.2808399;
				}

				$points_graph_dist .= number_format( $_dist, 2, '.', '' ) . ',';
				$points_graph_ele  .= number_format( $_ele, 2, '.', '' ) . ',';

				if ( true == $showSpeed ) {
					$_speed              = (float) $points->speed[$i];
					$points_graph_speed .= convertSpeed( $_speed, $unit_of_measure_speed ) . ',';
				}

				if ( true == $showHr ) {
					$points_graph_hr .= number_format( $points->hr[$i], 2, '.', '' ) . ',';
				}

				if ( true == $showAtemp ) {
					$points_graph_atemp .= number_format( $points->atemp[$i], 1, '.', '' ) . ',';
				}

				if ( true == $showCad ) {
					$points_graph_cad .= number_format( $points->cad[$i], 2, '.', '' ) . ',';
				}

				if ( true == $showGrade ) {
					$points_graph_grade .= number_format( $points->grade[$i], 2, '.', '' ) . ',';
				}
			}
		}

		if ( wpgpxmaps_FEET_MILES == $unit_of_measure ) {
			/* feet / miles */
			$tot_len        = round( $tot_len * 0.000621371192, 2 ) . ' mi';
			$max_ele        = round( $max_ele * 3.2808399, 0 ) . ' ft';
			$min_ele        = round( $min_ele * 3.2808399, 0 ) . ' ft';
			$total_ele_up   = round( $total_ele_up * 3.2808399, 0 ) . ' ft';
			$total_ele_down = round( $total_ele_down * 3.2808399, 0 ) . ' ft';

		} elseif ( wpgpxmaps_METERS_KILOMETERS == $unit_of_measure ) {
			/* meters / kilometers */
			$tot_len        = round( $tot_len / 1000, 2 ) . ' km';
			$max_ele        = round( $max_ele, 0 ) . ' m';
			$min_ele        = round( $min_ele, 0 ) . ' m';
			$total_ele_up   = round( $total_ele_up, 0 ) . ' m';
			$total_ele_down = round( $total_ele_down, 0 ) . ' m';

		} elseif ( wpgpxmaps_METERS_NAUTICALMILES == $unit_of_measure ) {
			/* meters / nautical miles */
			$tot_len        = round( $tot_len / 1000 / 1.852, 2 ) . ' NM';
			$max_ele        = round( $max_ele, 0 ) . ' m';
			$min_ele        = round( $min_ele, 0 ) . ' m';
			$total_ele_up   = round( $total_ele_up, 0 ) . ' m';
			$total_ele_down = round( $total_ele_down, 0 ) . ' m';

		} elseif ( wpgpxmaps_METER_MILES == $unit_of_measure ) {
			/* meters / miles */
			$tot_len        = round( $tot_len * 0.000621371192, 2 ) . ' mi';
			$max_ele        = round( $max_ele, 0 ) . ' m';
			$min_ele        = round( $min_ele, 0 ) . ' m';
			$total_ele_up   = round( $total_ele_up, 0 ) . ' m';
			$total_ele_down = round( $total_ele_down, 0 ) . ' m';

		} elseif ( wpgpxmaps_FEET_NAUTICALMILES == $unit_of_measure ) {
			/* feet / nautical miles */
			$tot_len        = round( $tot_len / 1000 / 1.852, 2 ) . ' NM';
			$max_ele        = round( $max_ele * 3.2808399, 0 ) . ' ft';
			$min_ele        = round( $min_ele * 3.2808399, 0 ) . ' ft';
			$total_ele_up   = round( $total_ele_up * 3.2808399, 0 ) . ' ft';
			$total_ele_down = round( $total_ele_down * 3.2808399, 0 ) . ' ft';

		} else {
			/* meters / meters */
			$tot_len        = round( $tot_len, 0 ) . ' m';
			$max_ele        = round( $max_ele, 0 ) . ' m';
			$min_ele        = round( $min_ele, 0 ) . ' m';
			$total_ele_up   = round( $total_ele_up, 0 ) . ' m';
			$total_ele_down = round( $total_ele_down, 0 ) . ' m';
		}

		$avg_speed = convertSpeed( $avg_speed, $unit_of_measure_speed, true );
		$waypoints = '[]';

		if ( true == $showW ) {
			$wpoints   = wpgpxmaps_getWayPoints( $gpx );
			$waypoints = wp_json_encode( $wpoints );
		}
		if ( false == $showEle ) {
			$points_graph_ele = '';
		}

		$p = '/(,|,null,)$/';

		$points_maps = preg_replace( $p, '', $points_maps );

		$points_graph_dist  = preg_replace( $p, '', $points_graph_dist );
		$points_graph_ele   = preg_replace( $p, '', $points_graph_ele );
		$points_graph_speed = preg_replace( $p, '', $points_graph_speed );
		$points_graph_hr    = preg_replace( $p, '', $points_graph_hr );
		$points_graph_atemp = preg_replace( $p, '', $points_graph_atemp );
		$points_graph_cad   = preg_replace( $p, '', $points_graph_cad );
		$points_graph_grade = preg_replace( $p, '', $points_graph_grade );

		$waypoints = preg_replace( $p, '', $waypoints );

		if ( preg_match( '/^(0,?)+$/', $points_graph_dist ) )
			$points_graph_dist = '';

		if ( preg_match( '/^(0,?)+$/', $points_graph_ele ) )
			$points_graph_ele = '';

		if ( preg_match( '/^(0,?)+$/', $points_graph_speed ) )
			$points_graph_speed = '';

		if ( preg_match( '/^(0,?)+$/', $points_graph_hr ) )
			$points_graph_hr = '';

		if ( preg_match( '/^(0,?)+$/', $points_graph_hr ) )
			$points_graph_hr = '';

		if ( preg_match( '/^(0,?)+$/', $points_graph_atemp ) )
			$points_graph_atemp = '';

		if ( preg_match( '/^(0,?)+$/', $points_graph_grade ) )
			$points_graph_grade = '';

	}

	$ngimgs_data = '';
	if ( $ngGalleries != '' || $ngImages != '' ) {
		$ngimgs      = getNGGalleryImages( $ngGalleries, $ngImages, $points_x_time, $points_x_lat, $points_x_lon, $dtoffset, $error );
		$ngimgs_data = '';

		foreach ( $ngimgs as $img ) {
			$data         = $img['data'];
			$data         = str_replace( '\n', '', $data );
			$ngimgs_data .= '<span lat="' . $img['lat'] . '" lon="' . $img['lon'] . '">' . $data . '</span>';
		}
	}

	if ( true == $attachments ) {
		$attimgs = wpgpxmaps_getAttachedImages( $points_x_time, $points_x_lat, $points_x_lon, $dtoffset, $error );
		foreach ( $attimgs as $img ) {
			$data         = $img['data'];
			$data         = str_replace( '\n', '', $data );
			$ngimgs_data .= '<span lat="' . $img['lat'] . '" lon="' . $img['lon'] . '">' . $data . '</span>';
		}
	}

	if ( ! ( true == $skipcache ) ) {

		@file_put_contents( $gpxcache, serialize( array(
			'points_maps'        => $points_maps,
			'points_x_time'      => $points_x_time,
			'points_x_lat'       => $points_x_lat,
			'points_x_lon'       => $points_x_lon,
			'points_graph_dist'  => $points_graph_dist,
			'points_graph_ele'   => $points_graph_ele,
			'points_graph_speed' => $points_graph_speed,
			'points_graph_hr'    => $points_graph_hr,
			'points_graph_atemp' => $points_graph_atemp,
			'points_graph_cad'   => $points_graph_cad,
			'points_graph_grade' => $points_graph_grade,
			'waypoints'          => $waypoints,
			'max_ele'            => $max_ele,
			'min_ele'            => $min_ele,
			'total_ele_up'       => $total_ele_up,
			'total_ele_down'     => $total_ele_down,
			'avg_speed'          => $avg_speed,
			'avg_cad'            => $avg_cad,
			'avg_hr'             => $avg_hr,
			'avg_temp'           => $avg_temp,
			'tot_len'            => $tot_len,
			'max_time'           => $max_time,
			'min_time'           => $min_time,
		)
	),
		LOCK_EX);
		@chmod( $gpxcache, 0755 );
	}

	$hideGraph = ( '0' == $gh || '0px' == $gh );

	global $post;
	$r = $post->ID . '_' . rand( 1,5000000 );

	$output = '
		<div id="wpgpxmaps_' . $r . '" class="wpgpxmaps">
			<div id="map_' . $r . '_cont" style="width:' . $w . '; height:' . $mh . ';position:relative" >
				<div id="map_' . $r . '" style="width:' . $w . '; height:' . $mh . '"></div>
				<div id="wpgpxmaps_' . $r . '_osm_footer" class="wpgpxmaps_osm_footer" style="display:none;"><span> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span></div>
			</div>
			<canvas id="myChart_' . $r . '" class="plot" style="width:' . $w . '; height:' . $gh . '"></canvas>
			<div id="ngimages_' . $r . '" class="ngimages" style="display:none">' . $ngimgs_data . '</div>
			<div id="report_' . $r . '" class="report"></div>
		</div>
		' . $error . '
		<script type="text/javascript">

			jQuery(document).ready(function() {

				jQuery( "#wpgpxmaps_' . $r . '" ).wpgpxmaps( {
					targetId           : "' . $r . '",
					mapType            : "' . $mt . '",
					mapData            : [' . $points_maps . '],
					graphDist          : [' . ( $hideGraph ? '' : $points_graph_dist ) . '],
					graphEle           : [' . ( $hideGraph ? '' : $points_graph_ele ) . '],
					graphSpeed         : [' . ( $hideGraph ? '' : $points_graph_speed ) . '],
					graphHr            : [' . ( $hideGraph ? '' : $points_graph_hr ) . '],
					graphAtemp         : [' . ( $hideGraph ? '' : $points_graph_atemp ) . '],
					graphCad           : [' . ( $hideGraph ? '' : $points_graph_cad ) . '],
					graphGrade         : [' . ( $hideGraph ? '' : $points_graph_grade ) . '],
					waypoints          : ' . $waypoints . ',
					unit               : "' . $unit_of_measure . '",
					unitspeed          : "' . $unit_of_measure_speed . '",
					color1             : [' . $colors_map . '],
					color2             : "' . $color_graph . '",
					color3             : "' . $color_graph_speed . '",
					color4             : "' . $color_graph_hr . '",
					color5             : "' . $color_graph_cad . '",
					color6             : "' . $color_graph_grade . '",
					color7             : "' . $color_graph_atemp . '",
					chartFrom1         : "' . $chartFrom1 . '",
					chartTo1           : "' . $chartTo1 . '",
					chartFrom2         : "' . $chartFrom2 . '",
					chartTo2           : "' . $chartTo2 . '",
					startIcon          : "' . $startIcon . '",
					endIcon            : "' . $endIcon . '",
					currentIcon        : "' . $currentIcon . '",
					waypointIcon       : "' . $waypointIcon . '",
					currentpositioncon : "' . $currentpositioncon . '",
					usegpsposition     : "' . $usegpsposition . '",
					zoomOnScrollWheel  : "' . $zoomOnScrollWheel . '",
					ngGalleries        : [' . $ngGalleries . '],
					ngImages           : [' . $ngImages . '],
					pluginUrl          : "' . plugins_url() . '",
					TFApiKey           : "' . get_option( 'wpgpxmaps_openstreetmap_apikey' ) . '",
					langs              : {
						altitude        : "' . __( 'Altitude', 'wp-gpx-maps' ) . '",
						currentPosition : "' . __( 'Current position', 'wp-gpx-maps' ) . '",
						speed           : "' . __( 'Speed', 'wp-gpx-maps' ) . '",
						grade           : "' . __( 'Grade', 'wp-gpx-maps' ) . '",
						heartRate       : "' . __( 'Heart rate', 'wp-gpx-maps' ) . '",
						atemp           : "' . __( 'Temperature', 'wp-gpx-maps' ) . '",
						cadence         : "' . __( 'Cadence', 'wp-gpx-maps' ) . '",
						goFullScreen    : "' . __( 'Go full screen', 'wp-gpx-maps' ) . '",
						exitFullFcreen  : "' . __( 'Exit full screen', 'wp-gpx-maps' ) . '",
						hideImages      : "' . __( 'Hide images', 'wp-gpx-maps' ) . '",
						showImages      : "' . __( 'Show images', 'wp-gpx-maps' ) . '",
						backToCenter	: "' . __( 'Back to center', 'wp-gpx-maps' ) . '"
					}
				});

			});

		</script>';

	/* Print summary */
	if ( true == $summary && ( $points_graph_speed != '' || $points_graph_ele != '' || $points_graph_dist != '' ) ) {

		$output .= "<div id='wpgpxmaps_summary_" . $r . "' class='wpgpxmaps_summary'>";
		if ( $points_graph_dist != '' && true == $p_tot_len ) {
			$output .= "<span class='totlen'><span class='summarylabel'>" . __( 'Total distance:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $tot_len</span></span><br />";
		}
		if ( $points_graph_ele != ' ' ) {
			if ( true == $p_max_ele )
				$output .= "<span class='maxele'><span class='summarylabel'>" . __( 'Max elevation:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $max_ele</span></span><br />";
			if ( true == $p_min_ele )
				$output .= "<span class='minele'><span class='summarylabel'>" . __( 'Min elevation:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $min_ele</span></span><br />";
			if ( true == $p_total_ele_up )
				$output .= "<span class='totaleleup'><span class='summarylabel'>" . __( 'Total climbing:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $total_ele_up</span></span><br />";
			if ( true == $p_total_ele_down )
				$output .= "<span class='totaleledown'><span class='summarylabel'>" . __( 'Total descent:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $total_ele_down</span></span><br />";
		}
		if ( $points_graph_speed != '' && true == $p_avg_speed ) {
			$output .= "<span class='avgspeed'><span class='summarylabel'>" . __( 'Average speed:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $avg_speed</span></span><br />";
		}
		if ( $points_graph_cad != '' && true == $p_avg_cad ) {
			$output .= "<span class='avgcad'><span class='summarylabel'>" . __( 'Average cadence:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $avg_cad</span></span><br />";
		}
		if ( $points_graph_hr != '' && true == $p_avg_hr ) {
			$output .= "<span class='avghr'><span class='summarylabel'>" . __( 'Average heart rate:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $avg_hr</span></span><br />";
		}
		if ( $points_graph_atemp != '' && true == $p_avg_temp ) {
			$output .= "<span class='avgtemp'><span class='summarylabel'>" . __( 'Average temperature:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $avg_temp</span></span><br />";
		}
		if ( true == $p_total_time && $max_time > 0 ) {
			$time_diff = date( 'H:i:s', ( $max_time - $min_time ) );
			$output   .= "<span class='totaltime'><span class='summarylabel'>" . __( 'Total time:', 'wp-gpx-maps' ) . "</span><span class='summaryvalue'> $time_diff</span></span><br />";
		}
		$output .= '</div>';
	}
	
	//$output .="--$download--";

	/* Print download link */
	if ( (true === $download || 'true' === $download ) && $gpxurl != '' ) {
		if ( true == $isGpxUrl ) {


		} else {

			$dummy  = ( defined( 'WP_SITEURL' ) ) ? WP_SITEURL : get_bloginfo( 'url' );
			$gpxurl = $dummy . $gpxurl;
		}
		$downloadname = basename($gpxurl);
		$output .= "Download file: <a href='$gpxurl' target='_new' download>" . __( $downloadname, 'wp-gpx-maps' ) . '</a>';
	}

	return $output;
}

function convertSeconds( $s ) {

	if ( 0 == $s )
		return 0;
	
	$s      = 1.0 / $s;
	$_sSecT = $s * 60; // sec/km
	$_sMin  = floor( $_sSecT / 60 );
	$_sSec  = $_sSecT - $_sMin * 60;
	return $_sMin + $_sSec / 100;
}

function convertSpeed( $speed, $unit_of_measure_speed, $addUom = false ) {

	$unit_of_measure = '';

	if ( wpgpxmaps_MINUTES_PER_100METERS == $unit_of_measure_speed && $speed != 0 ) {
		/* min/100 meters */
		$speed = 1 / $speed * 100 / 60;
		$unit_of_measure   = ' min/100m';

	} elseif ( wpgpxmaps_KNOTS == $unit_of_measure_speed ) {
		/* knots */
		$speed *= 1.94384449;
		$unit_of_measure    = ' knots';

	} elseif ( wpgpxmaps_MINUTES_PER_MILES == $unit_of_measure_speed ) {
		/* min/miles*/
		$speed = convertSeconds( $speed * 0.037282272 );
		$unit_of_measure   = ' min/mi';

	} elseif ( wpgpxmaps_MINUTES_PER_KM == $unit_of_measure_speed ) {
		/* min/km */
		$speed = convertSeconds( $speed * 0.06 );
		$unit_of_measure   = ' min/km';

	} elseif ( wpgpxmaps_MILES_PER_HOURS == $unit_of_measure_speed ) {
		/* miles/h */
		$speed *= 2.2369362920544025;
		$unit_of_measure    = ' mi/h';

	} elseif ( wpgpxmaps_KM_PER_HOURS == $unit_of_measure_speed ) {
		/* km/h */
		$speed *= 3.6;
		$unit_of_measure    = ' km/h';

	} else {
		/* default m/s */
		$unit_of_measure = ' m/s';
	}

	if ( true == $addUom ) {
		return number_format( $speed, 2, '.', '' ) . $unit_of_measure;
	} else {
		return number_format( $speed, 2, '.', '' );
	}

}

function downloadRemoteFile( $remoteFile ) {

	try {
		$newfname = tempnam( '/tmp', 'gpx' );

		if ( function_exists( 'file_put_contents' ) ) {
			file_put_contents( $newfname, fopen( $remoteFile, 'r' ) );
			return $newfname;
		}
		$file = fopen( $remoteFile, 'rb' );
		if ( $file ) {
			$newf = fopen( $newfname, 'wb' );
			if ( $newf )
			while ( ! feof( $file ) ) {
				fwrite( $newf, fread( $file, 1024 * 8 ), 1024 * 8 );
			}
		}
		if ( $file ) {
			fclose( $file );
		}
		if ( $newf ) {
			fclose( $newf );
		}
		return $newfname;
	} catch ( Exception $e ) {
		print_r( $e );
		return '';
	}

}

function unescape( $value ) {

	$value = str_replace( "'", "\'", $value );
	$value = str_replace( array( '\n', '\r' ), '', $value );
	return $value;

}

function wpgpxmaps_install_option() {

	/* General */
	add_option( 'wpgpxmaps_width', '100%', '', 'yes' );
	add_option( 'wpgpxmaps_height', '450px', '', 'yes' );
	add_option( 'wpgpxmaps_graph_height', '200px', '', 'yes' );
	add_option( 'wpgpxmaps_distance_type', '0', '', 'yes' );
	add_option( 'wpgpxmaps_skipcache', '', '', 'yes' );
	add_option( 'wpgpxmaps_download', '', '', 'yes' );
	add_option( 'wpgpxmaps_usegpsposition', '', '', 'yes' );
	/* Print Summary Table */
	add_option( 'wpgpxmaps_summary', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_tot_len', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_max_ele', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_min_ele', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_total_ele_up', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_total_ele_down', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_avg_speed', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_avg_cad', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_avg_hr', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_avg_temp', '', '', 'yes' );
	add_option( 'wpgpxmaps_summary_total_time', '', '', 'yes' );
	/* Map */
	add_option( 'wpgpxmaps_map_type', 'HYBRID', '', 'yes' );
	add_option( 'wpgpxmaps_map_line_color', '#3366cc', '', 'yes' );
	add_option( 'wpgpxmaps_zoomonscrollwheel', '', '', 'yes' );
	add_option( 'wpgpxmaps_show_waypoint', '', '', 'yes' );
	add_option( 'wpgpxmaps_map_start_icon', '', '', 'yes' );
	add_option( 'wpgpxmaps_map_end_icon', '', '', 'yes' );
	add_option( 'wpgpxmaps_currentpositioncon', '', '', 'yes' );
	add_option( 'wpgpxmaps_map_current_icon', '', '', 'yes' );
	add_option( 'wpgpxmaps_map_waypoint_icon', '', '', 'yes' );
	/* Diagram - Elevation */
	add_option( 'wpgpxmaps_show_elevation', 'true', '', 'yes' );
	add_option( 'wpgpxmaps_graph_line_color', '#3366cc', '', 'yes' );
	add_option( 'wpgpxmaps_unit_of_measure', '0', '', 'yes' );
	add_option( 'wpgpxmaps_graph_offset_from1', '', '', 'yes' );
	add_option( 'wpgpxmaps_graph_offset_to1', '', '', 'yes' );
	/* Diagram - Speed */
	add_option( 'wpgpxmaps_show_speed', '', '', 'yes' );
	add_option( 'wpgpxmaps_graph_line_color_speed', '#ff0000', '', 'yes' );
	add_option( 'wpgpxmaps_unit_of_measure_speed', '0', '', 'yes' );
	add_option( 'wpgpxmaps_graph_offset_from2', '', '', 'yes' );
	add_option( 'wpgpxmaps_graph_offset_to2', '', '', 'yes' );
	/* Diagram - Heart rate */
	add_option( 'wpgpxmaps_show_hr', '', '', 'yes' );
	add_option( 'wpgpxmaps_graph_line_color_hr', '#ff77bd', '', 'yes' );
	/* Diagram - Temperature */
	add_option( 'wpgpxmaps_show_atemp', '', '', 'yes' );
	add_option( 'wpgpxmaps_graph_line_color_atemp', '#ff77bd', '', 'yes' );
	/* Diagram - Cadence */
	add_option( 'wpgpxmaps_show_cadence', '', '', 'yes' );
	add_option( 'wpgpxmaps_graph_line_color_cad', '#beecff', '', 'yes' );
	/* Diagram - Grade */
	add_option( 'wpgpxmaps_show_grade', '', '', 'yes' );
	add_option( 'wpgpxmaps_graph_line_color_grade', '#beecff', '', 'yes' );
	/* Pictures */
	add_option( 'wpgpxmaps_map_nggallery', '', '', 'yes' );
	/* Advanced */
	add_option( 'wpgpxmaps_pointsoffset', '10', '', 'yes' );
	add_option( 'wpgpxmaps_donotreducegpx', 'true', '', 'yes' );
	/* Administration */
	add_option( 'wpgpxmaps_allow_users_upload', '', '', 'yes' );
	add_option( 'wpgpxmaps_show_notice', '', '', 'yes' );

}

function wpgpxmaps_remove_option() {

	/* General */
	delete_option( 'wpgpxmaps_width' );
	delete_option( 'wpgpxmaps_graph_height' );
	delete_option( 'wpgpxmaps_height' );
	delete_option( 'wpgpxmaps_distance_type' );
	delete_option( 'wpgpxmaps_skipcache' );
	delete_option( 'wpgpxmaps_download' );
	delete_option( 'wpgpxmaps_usegpsposition' );
	/* Print Summary Table */
	delete_option( 'wpgpxmaps_summary' );
	delete_option( 'wpgpxmaps_summary_tot_len' );
	delete_option( 'wpgpxmaps_summary_max_ele' );
	delete_option( 'wpgpxmaps_summary_min_ele' );
	delete_option( 'wpgpxmaps_summary_total_ele_up' );
	delete_option( 'wpgpxmaps_summary_total_ele_down' );
	delete_option( 'wpgpxmaps_summary_avg_speed' );
	delete_option( 'wpgpxmaps_summary_avg_cad' );
	delete_option( 'wpgpxmaps_summary_avg_hr' );
	delete_option( 'wpgpxmaps_summary_avg_temp' );
	delete_option( 'wpgpxmaps_summary_total_time' );
	/* Map */
	delete_option( 'wpgpxmaps_map_type' );
	delete_option( 'wpgpxmaps_map_line_color' );
	delete_option( 'wpgpxmaps_zoomonscrollwheel' );
	delete_option( 'wpgpxmaps_show_waypoint' );
	delete_option( 'wpgpxmaps_map_start_icon' );
	delete_option( 'wpgpxmaps_map_end_icon' );
	delete_option( 'wpgpxmaps_currentpositioncon' );
	delete_option( 'wpgpxmaps_map_current_icon' );
	delete_option( 'wpgpxmaps_map_waypoint_icon' );
	/* Diagram - Elevation */
	delete_option( 'wpgpxmaps_show_elevation' );
	delete_option( 'wpgpxmaps_graph_line_color' );
	delete_option( 'wpgpxmaps_unit_of_measure' );
	delete_option( 'wpgpxmaps_graph_offset_from1' );
	delete_option( 'wpgpxmaps_graph_offset_to1' );
	/* Diagram - Speed */
	delete_option( 'wpgpxmaps_show_speed' );
	delete_option( 'wpgpxmaps_graph_line_color_speed' );
	delete_option( 'wpgpxmaps_unit_of_measure_speed' );
	delete_option( 'wpgpxmaps_graph_offset_from2' );
	delete_option( 'wpgpxmaps_graph_offset_to2' );
	/* Diagram - Heart rate */
	delete_option( 'wpgpxmaps_show_hr' );
	delete_option( 'wpgpxmaps_graph_line_color_hr' );
	/* Diagram - Temperature */
	delete_option( 'wpgpxmaps_show_atemp' );
	delete_option( 'wpgpxmaps_graph_line_color_atemp' );
	/* Diagram - Cadence */
	delete_option( 'wpgpxmaps_show_cadence' );
	delete_option( 'wpgpxmaps_graph_line_color_cad' );
	/* Diagram - Grade */
	delete_option( 'wpgpxmaps_show_grade' );
	delete_option( 'wpgpxmaps_graph_line_color_grade' );
	/* Pictures */
	delete_option( 'wpgpxmaps_map_nggallery' );
	/* Advanced */
	delete_option( 'wpgpxmaps_pointsoffset' );
	delete_option( 'wpgpxmaps_donotreducegpx' );
	/* Administration */
	delete_option( 'wpgpxmaps_allow_users_upload' );
	delete_option( 'wpgpxmaps_show_notice' );

	/* Deleted settings */
	delete_option( 'wpgpxmaps_allow_users_view' );

}
