<?php
/**
 * Help Tab
 *
 * Content for Tab Help and Shortcodes.
 *
 * @package WP GPX Maps
 */

?>

<!-- The First Div (for body) starts in wp-gpx-admin.php -->

	<div class="wpgpxmaps-container-tab-faq">

		<div class="wpgpxmaps-tab-faq">

			<h3 class="title"><?php esc_html_e( 'FAQ', 'wp-gpx-maps' ); ?></h3>

			<p>
				<strong>
					<?php esc_html_e( 'How can I upload the GPX files?', 'wp-gpx-maps' ); ?>
				</strong>
			</p>
				<p>
					&nbsp;
					<?php esc_html_e( '1. Method: Upload the GPX file using the uploader in the tab "Tracks".', 'wp-gpx-maps' ); ?>
				</p>
				<p>
					&nbsp;
					<?php
					esc_html_e( '2. Method: Upload the GPX file via FTP to your upload folder:', 'wp-gpx-maps' );
					echo ' ';
					?>
					<code><strong> <?php echo $relativeGpxPath; ?> </strong></code>
				</p>
			<p>
				<strong>
					<?php esc_html_e( 'How can I use the GPX files?', 'wp-gpx-maps' ); ?>
				</strong>
			</p>
				<p>
					&nbsp;
					<?php esc_html_e( 'Go to the tab "Tracks" and copy the shortcode from the list and paste it in the page or post.', 'wp-gpx-maps' ); ?>
				</p>
				<p>
					&nbsp;
					<?php
					esc_html_e( 'You can manually set the relative path to your GPX file. Please use this scheme:', 'wp-gpx-maps' );
					echo ' ';
					?>
					<code><strong>[sgpx gpx="<?php echo $relativeGpxPath; ?>yourgpxfile.gpx"]</strong></code>
				</p>
			<p>
				<strong>
					<?php esc_html_e( 'Can I also integrate GPX files from other sites?', 'wp-gpx-maps' ); ?>
				</strong>
			</p>
				<p>
					&nbsp;
					<?php
					esc_html_e( 'Yes, it&#8217s possible. Please use this scheme:', 'wp-gpx-maps' );
					echo ' ';
					?>
					<code><strong>[sgpx gpx="http://www.someone.com/somewhere/somefile.gpx"]</strong></code>
				</p>
			<p>
				<strong>
					<?php esc_html_e( 'Can I change the attributes for each GPX shortcode?', 'wp-gpx-maps' ); ?>
				</strong>
			</p>
				<p>
					&nbsp;
					<?php esc_html_e( 'Yes, it&#8217s possible. These changes ignore the default settings for each attribute.', 'wp-gpx-maps' ); ?>
				</p>
				<p>
					&nbsp;
					<?php
					esc_html_e( 'The Full set of optional attributes can be found below. Please use this scheme:', 'wp-gpx-maps' );
					echo ' ';
					?>
					<code><strong>[sgpx gpx="<?php echo $relativeGpxPath; ?>yourgpxfile.gpx &lt; <?php esc_html_e( 'read below all the optional attributes', 'wp-gpx-maps' ); ?> &gt;"]</strong></code>
				</p>
				<strong>
					<?php esc_html_e( 'Note: If no value is displayed in the "Current value" column, the value is "false".', 'wp-gpx-maps' ); ?>
				</strong>

		</div>

		<table class="widefat">
			<thead>
				<tr>
					<th class="title" colspan="4">
						<?php esc_html_e( 'General', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
				<tr>
					<th scope="col">
						<?php esc_html_e( 'Shortcode', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Description', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Possible values', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Current value', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
				</thead>
			<tbody>
				<tr>
					<td>gpx</td>
					<td>
						<?php esc_html_e( 'relative path to the GPX file', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<code><strong>gpx="/wp-upload dir/gpx/yourgpxfile.gpx"</strong></code>
					</td>
					<td>
						<code><strong>gpx="<?php echo $relativeGpxPath; ?>yourgpxfile.gpx"</strong></code>
					</td>
				</tr>
				<tr>
					<td>width</td>
					<td>
						<?php esc_html_e( 'Map width', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php esc_html_e( 'Value in percent', 'wp-gpx-maps' ); ?>
						<br />
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>100%</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_width' )); ?>
					</td>
				</tr>
				<tr>
					<td>mheight</td>
					<td>
						<?php esc_html_e( 'Map height', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php esc_html_e( 'Value in pixels', 'wp-gpx-maps' ); ?>
						<br />
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>450px</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_height' )); ?>
					</td>
				</tr>
				<tr>
					<td>gheight</td>
					<td>
						<?php esc_html_e( 'Graph height', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php esc_html_e( 'Value in pixels', 'wp-gpx-maps' ); ?>
						<br />
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>200px</strong>
					</td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_graph_height' )); ?>
					</td>
				</tr>
				<tr>
					<td>download</td>
					<td>
						<?php esc_html_e( 'Allow users to download your GPX file', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_download' )); ?>
					</td>
				</tr>
				<tr>
					<td>skipcache</td>
					<td>
						<?php esc_html_e( 'Do not use cache. If TRUE might be very slow', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_skipcache' )); ?>
					</td>
				</tr>
				</tbody>
		</table>

		<br />

		<table class="widefat">
			<thead>
				<tr>
					<th class="title" colspan="4">
						<?php esc_html_e( 'Map', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
				<tr>
					<th scope="col">
						<?php esc_html_e( 'Shortcode', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Description', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Possible values', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Current value', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>mtype</td>
					<td>
						<?php esc_html_e( 'Map type', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						/* translators: selection = map provider / map type */
						esc_html_e( 'OSM1 = Open Street Map', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = map provider / map type */
						esc_html_e( 'OSM2 = Thunderforest - Open Cycle Map (API Key required)', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = map provider / map type */
						esc_html_e( 'OSM3 = Thunderforest - Outdoors (API Key required)', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = map provider / map type */
						esc_html_e( 'OSM4 = Thunderforest - Transport (API Key required)', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = map provider / map type */
						esc_html_e( 'OSM5 = Thunderforest - Landscape (API Key required)', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = map provider / map type */
						//esc_html_e( 'OSM6 = MapToolKit - Terrain', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = map provider / map type */
						esc_html_e( 'OSM7 = Open Street Map - Humanitarian map style', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = map provider / map type */
						esc_html_e( 'OSM9 = Hike & Bike', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = map provider / map type */
						esc_html_e( 'OSM10 = Open Sea Map', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>OSM1</strong>
					</td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_map_type' )); ?>
					</td>
				</tr>
				<tr>
					<td>mlinecolor</td>
					<td>
						<?php esc_html_e( 'Map line color', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>#3366cc</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_map_line_color' )); ?>
					</td>
				</tr>
				<tr>
					<td>zoomonscrollwheel</td>
					<td>
						<?php esc_html_e( 'Zoom on map when mouse scroll wheel', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_zoomonscrollwheel' )); ?>
					</td>
				</tr>
				<tr>
					<td>waypoints</td>
					<td>
						<?php esc_html_e( 'Print the GPX waypoints inside the map', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_show_waypoint' )); ?>
					</td>
				</tr>
				<tr>
					<td>startIcon</td>
					<td>
						<?php esc_html_e( 'Start track icon', 'wp-gpx-maps' ); ?>
					</td>
					<td></td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_map_start_icon' )); ?>
					</td>
				</tr>
				<tr>
					<td>endIcon</td>
					<td>
						<?php esc_html_e( 'End track icon', 'wp-gpx-maps' ); ?>
					</td>
					<td></td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_map_end_icon' )); ?>
					</td>
				</tr>
				<tr>
					<td>currentIcon</td>
					<td>
						<?php esc_html_e( 'Current position icon (when mouse hover)', 'wp-gpx-maps' ); ?>
					</td>
					<td></td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_map_current_icon' )); ?>
					</td>
				</tr>
				<tr>
					<td>waypointicon</td>
					<td>
						<?php esc_html_e( 'Custom waypoint icon', 'wp-gpx-maps' ); ?>
					</td>
					<td></td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_map_waypoint_icon' )); ?>
					</td>
				</tr>
			</tbody>
		</table>

		<br />

		<table class="widefat">
			<thead>
				<tr>
					<th class="title" colspan="4">
						<?php esc_html_e( 'Diagram', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
				<tr>
					<th scope="col">
						<?php esc_html_e( 'Shortcode', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Description', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Possible values', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Current value', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>showele</td>
					<td>
						<?php esc_html_e( 'Show elevation data inside the chart', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>true</strong>
					</td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_show_elevation' )); ?>
					</td>
				</tr>
				<tr>
					<td>glinecolor</td>
					<td>
						<?php esc_html_e( 'Altitude line color', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>#3366cc</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_graph_line_color' )); ?>
					</td>
				</tr>
				<tr>
					<td>uom</td>
					<td>
						<?php esc_html_e( 'Distance / Altitude unit of measure', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						/* translators: selection = chart axis labels */
						esc_html_e( '0 = meters / meters', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = chart axis labels */
						esc_html_e( '1 = feet / miles', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = chart axis labels */
						esc_html_e( '2 = meters / kilometers', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = chart axis labels */
						esc_html_e( '3 = meters / nautical miles', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = chart axis labels */
						esc_html_e( '4 = meters / miles', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = chart axis labels */
						esc_html_e( '5 = feet / nautical miles', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>0</strong>
					</td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_unit_of_measure' )); ?>
					</td>
				</tr>
				<tr>
					<td>chartFrom1</td>
					<td>
						<?php esc_html_e( 'Minimum value for altitude chart', 'wp-gpx-maps' ); ?>
					</td>
					<td></td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_graph_offset_from1' )); ?>
					</td>
				</tr>
				<tr>
					<td>chartTo1</td>
					<td>
						<?php esc_html_e( 'Maximum value for altitude chart', 'wp-gpx-maps' ); ?>
					</td>
					<td></td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_graph_offset_to1' )); ?>
					</td>
				</tr>
				<tr>
					<td>showspeed</td>
					<td>
						<?php esc_html_e( 'Show speed inside the chart', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_show_speed' )); ?>
					</td>
				</tr>
				<tr>
					<td>glinecolorspeed</td>
					<td>
						<?php esc_html_e( 'Speed line color', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>#ff0000</strong>
					</td>
					<td>
						<?php echo esc_html( get_option( 'wpgpxmaps_graph_line_color_speed' )); ?>
					</td>
				</tr>
				<tr>
				<td>uomspeed</td>
					<td>
						<?php esc_html_e( 'Speed unit of measure', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						/* translators: selection = speed unit of measure */
						esc_html( '0 = m/s', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = speed unit of measure */
						esc_html_e( '1 = km/h', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = speed unit of measure */
						esc_html_e( '2 = miles/h', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = speed unit of measure */
						esc_html_e( '3 = min/km', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = speed unit of measure */
						esc_html( '4 = min/miles', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = speed unit of measure */
						esc_html_e( '5 = Knots (nautical miles / hour)', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						/* translators: selection = speed unit of measure */
						esc_html_e( '6 = min/100 meters', 'wp-gpx-maps' );
						?>
						<br />
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>0</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_unit_of_measure_speed' )); ?>
					</td>
				</tr>
				<tr>
					<td>chartFrom2</td>
					<td>
						<?php esc_html( 'Minimum value for speed chart', 'wp-gpx-maps' ); ?>
					</td>
					<td></td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_graph_offset_from2' )); ?>
					</td>
				</tr>
				<tr>
					<td>chartTo2</td>
					<td>
						<?php esc_html_e( 'Maximum value for speed chart', 'wp-gpx-maps' ); ?>
					</td>
					<td></td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_graph_offset_to2' )); ?>
					</td>
				</tr>
				<tr>
					<td>showhr</td>
					<td>
						<?php esc_html_e( 'Show heart rate inside the chart', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_show_hr' )); ?>
					</td>
				</tr>
				<tr>
					<td>glinecolorhr</td>
					<td>
						<?php esc_html_e( 'Heart rate line color', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>#ff77bd</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_graph_line_color_hr' )); ?>
					</td>
				</tr>
				<td>showatemp</td>
					<td>
						<?php esc_html_e( 'Show temperature inside the chart', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_show_atemp' )); ?>
					</td>
				</tr>
				<tr>
					<td>glinecoloratemp</td>
					<td>
						<?php esc_html_e( 'Temperature line color', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>#ff77bd</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_graph_line_color_atemp' )); ?>
					</td>
				</tr>
				<tr>
					<td>showcad</td>
					<td>
						<?php esc_html_e( 'Show cadence inside the chart', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_show_cadence' )); ?>
					</td>
				</tr>
				<tr>
					<td>glinecolorcad</td>
					<td>
						<?php esc_html_e( 'Cadence line color', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>#beecff</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_graph_line_color_cad' )); ?>
					</td>
				</tr>
				<tr>
					<td>showgrade</td>
					<td>
						<?php esc_html_e( 'Show grade inside the chart', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_show_grade' )); ?>
					</td>
				</tr>
				<tr>
					<td>glinecolorgrade</td>
					<td>
						<?php esc_html_e( 'Grade line color', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>#beecff</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_graph_line_color_grade' )); ?>
					</td>
				</tr>
			</tbody>
		</table>

		<br />

		<table class="widefat">
			<thead>
				<tr>
					<th class="title" colspan="4">
						<?php esc_html_e( 'Pictures', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
				<tr>
					<th scope="col">
						<?php esc_html_e( 'Shortcode', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Description', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Possible values', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Current value', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>nggalleries</td>
					<td>
						<?php esc_html_e( 'NextGen Gallery', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php esc_html_e( 'Gallery ID or a list of Galleries ID separated by a comma', 'wp-gpx-maps' ); ?>
					</td>
				</tr>
				<tr>
					<td>ngimages</td>
					<td>
						<?php esc_html_e( 'NextGen Image', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php esc_html_e( 'Image ID or a list of Images ID separated by a comma', 'wp-gpx-maps' ); ?>
					</td>
				</tr>
				<tr>
					<td>attachments</td>
					<td>
						<?php esc_html_e( 'Show all images that are attached to post', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_map_attachments' )); ?>
					</td>
				</tr>
				<tr>
					<td>dtoffset</td>
					<td>
						<?php esc_html_e( 'The difference between your GPX tool date and your camera date', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php esc_html_e( 'Value in seconds', 'wp-gpx-maps' ); ?>
					</td>
				</tr>
			</tbody>
		</table>

		<br />

		<table class="widefat">
			<thead>
				<tr>
					<th class="title" colspan="4">
						<?php esc_html_e( 'Summary table', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
				<tr>
					<th scope="col">
						<?php esc_html_e( 'Shortcode', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Description', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Possible values', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Current value', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>summary</td>
					<td>
						<?php esc_html_e( 'Print summary details of your GPX track', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary' )); ?>
					</td>
				</tr>
				<tr>
					<td>summarytotlen</td>
					<td>
						<?php esc_html_e( 'Print total distance in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_tot_len' )); ?>
					</td>
				</tr>
				<tr>
					<td>summarymaxele</td>
					<td>
						<?php esc_html_e( 'Print max. elevation in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_max_ele' )); ?>
					</td>
				</tr>
				<tr>
					<td>summaryminele</td>
					<td>
						<?php esc_html_e( 'Print min. elevation in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_min_ele' )); ?>
					</td>
				</tr>
				<tr>
					<td>summaryeleup</td>
					<td>
						<?php esc_html_e( 'Print total climbing in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_total_ele_up' )); ?>
					</td>
				</tr>
				<tr>
					<td>summaryeledown</td>
					<td>
						<?php esc_html_e( 'Print total descent in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_total_ele_down' )); ?>
					</td>
				</tr>
				<tr>
					<td>summaryavgspeed</td>
					<td>
						<?php esc_html_e( 'Print average speed in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_avg_speed' )); ?>
					</td>
				</tr>
				<tr>
					<td>summaryavgcad</td>
					<td>
						<?php esc_html_e( 'Print average cadence in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_avg_cad' )); ?>
					</td>
				</tr>
				<tr>
					<td>summaryavghr</td>
					<td>
						<?php esc_html_e( 'Print average heart rate in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_avg_hr' )); ?>
					</td>
				</tr>
				<tr>
					<td>summaryavgtemp</td>
					<td>
						<?php esc_html_e( 'Print average temperature in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_avg_temp' )); ?>
					</td>
				</tr>
				<tr>
					<td>summarytotaltime</td>
					<td>
						<?php esc_html_e( 'Print total time in summary table', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_summary_total_time' )); ?>
					</td>
				</tr>
			</tbody>
		</table>

		<br />

		<table class="widefat">
			<thead>
				<tr>
					<th class="title" colspan="4">
						<?php esc_html_e( 'Advanced', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
				<tr>
					<th scope="col">
						<?php esc_html_e( 'Shortcode', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Description', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Possible values', 'wp-gpx-maps' ); ?>
					</th>
					<th scope="col">
						<?php esc_html_e( 'Current value', 'wp-gpx-maps' ); ?>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>pointsoffset</td>
					<td>
						<?php esc_html_e( 'Skip GPX points closer than XX meters', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>10</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_pointsoffset' )); ?>
					</td>
				</tr>
				<tr>
					<td>donotreducegpx</td>
					<td>
						<?php esc_html_e( 'Print all the GPX waypoints without reduce it', 'wp-gpx-maps' ); ?>
					</td>
					<td>
						<?php
						esc_html_e( 'Default is:', 'wp-gpx-maps' );
						echo ' ';
						?>
						<strong>false</strong>
					</td>
					<td>
						<?php echo esc_html(get_option( 'wpgpxmaps_donotreducegpx' )); ?>
					</td>
				</tr>
			</tbody>
		</table>

	</div>

	<p>
		<a href="http://devfarm.it/forums/forum/wp-gpx-maps/" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Bugs, problems, thanks and anything else here!', 'wp-gpx-maps' ); ?></a>
	</p>

</div>
