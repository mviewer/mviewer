<?php

	require_once( ABSPATH . 'wp-admin/includes/file.php' );

	require_once( 'wp-gpx-maps-utils-nggallery.php' );

function wpgpxmaps_getAttachedImages( $dt, $lat, $lon, $dtoffset, &$error ) {

	$result = array();

	try {
		$attachments = get_children( array(
			'post_parent'    => get_the_ID(),
			'post_type'      => 'attachment',
			/* show all -1 */
			'numberposts'    => -1,
			'post_status'    => 'inherit',
			'post_mime_type' => 'image',
			'order'          => 'ASC',
			'orderby'        => 'menu_order ASC',
		) );

		foreach ( $attachments as $attachment_id => $attachment ) {

			$img_src      = wp_get_attachment_image_src( $attachment_id, 'full' );
			$img_thmb     = wp_get_attachment_image_src( $attachment_id, 'thumbnail' );
			$img_metadata = wp_get_attachment_metadata( $attachment_id );
			$img_file     = get_attached_file( $attachment_id, $unfiltered );

			$item         = array();
			$item['data'] = wp_get_attachment_link( $attachment_id, array( 105, 105 ) );
			if (!strpos('alt',$item['data'])) {
				if (!empty(get_the_excerpt($attachment_id))) {
					$item['data'] = str_replace('src=','alt="' . get_the_excerpt($attachment_id) . '" src=',$item['data']);
				} elseif (!empty(get_the_title($attachment_id))) {
					$item['data'] = str_replace('src=','alt="' . get_the_title($attachment_id) . '" src=',$item['data']);
				} else {
					$item['data'] = str_replace('src=','alt="missing caption" src=',$item['data']);
				}
			}
			
			if ( is_callable( 'exif_read_data' ) ) {
				
				try {
					$exif = @exif_read_data( $img_file );
				} catch (Exception $e) {
					$exif = false;
				}
								
				if ( $exif !== false ) {
					$item['lon'] = getExifGps( $exif['GPSLongitude'], $exif['GPSLongitudeRef'] );
					$item['lat'] = getExifGps( $exif['GPSLatitude'], $exif['GPSLatitudeRef'] );
					if ( ( $item['lat'] != 0 ) || ( $item['lon'] != 0 ) ) {
						$result[] = $item;
					} elseif ( isset( $exif['DateTimeOriginal'] ) ) {
						$_dt   = strtotime( $exif['DateTimeOriginal'] ) + $dtoffset;
						$_item = findItemCoordinate( $_dt, $dt, $lat, $lon );
						if ( $_item != null ) {
							$item['lat'] = $_item['lat'];
							$item['lon'] = $_item['lon'];
							$result[]    = $item;
						}
					}
				}
			} else {
				$error .= "Sorry, <a href='http://php.net/manual/en/function.exif-read-data.php' target='_blank' >exif_read_data</a> function not found! check your hosting.<br />";
			}
		}
	} catch ( Exception $e ) {
			$error .= 'Error When Retrieving attached images: $e <br />';
	}
		return $result;
}

function wp_gpx_maps_sitePath() {

	return substr( substr( __FILE__, 0, strrpos( __FILE__, 'wp-content' ) ), 0, -1 );
	// return substr(get_home_path(), 0, -1);
}

function gpxFolderPath() {

	$upload_dir  = wp_upload_dir();
	$uploadsPath = $upload_dir['basedir'];

	if ( current_user_can( 'manage_options' ) ) {
			$ret = $uploadsPath . DIRECTORY_SEPARATOR . 'gpx';
	} elseif ( current_user_can( 'publish_posts' ) ) {
			global $current_user;
			wp_get_current_user();
			$ret = $uploadsPath . DIRECTORY_SEPARATOR . 'gpx' . DIRECTORY_SEPARATOR . $current_user->user_login;
	}

	return str_replace( array( '/', '\\' ), DIRECTORY_SEPARATOR, $ret );
}

function gpxCacheFolderPath() {

	$upload_dir  = wp_upload_dir();
	$uploadsPath = $upload_dir['basedir'];
	$ret         = $uploadsPath . DIRECTORY_SEPARATOR . 'gpx' . DIRECTORY_SEPARATOR . '~cache';
	return str_replace( array( '/', '\\' ), DIRECTORY_SEPARATOR, $ret );
}

function relativeGpxFolderPath() {

	$sitePath    = wp_gpx_maps_sitePath();
	$realGpxPath = gpxFolderPath();
	$ret         = str_replace( $sitePath, '', $realGpxPath ) . DIRECTORY_SEPARATOR;
	return str_replace( array( '/', '\\' ), DIRECTORY_SEPARATOR, $ret );
}

function relativeGpxCacheFolderPath() {

	$sitePath         = wp_gpx_maps_sitePath();
	$realGpxCachePath = gpxCacheFolderPath();
	$ret              = str_replace( $sitePath, '', $realGpxCachePath ) . DIRECTORY_SEPARATOR;
	return str_replace( array( '/', '\\' ), DIRECTORY_SEPARATOR, $ret );
}

function wpgpxmaps_recursive_remove_directory( $directory, $empty = false ) {

	if ( substr( $directory, -1 ) == '/' ) {
		$directory = substr( $directory, 0, -1 );
	}
	if ( ! file_exists( $directory ) || ! is_dir( $directory ) ) {
		return false;
	} elseif ( is_readable( $directory ) ) {
		$handle = opendir( $directory );
		while ( false !== ( $item = readdir( $handle ) ) ) {
			if ( $item != '.' && $item != '..' ) {
				$path = $directory . '/' . $item;
				if ( is_dir( $path ) ) {
					wpgpxmaps_recursive_remove_directory( $path );
				} else {
					unlink( $path );
				}
			}
		}
		closedir( $handle );
		if ( false == $empty ) {
			if ( ! rmdir( $directory ) ) {
				return false;
			}
		}
	}
	return true;
}

function wpgpxmaps_getPoints( $gpxPath, $gpxOffset = 10, $donotreducegpx = false, $distancetype = 0) {

	$points = array();
	$dist   = 0;

	$lastLat    = 0;
	$lastLon    = 0;
	$lastEle    = 0;
	$lastOffset = 0;

	if ( file_exists( $gpxPath ) ) {
		$points = wpgpxmaps_parseXml( $gpxPath, $gpxOffset, $distancetype );
	} else {
		echo _e( 'WP GPX Maps Error: GPX file not found!', 'wp-gpx-maps' ) . ' ' . $gpxPath;
	}
	
	/* Reduce the points to around 200 to speedup */
	if ( $donotreducegpx != true ) {
		$count = sizeof( $points->lat );
		if ( $count > 200 ) {
			$f = round( $count/200 );
			if ( $f > 1 )
				for ( $i = $count; $i > 0;$i-- )
			if ( $i % $f != 0 && $points->lat[$i] != null ) {
				unset( $points->dt[$i] );
				unset( $points->lat[$i] );
				unset( $points->lon[$i] );
				unset( $points->ele[$i] );
				unset( $points->dist[$i] );
				unset( $points->speed[$i] );
				unset( $points->hr[$i] );
				unset( $points->atemp[$i] );
				unset( $points->cad[$i] );
				unset( $points->grade[$i] );
			}
		}
	}
	return $points;
}

function wpgpxmaps_parseXml( $filePath, $gpxOffset, $distancetype ) {

	$points = new stdClass;

	$points->dt    = array();
	$points->lat   = array();
	$points->lon   = array();
	$points->ele   = array();
	$points->dist  = array();
	$points->speed = array();
	$points->hr    = array();
	$points->atemp = array();
	$points->cad   = array();
	$points->grade = array();

	$points->maxTime      = 0;
	$points->minTime      = 0;
	$points->maxEle       = 0;
	$points->minEle       = 0;
	$points->totalEleUp   = 0;
	$points->totalEleDown = 0;
	$points->avgSpeed     = 0;
	$points->avgCad       = 0;
	$points->avgHr        = 0;
	$points->avgTemp      = 0;
	$points->totalLength  = 0;

	$gpx = simplexml_load_file( $filePath );

	if ( false === $gpx )
		return;

		$gpx->registerXPathNamespace( 'a', 'http://www.topografix.com/GPX/1/0' );
		$gpx->registerXPathNamespace( 'b', 'http://www.topografix.com/GPX/1/1' );
		$gpx->registerXPathNamespace( 'ns3', 'http://www.garmin.com/xmlschemas/TrackPointExtension/v1' );

		$nodes = $gpx->xpath( '//trk | //a:trk | //b:trk ' );
		/* Normal GPX */

	if ( count( $nodes ) > 0 ) {

		foreach ( $nodes as $_trk ) {

			$trk = simplexml_load_string( $_trk->asXML() );

			$trk->registerXPathNamespace( 'a', 'http://www.topografix.com/GPX/1/0' );
			$trk->registerXPathNamespace( 'b', 'http://www.topografix.com/GPX/1/1' );
			$trk->registerXPathNamespace( 'ns3', 'http://www.garmin.com/xmlschemas/TrackPointExtension/v1' );

			$trkpts = $trk->xpath( '//trkpt | //a:trkpt | //b:trkpt' );

			$lastLat  = 0;
			$lastLon  = 0;
			$lastEle  = 0;
			$lastTime = 0;
			$dist     = 0;
			$lastOffset  = 0;
			$speedBuffer = array();

			foreach ( $trkpts as $trkpt ) {

				$lat   = (float) $trkpt['lat'];
				$lon   = (float) $trkpt['lon'];
				$ele   = (float) $trkpt->ele;
				$time  = $trkpt->time;
				$speed = (float) $trkpt->speed;
				$hr    = 0;
				$atemp = 0;
				$cad   = 0;
				$grade = 0;

				if ( isset( $trkpt->extensions ) ) {

					$arr = json_decode( wp_json_encode( $trkpt->extensions ), 1 );

					if ( isset( $arr['ns3:TrackPointExtension'] ) ) {
						$tpe   = $arr['ns3:TrackPointExtension'];
						$hr    = @$tpe['ns3:hr'];
						$atemp = @$tpe['ns3:atemp'];
						$cad   = @$tpe['ns3:cad'];

					} elseif ( isset( $arr['TrackPointExtension'] ) ) {
						$tpe   = $arr['TrackPointExtension'];
						$hr    = @$tpe['hr'];
						$atemp = @$tpe['atemp'];
						$cad   = @$tpe['cad'];
					}
				}

				if ( 0 == $lastLat && 0 == $lastLon ) {

					/* Base Case  */
					array_push( $points->dt, strtotime( $time ) );
					array_push( $points->lat, (float) $lat );
					array_push( $points->lon, (float) $lon );
					array_push( $points->ele, (float) round( $ele, 2 ) );
					array_push( $points->dist, (float) round( $dist, 2 ) );
					array_push( $points->speed, 0 );
					array_push( $points->hr, (float) $hr );
					array_push( $points->atemp, (float) $atemp );
					array_push( $points->cad, (float) $cad );
					array_push( $points->grade, $grade );

					$lastLat  = $lat;
					$lastLon  = $lon;
					$lastEle  = $ele;
					$lastTime = $time;
				} else {
					
					/* Normal Case  */
					$offset = calculateDistance( (float) $lat, (float) $lon, (float) $ele, (float) $lastLat, (float) $lastLon, (float) $lastEle, $distancetype );
					$dist   = $dist + $offset;

					$points->totalLength = $dist;

					if ( $speed == 0 ) {
							$datediff = (float) my_date_diff( $lastTime, $time );
						if ( $datediff != 0 ) {
							$speed = $offset / $datediff;
						}
					}

					if ( $ele != 0 && $lastEle != 0 && $offset != 0 ) {
						$deltaEle = (float) ( $ele - $lastEle );

						if ( (float) $ele > (float) $lastEle ) {
							$points->totalEleUp += $deltaEle;
						} else {
							$points->totalEleDown += $deltaEle;
						}
						$grade = $deltaEle / $offset * 100;
					}

					array_push( $speedBuffer, $speed );

					if ( ( (float) $offset + (float) $lastOffset ) > $gpxOffset ) {
						/* Bigger Offset -> write coordinate */
						$avgSpeed = 0;

						foreach ( $speedBuffer as $s ) {
							$avgSpeed += $s;
						}

						$avgSpeed    = $avgSpeed / count( $speedBuffer );
						$speedBuffer = array();

						$lastOffset = 0;

						array_push( $points->dt, strtotime( $time ) );
						array_push( $points->lat, (float) $lat );
						array_push( $points->lon, (float) $lon );
						array_push( $points->ele, (float) round( $ele, 2 ) );
						array_push( $points->dist, (float) round( $dist, 2 ) );
						array_push( $points->speed, (float) round( $avgSpeed, 1 ) );
						array_push( $points->hr, $hr );
						array_push( $points->atemp,	$atemp );
						array_push( $points->cad, $cad );
						array_push( $points->grade, (float) round( $grade, 2 ) );
					} else {
						/* Smoller Offset -> continue.. */
						$lastOffset = (float) $lastOffset + (float) $offset;
					}
				}
				$lastLat  = $lat;
				$lastLon  = $lon;
				$lastEle  = $ele;
				$lastTime = $time;
			}
			array_push( $points->dt, null );
			array_push( $points->lat, null );
			array_push( $points->lon, null );
			array_push( $points->ele, null );
			array_push( $points->dist, null );
			array_push( $points->speed, null );
			array_push( $points->hr, null );
			array_push( $points->atemp, null );
			array_push( $points->cad, null );
			array_push( $points->grade, null );

			unset( $trkpts );
		}
		unset( $nodes );

		try {
			array_pop( $points->dt );
			array_pop( $points->lat );
			array_pop( $points->lon );
			array_pop( $points->ele );
			array_pop( $points->dist );
			array_pop( $points->speed );
			array_pop( $points->hr );
			array_pop( $points->atemp );
			array_pop( $points->cad );
			array_pop( $points->grade );

			$_time               = array_filter( $points->dt );
			$_ele                = array_filter( $points->ele );
			$_dist               = array_filter( $points->dist );
			$points->maxEle      = max( $_ele );
			$points->minEle      = min( $_ele );
			$points->totalLength = max( $_dist );
			$points->maxTime     = max( $_time );
			$points->minTime     = min( $_time );

			/* Calculating Average Speed */
			$_speed           = array_filter( $points->speed );
			if (count($_speed) > 0)
				$points->avgSpeed = array_sum( $_speed ) / count( $_speed );
			else
				$points->avgSpeed = null;

			/* Calculating Average Cadence */
			$_cad           = array_filter( $points->cad );
			if (count($_cad) > 0)
				$points->avgCad = (float) round( array_sum( $_cad ) / count( $_cad ), 0 );
			else
				$points->avgCad = null;

			/* Calculating Average Heart Rate */
			$_hr           = array_filter( $points->hr );
			if (count($_hr) > 0)
				$points->avgHr = (float) round( array_sum( $_hr ) / count( $_hr ), 0 );
			else
				$points->avgHr = null;

			/* Calculating Average Temperature */
			$_temp           = array_filter( $points->atemp );
			if (count($_temp) > 0)
				$points->avgTemp = (float) round( array_sum( $_temp ) / count( $_temp ), 1 );
			else
				$points->avgTemp = null;

		} catch ( Exception $e ) {
			print_r($e);
		}
	} else {

		/* GPX Garmin case */
		$gpx->registerXPathNamespace( 'gpxx', 'http://www.garmin.com/xmlschemas/GpxExtensions/v3' );

		$nodes = $gpx->xpath( '//gpxx:rpt' );

		if ( count( $nodes ) > 0 ) {

			$lastLat    = 0;
			$lastLon    = 0;
			$lastEle    = 0;
			$dist       = 0;
			$lastOffset = 0;

			/* GPX Garmin case */
			foreach ( $nodes as $rpt ) {

				$lat = $rpt['lat'];
				$lon = $rpt['lon'];
				if ( 0 == $lastLat && 0 == $lastLon ) {

					/* Base Case */
					array_push( $points->lat, (float) $lat );
					array_push( $points->lon, (float) $lon );
					array_push( $points->ele, 0 );
					array_push( $points->dist, 0 );
					array_push( $points->speed, 0 );
					array_push( $points->hr, 0 );
					array_push( $points->atemp, 0 );
					array_push( $points->cad, 0 );
					array_push( $points->grade, 0 );
					$lastLat = $lat;
					$lastLon = $lon;
				} else {

					/* Base Case */
					$offset = calculateDistance( $lat, $lon, 0, $lastLat, $lastLon, 0, $distancetype );
					$dist   = $dist + $offset;
					if ( ( (float) $offset + (float) $lastOffset ) > $gpxOffset ) {

						/* Bigger Offset -> write coordinate */
						$lastOffset = 0;
						array_push( $points->lat, (float) $lat );
						array_push( $points->lon, (float) $lon );
						array_push( $points->ele, 0 );
						array_push( $points->dist, 0 );
						array_push( $points->speed, 0 );
						array_push( $points->hr, 0 );
						array_push( $points->atemp, 0 );
						array_push( $points->cad, 0 );
						array_push( $points->grade, 0 );
					} else {

						/* Smoller Offset -> continue.. */
						$lastOffset = (float) $lastOffset + (float) $offset;
					}
				}
				$lastLat = $lat;
				$lastLon = $lon;
			}
			unset( $nodes );

		} else {

			/* GPX Strange case */
			$nodes = $gpx->xpath( '//rtept | //a:rtept | //b:rtept' );
			if ( count( $nodes ) > 0 ) {

				$lastLat    = 0;
				$lastLon    = 0;
				$lastEle    = 0;
				$dist       = 0;
				$lastOffset = 0;

				/* Garmin case */
				foreach ( $nodes as $rtept ) {

					$lat = $rtept['lat'];
					$lon = $rtept['lon'];
					if ( 0 == $lastLat && 0 == $lastLon ) {

						/* Base Case */
						array_push( $points->lat, (float) $lat );
						array_push( $points->lon, (float) $lon );
						array_push( $points->ele, 0 );
						array_push( $points->dist, 0 );
						array_push( $points->speed, 0 );
						array_push( $points->hr, 0 );
						array_push( $points->atemp, 0 );
						array_push( $points->cad, 0 );
						array_push( $points->grade, 0 );
						$lastLat = $lat;
						$lastLon = $lon;
					} else {

						/* Normal Case */
						$offset = calculateDistance( $lat, $lon, 0, $lastLat, $lastLon, 0, $distancetype );
						$dist   = $dist + $offset;
						if ( ( (float) $offset + (float) $lastOffset ) > $gpxOffset ) {

							/* Bigger Offset -> write coordinate */
							$lastOffset = 0;
							array_push( $points->lat, (float) $lat );
							array_push( $points->lon, (float) $lon );
							array_push( $points->ele, 0 );
							array_push( $points->dist, 0 );
							array_push( $points->speed, 0 );
							array_push( $points->hr, 0 );
							array_push( $points->atemp, 0 );
							array_push( $points->cad, 0 );
							array_push( $points->grade, 0 );
						} else {

							/* Smoller Offset -> continue.. */
							$lastOffset = (float) $lastOffset + (float) $offset;
						}
					}
					$lastLat = $lat;
					$lastLon = $lon;
				}
				unset( $nodes );
			}
		}
	}
	unset( $gpx );
	return $points;
}

function wpgpxmaps_getWayPoints( $gpxPath ) {
	$points = array();
	if ( file_exists( $gpxPath ) ) {
		try {
			$gpx = simplexml_load_file( $gpxPath );
		} catch ( Exception $e ) {
			echo _e( 'WP GPX Maps Error: Can&#8217;t parse xml file!', 'wp-gpx-maps' ) . ' ' . $gpxPath;
			return $points;
		}

			$gpx->registerXPathNamespace( 'a', 'http://www.topografix.com/GPX/1/0' );
			$gpx->registerXPathNamespace( 'b', 'http://www.topografix.com/GPX/1/1' );
			$nodes = $gpx->xpath( '//wpt | //a:wpt | //b:wpt' );
			global $wpdb;

		if ( count( $nodes ) > 0 ) {
			/* Normal case */
			foreach ( $nodes as $wpt ) {
				$lat  = $wpt['lat'];
				$lon  = $wpt['lon'];
				$ele  = (string) $wpt->ele;
				$time = (string) $wpt->time;
				$name = (string) $wpt->name;
				$desc = (string) $wpt->desc;
				$sym  = (string) $wpt->sym;
				$type = (string) $wpt->type;
				$img  = '';

				if ( $sym ) {
					$img_name = 'map-marker-' . $sym;
					$query    = "SELECT ID FROM {$wpdb->prefix}posts WHERE post_name LIKE '{$img_name}' AND post_type LIKE 'attachment'";
					$img_id   = $wpdb->get_var( $query );
					if ( ! is_null( $img_id ) ) {
						$img = wp_get_attachment_url( $img_id );
					}
				}

					array_push($points, array(
						'lat'  => (float) $lat,
						'lon'  => (float) $lon,
						'ele'  => (float) $ele,
						'time' => $time,
						'name' => $name,
						'desc' => $desc,
						'sym'  => $sym,
						'type' => $type,
						'img'  => $img,
					));
			}
		}
	}
	return $points;
}

function toRadians( $degrees ) {

		return (float) ( $degrees * 3.1415926535897932385 / 180 );
}

function calculateDistance( $lat1, $lon1, $ele1, $lat2, $lon2, $ele2, $distancetype ) {

		/* Distance typ: Climb */
	if ( '2' == $distancetype ) {
		return (float) $ele1 - (float) $ele2;

		/* Distance typ: Flat */
	} elseif ( '1' == $distancetype ) {
		$alpha = (float) sin( (float) toRadians( (float) $lat2 - (float) $lat1 ) / 2 );
		$beta  = (float) sin( (float) toRadians( (float) $lon2 - (float) $lon1 ) / 2 );
		/* Distance in meters */
		$a    = (float) ( (float) $alpha * (float) $alpha ) + (float) ( (float) cos( (float) toRadians( $lat1 ) ) * (float) cos( (float) toRadians( $lat2 ) ) * (float) $beta * (float) $beta );
		$dist = 2 * 6369628.75 * (float) atan2( (float) sqrt( (float) $a ), (float) sqrt( 1 - (float) $a ) );
		return (float) sqrt( (float) pow( (float) $dist, 2 ) + pow( (float) $lat1 - (float) $lat2, 2 ) );

		/* Distance typ: Normal */
	} else {
		$alpha = (float) sin( (float) toRadians( (float) $lat2 - (float) $lat1 ) / 2 );
		$beta  = (float) sin( (float) toRadians( (float) $lon2 - (float) $lon1 ) / 2 );
		/* Distance in meters */
		$a    = (float) ( (float) $alpha * (float) $alpha ) + (float) ( (float) cos( (float) toRadians( $lat1 ) ) * (float) cos( (float) toRadians( $lat2 ) ) * (float) $beta * (float) $beta );
		$dist = 2 * 6369628.75 * (float) atan2( (float) sqrt( (float) $a ), (float) sqrt( 1 - (float) $a ) );
		$d    = (float) sqrt( (float) pow( (float) $dist, 2 ) + pow( (float) $lat1 - (float) $lat2, 2 ) );
		return sqrt( (float) pow( (float) $ele1 - (float) $ele2, 2 ) + (float) pow( (float) $d, 2 ) );
	}
}

function my_date_diff( $old_date, $new_date ) {

	$t1 = strtotime( $new_date );
	$t2 = strtotime( $old_date );

	/* Fix for milliceconds */
	$t1 += date_getDecimals( $new_date );
	$t2 += date_getDecimals( $old_date );

	$offset = (float) ( $t1 - $t2 );

	return $offset;
}

function date_getDecimals( $date ) {

	if ( preg_match( '(\.([0-9]{2})Z?)', $date, $matches ) ) {
		return (float) ( (float) $matches[1] / 100 );
	} else {
		return 0;
	}
}
