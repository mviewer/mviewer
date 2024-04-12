<?php

function wpgpxmaps_isNGGalleryActive() {

	if ( ! function_exists( 'is_plugin_active' ) ) {
		require_once( wp_gpx_maps_sitePath() . '/wp-admin/includes/plugin.php' );
	}
	return is_plugin_active( 'nextgen-gallery/nggallery.php' );
}

function wpgpxmaps_isNGGalleryProActive() {

	if ( ! function_exists( 'is_plugin_active' ) ) {
		require_once( wp_gpx_maps_sitePath() . '/wp-admin/includes/plugin.php' );
	}
		return is_plugin_active( 'nextgen-gallery-pro/nggallery-pro.php' );
}

function getNGGalleryImages( $ngGalleries, $ngImages, $dt, $lat, $lon, $dtoffset, &$error ) {

	$result = array();
	$galids = explode( ',', $ngGalleries );
	$imgids = explode( ',', $ngImages );

	if ( ! wpgpxmaps_isNGGalleryActive() )
	return '';
	try {
		$pictures = array();
		foreach ( $galids as $g ) {
			$pictures = array_merge( $pictures, nggdb::get_gallery( $g ) );
		}
		foreach ( $imgids as $i ) {
			array_push( $pictures, nggdb::find_image( $i ) );
		}

		foreach ( $pictures as $p ) {
			
			if (!is_object($p))
				continue;				
			
			try {
		
				$item         = array();
				$item['data'] = $p->thumbHTML;
				if ( is_callable( 'exif_read_data' ) ) {
					
					$imagePath = $p->__get("imagePath");
					
					$exif = @exif_read_data( $imagePath );
					if ( $exif !== false && is_array($exif) && sizeof($exif) > 0 ) {
						//print_r($exif);
						
						$GPSLongitude = 0;
						$GPSLatitude = 0;
						$GPSLongitudeRef ='';
						$GPSLatitudeRef ='';
						
						if (array_key_exists('GPSLongitude', $exif))
							$GPSLongitude = $exif['GPSLongitude'];
						
						if (array_key_exists('GPSLatitude', $exif))
							$GPSLatitude = $exif['GPSLatitude'];
						
						if (array_key_exists('GPSLongitudeRef', $exif))
							$GPSLongitudeRef = $exif['GPSLongitudeRef'];
						
						if (array_key_exists('GPSLatitudeRef', $exif))
							$GPSLatitudeRef = $exif['GPSLatitudeRef'];
						
						$item['lon'] = getExifGps( $GPSLongitude, $GPSLongitudeRef );
						$item['lat'] = getExifGps( $GPSLatitude, $GPSLatitudeRef );									
						if ( ( $item['lat'] != 0 ) || ( $item['lon'] != 0 ) ) {
							$result[] = $item;
						} elseif ( isset( $p->imagedate ) ) {
							$_dt   = strtotime( $p->imagedate ) + $dtoffset;
							$_item = findItemCoordinate( $_dt, $dt, $lat, $lon );
							if ( $_item != null ) {
								$item['lat'] = $_item['lat'];
								$item['lon'] = $_item['lon'];
								$result[]    = $item;
							}
						}
					}
				} else {
					$error .= "Sorry, <a href='https://php.net/manual/en/function.exif-read-data.php' target='_blank' rel='noopener noreferrer'>exif_read_data</a> function not found! check your hosting.<br />";
				}	
		
			} catch (Exception $e) {
				//$error .= "Sorry, <a href='https://php.net/manual/en/function.exif-read-data.php' target='_blank' rel='noopener noreferrer'>exif_read_data</a> function not found! check your hosting.<br />";
			}
			

		}
		/* START FIX NEXT GEN GALLERY 2.x */
		if ( class_exists( 'C_Component_Registry' ) ) {
			$renderer                  = C_Component_Registry::get_instance()->get_utility( 'I_Displayed_Gallery_Renderer' );
			$params['gallery_ids']     = $ngGalleries;
			$params['image_ids']       = $ngImages;
			$params['display_type']    = NEXTGEN_GALLERY_BASIC_THUMBNAILS;
			$params['images_per_page'] = 999;
			/* Salso add js references to get the gallery working */
			$dummy = $renderer->display_images( $params );

			/* START FIX NEXT GEN GALLERY PRO */

			if ( preg_match( "/(data-nplmodal-gallery-id|data-thumbnail)=[\"'](.*?)[\"']/", $dummy, $m ) ) {
				$galid = $m[2];
				if ( $galid ) {
					for ( $i = 0; $i < count( $result ); ++$i ) {
						$result[$i]['data'] = str_replace( '%PRO_LIGHTBOX_GALLERY_ID%', $galid, $result[$i]['data'] );
					}
				}
			}
			/* END FIX NEXT GEN GALLERY PRO */
		}
		/* END FIX NEXT GEN GALLERY 2.x */

	} catch ( Exception $e ) {
		$error .= 'Error When Retrieving NextGen Gallery galleries/images: $e <br />';
	}	
	return $result;
}

// $imgdt : image date
// $dt : all gpx datetime
// $lat : all gpx latitude
// $lon : all gpx longitude
function findItemCoordinate( $imgdt, $dt, $lat, $lon ) {
	$prevdt = 0;
	foreach ( array_keys( $dt ) as $i ) {
		if ( $i != 0 && $imgdt >= $prevdt && $imgdt <= $dt[$i] ) {
			if ( $lat[$i] != 0 && $lon[$i] != 0 )
			return array(
				'lat' => $lat[$i],
				'lon' => $lon[$i],
			);		
		}
		$prevdt = $dt[$i];
	}
	return null;
}

function getExifGps( $exifCoord, $hemi ) {
	$degrees = is_array($exifCoord) && sizeof( $exifCoord ) > 0 ? gps2Num( $exifCoord[0] ) : 0;
	$minutes = is_array($exifCoord) && sizeof( $exifCoord ) > 1 ? gps2Num( $exifCoord[1] ) : 0;
	$seconds = is_array($exifCoord) && sizeof( $exifCoord ) > 2 ? gps2Num( $exifCoord[2] ) : 0;
	$flip    = ( 'W' == $hemi or 'S' == $hemi ) ? -1 : 1;

	return $flip * ( $degrees + $minutes / 60 + $seconds / 3600 );
}

function gps2Num( $coordPart ) {

	$parts = explode( '/', $coordPart );

	if ( count( $parts ) <= 0 )
		return 0;

	if ( count( $parts ) == 1 )
		return $parts[0];

	$lat = floatval( $parts[0] );
	$lon = floatval( $parts[1] );

	if ( 0 == $lon )
		return $lat;
	
	return $lat / $lon;
}
