<?php

if ( is_admin() ) {
	add_action( 'admin_init', 'wpgpxmaps_admin_init' );
	add_action( 'admin_menu', 'wpgpxmaps_admin_menu' );
}

function wpgpxmaps_admin_init() {

	wpgpxmaps_plugin_upgrade();

	if (!current_user_can( 'manage_options' ))
		return;	

	if ( get_site_option( 'wpgpxmaps_show_notice' ) == 1 ) {
		if ( is_multisite() ) {
			add_action( 'network_admin_notices', 'wpgpxmaps_show_update_notice' );
		} else {
			add_action( 'admin_notices', 'wpgpxmaps_show_update_notice' );
		}
		add_action( 'wp_ajax_wpgpxmaps_dismiss_notice', 'wpgpxmaps_dismiss_notice' );
	}

}

/**
 * Roles and capabilities
 *
 * Capabilities for each user role that are relevant to this plugin:
 *
 * Admin:       Can manage settings. Can show, upload and delete all GPX files.
 * Editor:      Can not manage settings. Can show, upload and delete all GPX files.
 * Author:      Can not manage settings. Can show, upload and delete his only own files.
 * Contributor: Do not have access to the plugin.
 * Subscriber:  Do not have access to the plugin.
 *
 * @see https://wordpress.org/support/article/roles-and-capabilities/
 */
function wpgpxmaps_admin_menu() {

	if ( current_user_can( 'manage_options' ) ) {

		/* Access only for Super Administrators and Administrators */
		add_options_page( 'WP GPX Maps', 'WP GPX Maps', 'manage_options', 'WP-GPX-Maps', 'wpgpxmaps_html_page' );

	} elseif ( current_user_can( 'publish_posts' ) ) {

		/* Access for Editors and Authors */
		if ( get_option( 'wpgpxmaps_allow_users_upload' ) == 1 ) {
			add_menu_page( 'WP GPX Maps', 'WP GPX Maps', 'publish_posts', 'WP-GPX-Maps', 'wpgpxmaps_html_page' );
		}
	}

}

/**
 * Wrapper for the option 'wpgpxmaps_version'
 */
function wpgpxmaps_get_installed_version() {

	return get_option( 'wpgpxmaps_version' );

}

/**
 * Wrapper for the defined constant WPGPXMAPS_CURRENT_VERSION
 */
function wpgpxmaps_get_current_version() {

	return WPGPXMAPS_CURRENT_VERSION;

}

/**
 * Plugin upgrade
 */
function wpgpxmaps_plugin_upgrade() {

	$installed_version = wpgpxmaps_get_installed_version();

	if ( wpgpxmaps_get_current_version() == $installed_version )
		return;

	delete_site_option( 'wpgpxmaps_version' );
	update_option( 'wpgpxmaps_version', wpgpxmaps_get_current_version() );

	delete_option( 'wpgpxmaps_show_notice', 0 );
	update_site_option( 'wpgpxmaps_show_notice', 1 );

}

/**
 * Show the update notice
 */
function wpgpxmaps_show_update_notice() {

	if ( ! current_user_can( 'manage_options' ) ) return;

	$class    = 'notice is-dismissible';
	$message  = '<strong>' .
		sprintf(
			/* translators: %1s: Plugin versions number */
			__( 'What&lsquo;s new in WP GPX Maps %1s', 'wp-gpx-maps' ),
			WPGPXMAPS_CURRENT_VERSION
		) .
		'</strong><br/><br/>';
	$message .= esc_html__( 'Added new map type Thunderforest - Outdoors (API Key required).', 'wp-gpx-maps' ) . '<br/>';
	$message .= esc_html__( 'Changed to the correct maps provider from &ldquo;Open Cycle Map&rdquo; to &ldquo;Thunderforest&rdquo; in Settins, Help and Output.', 'wp-gpx-maps' ) . '<br/>';
	$message .= esc_html__( 'New administration tab with the settings "Editor & Author upload" and "Show update notice".', 'wp-gpx-maps' ) . '<br/>';
	$message .= '<em><a href="https://wordpress.org/plugins/wp-gpx-maps/#developers" target="_blank" rel="noopener noreferrer">' . esc_html__( 'You can find the complete changelog here.', 'wp-gpx-maps' ) . '</a></em><br/><br/>';
	$message .= '<a id="wpgpxmaps-post-dismiss-notice" href="javascript:wpgpxmaps_dismiss_notice();">' . esc_html__( 'Dismiss this notice', 'wp-gpx-maps' ) . '</a>';

	echo '<div id="wpgpxmaps-notice" class="' . $class . '"><p>' . $message . '</p></div>';
	echo "<script>

			function wpgpxmaps_dismiss_notice() {
				var data = {
					'action': 'wpgpxmaps_dismiss_notice'
				};

				jQuery.post( ajaxurl, data, function( response ) {
					jQuery( '#wpgpxmaps-notice' ).hide();
				});
			}

			jQuery( document ).ready( function() {
				jQuery( 'body' ).on( 'click', '.notice-dismiss', function() {
					wpgpxmaps_dismiss_notice();
				});
			});

			</script>";

}

/**
 * Dismiss the update notice
 */
function wpgpxmaps_dismiss_notice() {
	
	if ( !current_user_can( 'manage_options' ) ) 
		return null;

	$result = update_site_option( 'wpgpxmaps_show_notice', 0 );
	return $result;
}

function wpgpxmaps_ilc_admin_tabs( $current ) {

	if ( current_user_can( 'manage_options' ) ) {
		/* Access for Super Administrators and Administrators */
		$tabs = array(
			'tracks'         => __( 'Tracks', 'wp-gpx-maps' ),
			'settings'       => __( 'Settings', 'wp-gpx-maps' ),
			'administration' => __( 'Administration', 'wp-gpx-maps' ),
			'help'           => __( 'Help', 'wp-gpx-maps' ),
		);

	} elseif ( current_user_can( 'publish_posts' ) ) {
		/* Access for Editors and Authors */
		$tabs = array(
			'tracks' => __( 'Tracks', 'wp-gpx-maps' ),
			'help'   => __( 'Help', 'wp-gpx-maps' ),
		);
	}

	echo '<h2 class="nav-tab-wrapper">';

	foreach ( $tabs as $tab => $name ) {
		$class = ( $tab == $current ) ? ' nav-tab-active' : '';
		echo "<a class='nav-tab$class' href='?page=WP-GPX-Maps&tab=$tab'>$name</a>";
	}

	echo '</h2>';
}

function wpgpxmaps_html_page() {

	$realGpxPath          = gpxFolderPath();
	$cacheGpxPath         = gpxCacheFolderPath();
	$relativeGpxPath      = relativeGpxFolderPath();
	$relativeGpxPath      = str_replace( '\\', '/', $relativeGpxPath );
	$relativeGpxCachePath = relativeGpxCacheFolderPath();
	$relativeGpxCachePath = str_replace( '\\', '/', $relativeGpxCachePath );
	if (array_key_exists('tab', $_GET)){
		$tab = $_GET['tab'];
	}else{
		$tab = 'tracks';
	}

	?>

<div class="wrap">

	<div id="icon-themes" class="icon32"> </div>

	<h1 class="header-title">

		<?php
		printf(
			/* translators: %1s: Plugin versions number */
			__( 'WP GPX Maps %1s', 'wp-gpx-maps' ),
			WPGPXMAPS_CURRENT_VERSION
		);
		?>

	</h1>

	<!-- The First Div (for body) ends in the respective file for the corresponding tab -->

	<?php

	if ( file_exists( $realGpxPath ) && is_dir( $realGpxPath ) ) {

		/* Directory exist! */

	} else {
		if ( ! @mkdir( $realGpxPath, 0755, true ) ) {
			echo '<div class=" notice notice-error"><p>';
			printf(
				/* translators: %1s: Relative path of the GPX folder */
				esc_html__( 'Can&lsquo;t create the folder %1s for GPX files. Please create the folder and make it writable! If not, you will must update the files manually!', 'wp-gpx-maps' ),
				'<span class="code"><strong>' . esc_html( $relativeGpxPath ) . '</strong></span>'
			);
			echo '</p></div>';
		}
	}
	if ( file_exists( $cacheGpxPath ) && is_dir( $cacheGpxPath ) ) {

		/* Directory exist! */

	} else {
		if ( ! @mkdir( $cacheGpxPath, 0755, true ) ) {
			echo '<div class=" notice notice-error"><p>';
			printf(
				/* translators: %1s: Relative path of the GPX cache folder */
				esc_html__( 'Can&lsquo;t create the cache folder %1s for the GPX files. Please create the folder and make it writable! If not, you will must update the files manually!', 'wp-gpx-maps' ),
				'<span class="code"><strong>' . esc_html( $relativeGpxCachePath ) . '</strong></span>'
			);
			echo '</p></div>';
		}
	}

	wpgpxmaps_ilc_admin_tabs( $tab );

	if ( 'tracks' == $tab ) {
		include 'wp-gpx-maps-admin-tracks.php';

	} elseif ( 'settings' == $tab ) {
		include 'wp-gpx-maps-admin-settings.php';

	} elseif ( 'administration' == $tab ) {
		include 'wp-gpx-maps-admin-administration.php';

	} elseif ( 'help' == $tab ) {
		include 'wp-gpx-maps-help.php';
	}

}

?>