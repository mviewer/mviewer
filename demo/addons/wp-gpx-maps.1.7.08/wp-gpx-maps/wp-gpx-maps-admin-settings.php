<?php
/**
 * Settings Tab
 *
 * Contains all settings for the output.
 *
 * @package WP GPX Maps
 */

if ( ! current_user_can( 'manage_options' ) )
	return;

/* General */
$distanceType   = get_option( 'wpgpxmaps_distance_type' );
$skipcache      = get_option( 'wpgpxmaps_skipcache' );
$download       = get_option( 'wpgpxmaps_download' );
$usegpsposition = get_option( 'wpgpxmaps_usegpsposition' );
/* Print Summary Table */
$summary        = get_option( 'wpgpxmaps_summary' );
$tot_len        = get_option( 'wpgpxmaps_summary_tot_len' );
$max_ele        = get_option( 'wpgpxmaps_summary_max_ele' );
$min_ele        = get_option( 'wpgpxmaps_summary_min_ele' );
$total_ele_up   = get_option( 'wpgpxmaps_summary_total_ele_up' );
$total_ele_down = get_option( 'wpgpxmaps_summary_total_ele_down' );
$avg_speed      = get_option( 'wpgpxmaps_summary_avg_speed' );
$avg_cad        = get_option( 'wpgpxmaps_summary_avg_cad' );
$avg_hr         = get_option( 'wpgpxmaps_summary_avg_hr' );
$avg_temp       = get_option( 'wpgpxmaps_summary_avg_temp' );
$total_time     = get_option( 'wpgpxmaps_summary_total_time' );
/* Map */
$t                 = get_option( 'wpgpxmaps_map_type' );
$zoomonscrollwheel = get_option( 'wpgpxmaps_zoomonscrollwheel' );
$showW             = get_option( 'wpgpxmaps_show_waypoint' );
/* Diagram */
$showEle   = get_option( 'wpgpxmaps_show_elevation' );
$uom       = get_option( 'wpgpxmaps_unit_of_measure' );
$showSpeed = get_option( 'wpgpxmaps_show_speed' );
$uomSpeed  = get_option( 'wpgpxmaps_unit_of_measure_speed' );
$showHr    = get_option( 'wpgpxmaps_show_hr' );
$showAtemp = get_option( 'wpgpxmaps_show_atemp' );
$showCad   = get_option( 'wpgpxmaps_show_cadence' );
$showGrade = get_option( 'wpgpxmaps_show_grade' );
/* Advanced */
$po             = get_option( 'wpgpxmaps_pointsoffset' );
$donotreducegpx = get_option( 'wpgpxmaps_donotreducegpx' );

if ( empty( $showEle ) )
	$showEle = 'true';

if ( ! ( $t ) )
	$t = 'HYBRID';

if ( ! ( $po ) )
	$po = 10;


function write_row_checkbox($label_text, $input_name, $input_value, $input_helper ='')
{
return strtr('<tr>
	<th scope="row">$left</th>
	<td>$right <em>$helper</em></td>
</tr>', array( 
	'$left' => esc_html( $label_text, 'wp-gpx-maps' ), 
	'$right' => "<input name=\"$input_name\" type=\"checkbox\" value=\"true\" ". ( true == $input_value ? 'checked' : '' ) ." onchange=\"this.value = (this.checked)\" />", 
	'$helper' => $input_helper
	)
);
	
}

function write_row_input($label_text, $input_name, $input_helper='', $input_width = 80)
{
return strtr('<tr>
	<th scope="row">$left</th>
	<td>$right <em>$helper</em></td>
</tr>', array( 
	'$left' => esc_html( $label_text, 'wp-gpx-maps' ), 
	'$right' => "<input name=\"$input_name\" type=\"text\" id=\"$input_name\" value=\"".esc_attr(get_option($input_name))."\" style=\"width:{$input_width}px;\" />", 
	'$helper' => $input_helper 
	)
);
	
}

function write_row_input_color($label_text, $input_name, $input_helper='', $input_width = 80)
{
return strtr('<tr>
	<th scope="row">$left</th>
	<td>$right <em>$helper</em></td>
</tr>', array( 
	'$left' => esc_html( $label_text, 'wp-gpx-maps' ), 
	'$right' => "<input name=\"$input_name\" type=\"color\" data-hex=\"true\" id=\"$input_name\" value=\"".esc_attr(get_option($input_name))."\" style=\"width:{$input_width}px;\" />", 
	'$helper' => $input_helper 
	)
);
	
}


function write_input($input_name, $input_width = 80)
{
	return "<input name=\"$input_name\" type=\"text\" id=\"$input_name\" value=\"".esc_attr(get_option($input_name))."\" style=\"width:{$input_width}px;\" />";
}

?>

<!-- The First Div (for body) starts in wp-gpx-admin.php -->

	<div class="wpgpxmaps-container-tab-settings">

		<form method="post" action="options.php">
			<?php wp_nonce_field( 'update-options' ); ?>

			<h3 class="title">
				<?php esc_html_e( 'General', 'wp-gpx-maps' ); ?>
			</h3>

			<table class="form-table">
			
			<? echo write_row_input('Map width:', 'wpgpxmaps_width') ?>
			
			<? echo write_row_input('Map height:', 'wpgpxmaps_height') ?>

			<? echo write_row_input('Graph height:', 'wpgpxmaps_graph_height') ?>

			<tr>
				<th scope="row">
					<?php esc_html_e( 'Distance type:', 'wp-gpx-maps' ); ?>
				</th>
				<td>
					<select name='wpgpxmaps_distance_type'>
						<option value="0" <?php if ( '0' == $distanceType || '' == $distanceType ) echo 'selected'; ?>>
							<?php esc_html_e( 'Normal (default)', 'wp-gpx-maps' ); ?>
						</option>
						<option value="1" <?php if ( '1' == $distanceType ) echo 'selected'; ?>>
							<?php esc_html_e( 'Flat &#8594; (Only flat distance, don&#8217;t take care of altitude)', 'wp-gpx-maps' ); ?>
						</option>
						<option value="2" <?php if ( '2' == $distanceType ) echo 'selected'; ?>>
							<?php esc_html_e( 'Climb &#8593; (Only climb distance)', 'wp-gpx-maps' ); ?>
						</option>
					</select>
				</td>
			</tr>
			
			<? echo write_row_checkbox( 'Cache:', 'wpgpxmaps_skipcache', $skipcache, esc_html( 'Do not use cache', 'wp-gpx-maps' ) ); ?>

			<? echo write_row_checkbox( 'GPX Download:', 'wpgpxmaps_download', $download, esc_html( 'Allow users to download your GPX file', 'wp-gpx-maps' ) ); ?>

			<? echo write_row_checkbox( 'Use browser GPS position:', 'wpgpxmaps_usegpsposition', $usegpsposition, esc_html( 'Allow users to use browser GPS in order to display their current position on map', 'wp-gpx-maps' ) ); ?>

			<? echo write_row_input('Thunderforest API Key (Open Cycle Map):', 
									'wpgpxmaps_openstreetmap_apikey', 
									'<a href="http://www.thunderforest.com/docs/apikeys/" target="_blank" rel="noopener noreferrer">Thunderforest API Key and signing in to your Thunderforest account.</a>', 
									400 ) ?>

		</table>

		<p class="submit">
			<input type="hidden" name="action" value="update" />
			<input name="page_options" type="hidden" value="wpgpxmaps_height,wpgpxmaps_graph_height,wpgpxmaps_width,wpgpxmaps_download,wpgpxmaps_skipcache,wpgpxmaps_distance_type,wpgpxmaps_usegpsposition,wpgpxmaps_openstreetmap_apikey" />
			<input type="submit" class="button-primary" value="<?php esc_html_e( 'Save Changes', 'wp-gpx-maps' ); ?>" />
		</p>

		</form>

		<hr />

		<form method="post" action="options.php">
			<?php wp_nonce_field( 'update-options' ); ?>

			<h3 class="title">
				<?php esc_html_e( 'Summary table', 'wp-gpx-maps' ); ?>
			</h3>

			<table class="form-table">
			
				<? echo write_row_checkbox( 'Summary table:', 'wpgpxmaps_summary', $summary, esc_html( 'Print summary details of your GPX track', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Total distance:', 'wpgpxmaps_summary_tot_len', $tot_len, esc_html( 'Print total distance', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Max elevation:', 'wpgpxmaps_summary_max_ele', $max_ele, esc_html( 'Print max elevation', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Min elevation:', 'wpgpxmaps_summary_min_ele', $min_ele, esc_html( 'Print min elevation', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Total climbing:', 'wpgpxmaps_summary_total_ele_up', $total_ele_up, esc_html( 'Print total climbing', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Total descent:', 'wpgpxmaps_summary_total_ele_down', $total_ele_down, esc_html( 'Print total descent', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Average speed:', 'wpgpxmaps_summary_avg_speed', $avg_speed, esc_html( 'Print average speed', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Average cadence:', 'wpgpxmaps_summary_avg_cad', $avg_cad, esc_html( 'Print average cadence', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Average heart rate:', 'wpgpxmaps_summary_avg_hr', $avg_hr, esc_html( 'Print average heart rate', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Average temperature:', 'wpgpxmaps_summary_avg_temp', $avg_temp, esc_html( 'Print average temperature', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Total time:', 'wpgpxmaps_summary_total_time', $total_time, esc_html( 'Print total time', 'wp-gpx-maps' ) ); ?>

			</table>

			<p class="submit">
				<input type="hidden" name="action" value="update" />
				<input name="page_options" type="hidden" value="wpgpxmaps_summary,wpgpxmaps_summary_tot_len,wpgpxmaps_summary_max_ele,wpgpxmaps_summary_min_ele,wpgpxmaps_summary_total_ele_up,wpgpxmaps_summary_total_ele_down,wpgpxmaps_summary_avg_speed,wpgpxmaps_summary_avg_cad,wpgpxmaps_summary_avg_hr,wpgpxmaps_summary_avg_temp,wpgpxmaps_summary_total_time" />
				<input type="submit" class="button-primary" value="<?php esc_html_e( 'Save Changes', 'wp-gpx-maps' ); ?>" />
			</p>

		</form>

		<hr />

		<form method="post" action="options.php">
			<?php wp_nonce_field( 'update-options' ); ?>

			<h3 class="title">
				<?php esc_html_e( 'Map', 'wp-gpx-maps' ); ?>
			</h3>

			<table class="form-table">

				<tr>
					<th scope="row">
						<?php esc_html_e( 'Default map type:', 'wp-gpx-maps' ); ?>
					</th>
					<td>
						<input type="radio" name="wpgpxmaps_map_type" value="OSM1" <?php if ( 'OSM1' == $t ) echo 'checked'; ?>>
							<?php
							/* translators: map type */
							esc_html_e( 'Open Street Map', 'wp-gpx-maps' );
							?>
						<br />
						<input type="radio" name="wpgpxmaps_map_type" value="OSM2" <?php if ( 'OSM2' == $t ) echo 'checked'; ?>>
							<?php
							/* translators: map provider / map type */
							esc_html_e( 'Open Cycle Map / Thunderforest - Open Cycle Map (API Key required)', 'wp-gpx-maps' );
							?>
						<br />
						<input type="radio" name="wpgpxmaps_map_type" value="OSM3" <?php if ( 'OSM3' == $t ) echo 'checked'; ?>>
							<?php
							/* translators: map provider / map type */
							esc_html_e( 'Thunderforest - Outdoors (API Key required)', 'wp-gpx-maps' );
							?>
						<br />
						<input type="radio" name="wpgpxmaps_map_type" value="OSM4" <?php if ( 'OSM4' == $t ) echo 'checked'; ?>>
							<?php
							/* translators: map provider / map type */
							esc_html_e( 'Thunderforest - Transport (API Key required)', 'wp-gpx-maps' );
							?>
						<br />
						<input type="radio" name="wpgpxmaps_map_type" value="OSM5" <?php if ( 'OSM5' == $t ) echo 'checked'; ?>>
							<?php
							/* translators: map provider / map type */
							esc_html_e( 'Thunderforest - Landscape (API Key required)', 'wp-gpx-maps' );
							?>
						<br />
						<!-- <input type="radio" name="wpgpxmaps_map_type" value="OSM6" <?php if ( 'OSM6' == $t ) echo 'checked'; ?>>-->
							<?php
							/* translators: map provider / map type */
							//esc_html_e( 'MapToolKit - Terrain', 'wp-gpx-maps' );
							?>
						<!--<br />-->
						<input type="radio" name="wpgpxmaps_map_type" value="OSM7" <?php if ( 'OSM7' == $t ) echo 'checked'; ?>>
							<?php
							/* translators: map provider / map type */
							esc_html_e( 'Open Street Map - Humanitarian map style', 'wp-gpx-maps' );
							?>
						<br />
						<input type="radio" name="wpgpxmaps_map_type" value="OSM9" <?php if ( 'OSM9' == $t ) echo 'checked'; ?>>
							<?php
							/* translators: map provider / map type */
							esc_html_e( 'Hike & Bike', 'wp-gpx-maps' );
							?>
						<br />
						<input type="radio" name="wpgpxmaps_map_type" value="OSM10" <?php if ( 'OSM10' == $t ) echo 'checked'; ?>>
							<?php
							/* translators: map provider / map type */
							esc_html_e( 'Open Sea Map', 'wp-gpx-maps' );
							?>
						<br />
						<input type="radio" name="wpgpxmaps_map_type" value="OSM11" <?php if ( $t == 'OSM11' ) echo 'checked'; ?>>
							<?php
							echo ' ';
							_e( 'GSI Map (Japan)', 'wp-gpx-maps' );
							?>
						<br />
					</td>
				</tr>

				<? echo write_row_input_color('Map line color:', 'wpgpxmaps_map_line_color' ) ?>

				<? echo write_row_checkbox( 'On mouse scroll wheel:', 'wpgpxmaps_zoomonscrollwheel', $zoomonscrollwheel, esc_html( 'Enable zoom', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_checkbox( 'Waypoints support:', 'wpgpxmaps_show_waypoint', $showW, esc_html( 'Show waypoints', 'wp-gpx-maps' ) ); ?>


				<? echo write_row_input('Start track icon:', 
										'wpgpxmaps_map_start_icon', 
										esc_html( '(URL to image) Leave empty to hide.', 'wp-gpx-maps' ), 
										400 ) ?>
										
				<? echo write_row_input('End track icon:', 
										'wpgpxmaps_map_end_icon', 
										esc_html( '(URL to image) Leave empty to hide.', 'wp-gpx-maps' ), 
										400 ) ?>
										
				<? echo write_row_input('Current position icon:', 
										'wpgpxmaps_map_current_icon', 
										esc_html( '(URL to image) Leave empty to hide.', 'wp-gpx-maps' ), 
										400 ) ?>
										
										
				<? echo write_row_input('Current GPS position icon:', 
										'wpgpxmaps_currentpositioncon', 
										esc_html( '(URL to image) Leave empty to hide.', 'wp-gpx-maps' ), 
										400 ) ?>
										
				<? echo write_row_input('Custom waypoint icon:', 
										'wpgpxmaps_map_waypoint_icon', 
										esc_html( '(URL to image) Leave empty to hide.', 'wp-gpx-maps' ), 
										400 ) ?>
									

			</table>

			<p class="submit">
				<input type="hidden" name="action" value="update" />
				<input name="page_options" type="hidden" value="wpgpxmaps_map_type,wpgpxmaps_map_line_color,wpgpxmaps_zoomonscrollwheel,wpgpxmaps_show_waypoint,wpgpxmaps_map_start_icon,wpgpxmaps_map_end_icon,wpgpxmaps_map_current_icon,wpgpxmaps_currentpositioncon,wpgpxmaps_map_waypoint_icon" />
				<input type="submit" class="button-primary" value="<?php esc_html_e( 'Save Changes', 'wp-gpx-maps' ); ?>" />
			</p>

		</form>

		<hr />

		<form method="post" action="options.php">
			<?php wp_nonce_field( 'update-options' ); ?>

			<h3 class="title">
				<?php esc_html_e( 'Chart', 'wp-gpx-maps' ); ?>
			</h3>

			<table class="form-table">

				<? echo write_row_checkbox( 'Altitude:', 'wpgpxmaps_show_elevation', $showEle, esc_html( 'Show altitude', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_input_color('Altitude line color:', 'wpgpxmaps_graph_line_color' ) ?>

				<tr>
					<th scope="row">
						<?php esc_html_e( 'Unit of measure:', 'wp-gpx-maps' ); ?>
					</th>
					<td>
						<select name='wpgpxmaps_unit_of_measure'>
							<option value="0" <?php if ( '0' == $uom ) echo 'selected'; ?>>
								<?php
								/* translators: chart axis labels */
								esc_html_e( 'meters / meters', 'wp-gpx-maps' );
								?>
							</option>
							<option value="1" <?php if ( '1' == $uom ) echo 'selected'; ?>>
								<?php
								/* translators: chart axis labels */
								esc_html_e( 'feet / miles', 'wp-gpx-maps' );
								?>
							</option>
							<option value="2" <?php if ( '2' == $uom ) echo 'selected'; ?>>
								<?php
								/* translators: chart axis labels */
								esc_html_e( 'meters / kilometers', 'wp-gpx-maps' );
								?>
							</option>
							<option value="3" <?php if ( '3' == $uom ) echo 'selected'; ?>>
								<?php
								/* translators: chart axis labels */
								esc_html_e( 'meters / nautical miles', 'wp-gpx-maps' );
								?>
							</option>
							<option value="4" <?php if ( '4' == $uom ) echo 'selected'; ?>>
								<?php
								/* translators: chart axis labels */
								esc_html_e( 'meters / miles', 'wp-gpx-maps' );
								?>
							</option>
							<option value="5" <?php if ( '5' == $uom ) echo 'selected'; ?>>
								<?php
								/* translators: chart axis labels */
								esc_html_e( 'feet / nautical miles', 'wp-gpx-maps' );
								?>
							</option>
						</select>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<?php esc_html_e( 'Altitude display offset:', 'wp-gpx-maps' ); ?>
					</th>
					<td>
						<?php esc_html_e( 'From', 'wp-gpx-maps' ); ?>					
						<? echo write_input('wpgpxmaps_graph_offset_from1') ?>
						<?php esc_html_e( 'to', 'wp-gpx-maps' ); ?>
						<? echo write_input('wpgpxmaps_graph_offset_to1') ?>
						<em>
							<?php esc_html_e( '(leave empty for auto scale)', 'wp-gpx-maps' ); ?>
						</em>
					</td>
				</tr>

				<? echo write_row_checkbox( 'Speed:', 'wpgpxmaps_show_speed', $showSpeed, esc_html( 'Show speed', 'wp-gpx-maps' ) ); ?>
		
				<? echo write_row_input_color('Speed line color:', 'wpgpxmaps_graph_line_color_speed' ) ?>

				<tr>
					<th scope="row">
						<?php esc_html_e( 'Speed unit of measure:', 'wp-gpx-maps' ); ?>
					</th>
					<td>
						<select name='wpgpxmaps_unit_of_measure_speed'>
							<option value="0" <?php if ( '0' == $uomSpeed ) echo 'selected'; ?>>
								<?php
								/* translators: speed unit of measure */
								esc_html_e( 'm/s', 'wp-gpx-maps' );
								?>
							</option>
							<option value="1" <?php if ( '1' == $uomSpeed ) echo 'selected'; ?>>
								<?php
								/* translators: speed unit of measure */
								esc_html_e( 'km/h', 'wp-gpx-maps' );
								?>
							</option>
							<option value="2" <?php if ( '2' == $uomSpeed ) echo 'selected'; ?>>
								<?php
								/* translators: speed unit of measure */
								esc_html_e( 'miles/h', 'wp-gpx-maps' );
								?>
							</option>
							<option value="3" <?php if ( '3' == $uomSpeed ) echo 'selected'; ?>>
								<?php
								/* translators: speed unit of measure */
								esc_html_e( 'min/km', 'wp-gpx-maps' );
								?>
							</option>
							<option value="4" <?php if ( '4' == $uomSpeed ) echo 'selected'; ?>>
								<?php
								/* translators: speed unit of measure */
								esc_html_e( 'min/miles', 'wp-gpx-maps' );
								?>
							</option>
							<option value="5" <?php if ( '5' == $uomSpeed ) echo 'selected'; ?>>
								<?php
								/* translators: speed unit of measure */
								esc_html_e( 'Knots (nautical miles / hour)', 'wp-gpx-maps' );
								?>
							</option>
							<option value="6" <?php if ( '6' == $uomSpeed ) echo 'selected'; ?>>
								<?php
								/* translators: speed unit of measure */
								esc_html_e( 'min/100 meters', 'wp-gpx-maps' );
								?>
							</option>
						</select>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<?php esc_html_e( 'Speed display offset:', 'wp-gpx-maps' ); ?>
					</th>
					<td>
						<?php esc_html_e( 'From', 'wp-gpx-maps' ); ?>
						<? echo write_input('wpgpxmaps_graph_offset_from2') ?>
						<?php esc_html_e( 'to', 'wp-gpx-maps' ); ?>
						<? echo write_input('wpgpxmaps_graph_offset_to2') ?>
						<em>
							<?php esc_html_e( '(leave empty for auto scale)', 'wp-gpx-maps' ); ?>
						</em>
					</td>
				</tr>

				<? echo write_row_checkbox( 'Heart rate (where aviable):', 'wpgpxmaps_show_hr', $showHr, esc_html( 'Show heart rate', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_input_color( 'Heart rate line color:', 'wpgpxmaps_graph_line_color_hr' ) ?>

				<? echo write_row_checkbox( 'Temperature (where aviable):', 'wpgpxmaps_show_atemp', $showAtemp, esc_html( 'Show temperature', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_input_color('Temperature line color:', 'wpgpxmaps_graph_line_color_atemp' ) ?>

				<? echo write_row_checkbox( 'Cadence (where aviable):', 'wpgpxmaps_show_cadence', $showCad, esc_html( 'Show cadence', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_input_color('Cadence line color:', 'wpgpxmaps_graph_line_color_cad' ) ?>

				<? echo write_row_checkbox( 'Grade:', 'wpgpxmaps_show_grade', $showGrade, esc_html( 'Show grade - BETA (Grade values depends on your GPS accuracy. If you have a poor GPS accuracy they might be totally wrong!)', 'wp-gpx-maps' ) ); ?>

				<? echo write_row_input_color('Grade line color:', 'wpgpxmaps_graph_line_color_grade' ) ?>

			</table>

			<p class="submit">
				<input type="hidden" name="action" value="update" />
				<input name="page_options" type="hidden" value="wpgpxmaps_show_elevation,wpgpxmaps_graph_line_color,wpgpxmaps_unit_of_measure,wpgpxmaps_show_speed,wpgpxmaps_graph_line_color_speed,wpgpxmaps_show_hr,wpgpxmaps_graph_line_color_hr,wpgpxmaps_unit_of_measure_speed,wpgpxmaps_graph_offset_from1,wpgpxmaps_graph_offset_to1,wpgpxmaps_graph_offset_from2,wpgpxmaps_graph_offset_to2,wpgpxmaps_graph_line_color_cad,wpgpxmaps_show_cadence,wpgpxmaps_show_grade,wpgpxmaps_graph_line_color_grade,wpgpxmaps_show_atemp,wpgpxmaps_graph_line_color_atemp" />
				<input type="submit" class="button-primary" value="<?php esc_html_e( 'Save Changes', 'wp-gpx-maps' ); ?>" />
			</p>

		</form>

		<hr />

		<form method="post" action="options.php">
			<?php wp_nonce_field( 'update-options' ); ?>

			<h3 class="title">
				<?php esc_html_e( 'Advanced Options', 'wp-gpx-maps' ); ?>
			</h3>
			<em>
				<?php esc_html_e( '(Do not edit if you don&#8217;t know what you are doing!)', 'wp-gpx-maps' ); ?>
			</em>

			<table class="form-table">

				<tr>
					<th scope="row">
						<?php esc_html_e( 'Skip GPX points closer than:', 'wp-gpx-maps' ); ?>
					</th>
					<td>
						<input name="wpgpxmaps_pointsoffset" type="text" id="wpgpxmaps_pointsoffset" value="<?php echo $po; ?>" style="width:50px;" />
						<i>
							<?php esc_html_e( 'meters', 'wp-gpx-maps' ); ?>
						</i>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<?php esc_html_e( 'Reduce GPX:', 'wp-gpx-maps' ); ?>
					</th>
					<td>
						<input name="wpgpxmaps_donotreducegpx" type="checkbox" value="true" <?php if ( true == $donotreducegpx ) { echo( 'checked' ); } ?> onchange="this.value = (this.checked)" />
						<i>
							<?php esc_html_e( 'Do not reduce GPX', 'wp-gpx-maps' ); ?>
						</i>
					</td>
				</tr>

			</table>

			<p class="submit">
				<input type="hidden" name="action" value="update" />
				<input name="page_options" type="hidden" value="wpgpxmaps_donotreducegpx,wpgpxmaps_pointsoffset" />
				<input type="submit" class="button-primary" value="<?php esc_html_e( 'Save Changes', 'wp-gpx-maps' ); ?>" />
			</p>

		</form>

	</div>

</div>
