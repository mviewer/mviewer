<?php
/**
 * Tracks Tab
 *
 * Content for Tab Tracks and Cache.
 *
 * @package WP GPX Maps
 */

if ( ! ( is_admin() ) )
	return;

$is_admin = current_user_can( 'publish_posts' );

if ( $is_admin != 1 )
	return;

$wpgpxmapsUrl = get_admin_url() . 'admin.php?page=WP-GPX-Maps';
$gpxRegEx     = '/.gpx$/i';

if ( current_user_can( 'manage_options' ) ) {

	$menu_root = 'options-general.php';

} elseif ( current_user_can( 'publish_posts' ) ) {

	$menu_root = 'admin.php';

}

/**
 * Override the default upload path.
 * 
 * @param   array   $dir
 * @return  array
 */
function wpgpxmaps_181088_upload_dir( $dir ) {

    return array(
        'path'   => $dir['basedir'] . '/gpx',
        'url'    => $dir['baseurl'] . '/gpx',
        'subdir' => '/gpx',
    ) + $dir;
}


function wpgpxmaps_move_uploaded_file($uploadedfile)
{
	
	// Register our path override.
	add_filter( 'upload_dir', 'wpgpxmaps_181088_upload_dir' );

	$upload_overrides = array( 'test_form' => false, 'test_type' => false );

	// Do our thing. WordPress will move the file to 'uploads/gpx'.
	$result = wp_handle_upload( $uploadedfile , $upload_overrides);

	// Set everything back to normal.
	remove_filter( 'upload_dir', 'wpgpxmaps_181088_upload_dir' );
	
	if ( $result && isset( $result['error'] ))
	{
		echo "<div class='notice notice-error'><p>". esc_html( $result['error'] )."</p></div>";
	}
	
	return ( $result && !isset( $result['error'] ));
	
}


/* The First Div (for body) starts in wp-gpx-admin.php */

if ( isset( $_POST['clearcache'] ) ) {

	if ( isset( $_GET['_wpnonce'] ) && wp_verify_nonce( $_GET['_wpnonce'], 'wpgpx_clearcache_nonce' . $entry ) ) {

		echo '<div class="notice notice-success"><p>';
		esc_html_e( 'Cache is now empty!', 'wp-gpx-maps' );
		echo '</p></div>';
		wpgpxmaps_recursive_remove_directory( $cacheGpxPath, true );

	}
}

if ( is_writable( $realGpxPath ) ) {
	?>

	<div class="tablenav-top">

		<?php
		echo '<form enctype="multipart/form-data" method="POST" style="float:left; margin:5px 20px 0 0" action="' . get_bloginfo( 'wpurl' ) . '/wp-admin/' . $menu_root . '?page=WP-GPX-Maps">';
		?>
		<?php esc_html_e( 'Choose a file to upload:', 'wp-gpx-maps' ); ?> <input name="uploadedfile[]" type="file" onchange="submitgpx(this);" multiple />
		<?php
		if ( isset( $_FILES['uploadedfile'] ) ) {

			$files = $_FILES['uploadedfile'];

			$total = count( $files['name'] );
			for ( $i = 0; $i < $total; $i++ ) {

				$file = array(
				  'name'     => $files['name'][$i],
				  'type'     => $files['type'][$i],
				  'tmp_name' => $files['tmp_name'][$i],
				  'error'    => $files['error'][$i],
				  'size'     => $files['size'][$i]
				);
					
				$uploadingFileName = basename( $file['name'] );
				if ( preg_match( $gpxRegEx, $uploadingFileName ) ) {

					if ( wpgpxmaps_move_uploaded_file( $file ) ) {

						echo '<div class="notice notice-success"><p>';
						printf(
							/* translators: %1s: GPX file name */
							esc_html__( 'The file %1s has been successfully uploaded.', 'wp-gpx-maps' ),
							'<span class="code"><strong>' . esc_html( $uploadingFileName ) . '</strong></span>'
						);
						echo '</p></div>';

					} else {

						echo '<div class=" notice notice-error"><p>';
						esc_html_e( 'There was an error uploading the file, please try again!', 'wp-gpx-maps' );
						echo '</p></div>';

					}
				} else {

					echo '<div class="notice notice-warning"><p>';
					esc_html_e( 'The file type is not supported!', 'wp-gpx-maps' );
					echo '</p></div>';

				}
			}
		}

		?>
		</form>

		<form method="POST" style="float:left; margin:5px 20px 0 0" action="<?php echo $wpgpxmapsUrl; ?>&_wpnonce=<?php echo wp_create_nonce( 'wpgpx_clearcache_nonce' ); ?>" >
			<input type="submit" name="clearcache" value="<?php esc_html_e( 'Clear Cache', 'wp-gpx-maps' ); ?>" />
		</form>

	</div>

	<?php

} else {
	?>
	<br />

		<?php

		echo '<div class=" notice notice-error"><p>';
		printf(
			/* translators: %1s: Relative path of the GPX folder */
			esc_html__( 'Your folder for GPX files %1s is not writable. Please change the folder permissions.', 'wp-gpx-maps' ),
			'<span class="code"><strong>' . esc_html( $relativeGpxPath ) . '</strong></span>'
		);
		echo '</p></div>';

		?>

		<br />

		<?php
}

$myGpxFileNames = array();
if ( is_readable( $realGpxPath ) && $handle = opendir( $realGpxPath ) ) {
	while ( false !== ( $entry = readdir( $handle ) ) ) {
		if ( preg_match( $gpxRegEx, $entry ) ) {
			if ( isset( $_GET['_wpnonce'] ) && wp_verify_nonce( $_GET['_wpnonce'], 'wpgpx_deletefile_nonce_' . $entry ) ) {
				if ( file_exists( $realGpxPath . '/' . $entry ) ) {
					unlink( $realGpxPath . '/' . $entry );

					echo '<div class="notice notice-success"><p>';
					printf(
						/* translators: %1s: GPX file name */
						esc_html__( 'The file %1s has been successfully deleted.', 'wp-gpx-maps' ),
						'<span class="code"><strong>' . esc_html( $entry ) . '</strong></span>'
					);
					echo '</p></div>';

				} else {

					echo '<div class=" notice notice-error"><p>';
					printf(
						/* translators: %1s: GPX file name */
						esc_html__( 'The file %1s could not be deleted.', 'wp-gpx-maps' ),
						'<span class="code"><strong>' . esc_html( $entry ) . '</strong></span>'
					);
					echo '</p></div>';

				}
			} else {

				$myFile           = $realGpxPath . '/' . $entry;
				$myGpxFileNames[] = array(
					'name'     => $entry,
					'size'     => filesize( $myFile ),
					'lastedit' => filemtime( $myFile ),
					'nonce'    => wp_create_nonce( 'wpgpx_deletefile_nonce_' . $entry ),
				);
			}
		}
	}
	closedir( $handle );
}

if ( is_readable( $realGpxPath ) && $handle = opendir( $realGpxPath ) ) {
	while ( false !== ( $entry = readdir( $handle ) ) ) {
		if ( preg_match( $gpxRegEx, $entry ) ) {
			$filenames[] = $realGpxPath . '/' . $entry;
		}
	}
	closedir( $handle );
}

?>

	<table id="table" class="wp-list-table widefat plugins"></table>

	<script type="text/javascript">

		function submitgpx(el){
			var newEl = document.createElement('span');
			newEl.innerHTML = '<?php esc_html_e( 'Uploading file...', 'wp-gpx-maps' ); ?>';
			el.parentNode.insertBefore(newEl,el.nextSibling);
			el.parentNode.submit()
		}

		jQuery('#table').bootstrapTable({
			columns: [{
				field: 'name',
				title: '<?php _e( 'File', 'wp-gpx-maps' ); ?>',
				sortable: true,
				formatter: function(value, row, index) {

					return [
						'<b>' + row.name + '</b><br />',
						'<a class="delete_gpx_row" href="<?php echo $wpgpxmapsUrl; ?>&_wpnonce=' + row.nonce + '" ><?php esc_html_e( 'Delete', 'wp-gpx-maps' ); ?></a>',
						' | ',
						'<a href="<?php echo $relativeGpxPath; ?>' + row.name + '"><?php esc_html_e( 'Download', 'wp-gpx-maps' ); ?></a>',
						' | ',
						'<a href="#" class="copy-shortcode" title="<?php esc_html_e( 'Copy shortcode', 'wp-gpx-maps' ); ?>"><?php esc_html_e( 'Shortcode:', 'wp-gpx-maps' ); ?></a> <span class="code"> [sgpx gpx="<?php echo $relativeGpxPath; ?>' + row.name + '"]</span>',
					].join('')

				}
			}, {
				field: 'lastedit',
				title: '<?php esc_html_e( 'Last modified', 'wp-gpx-maps' ); ?>',
				sortable: true,
				formatter: function(value, row, index) {
					var d = new Date(value*1000);
					return d.toLocaleDateString() + " " + d.toLocaleTimeString();
				}
			}, {
				field: 'size',
				title: '<?php esc_html_e( 'File size', 'wp-gpx-maps' ); ?>',
				sortable: true,
				formatter: function(value, row, index) { return humanFileSize(value); }
			}],
			sortName : 'lastedit',
			sortOrder : 'desc',
			data: <?php echo wp_json_encode( $myGpxFileNames ); ?>
		});

		jQuery('.delete_gpx_row').click(function(){
			return confirm("<?php esc_html_e( 'Are you sure you want to delete the file?', 'wp-gpx-maps' ); ?>");
		})

		jQuery('.copy-shortcode').click(function(e){
				var $temp = jQuery("<input>");
				jQuery("body").append($temp);
				var shortcode = jQuery(this).next().text().trim();
				$temp.val(shortcode).select();
				document.execCommand("copy");
				$temp.remove();
				e.preventDefault();
		})

		function humanFileSize(bytes, si) {
			var thresh = si ? 1000 : 1024;
			if(Math.abs(bytes) < thresh) {
				return bytes + ' B';
			}
			var units = si
				? ['kB','MB','GB','TB','PB','EB','ZB','YB']
				: ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
			var u = -1;
			do {
				bytes /= thresh;
				++u;
				} while(Math.abs(bytes) >= thresh && u < units.length - 1);
			return bytes.toFixed(1)+' '+units[u];
		};

	</script>

</div>
