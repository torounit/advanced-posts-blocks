<?php
/**
 * Plugin Name:     Advanced Posts Blocks
 * Plugin URI:      https://github.com/torounit/advanced-posts-blocks
 * Description:     Customizable posts blocks.
 * Author:          Toro_Unit
 * Author URI:      https://torounit.com
 * Text Domain:     advanced-posts-blocks
 * Domain Path:     /languages
 * Version: 5.0.0
 *
 * @package         Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PLUGIN_FILE   = __FILE__;
const SCRIPT_HANDLE = 'advanced-posts-blocks';

/**
 * Get plugin information.
 *
 * @return array {
 *     Array of plugin information for the strings.
 *
 *     @type string $Name        Plugin mame.
 *     @type string $PluginURI   Plugin URL.
 *     @type string $Version     Version.
 *     @type string $Description Description.
 *     @type string $Author      Author name.
 *     @type string $AuthorURI   Author URL.
 *     @type string $TextDomain  textdomain.
 *     @type string $DomainPath  mo file dir.
 *     @type string $Network     Multisite.
 * }
 */
function get_plugin_data() {
	static $data = null;
	if ( empty( $data ) ) {
		$data = \get_file_data(
			__FILE__,
			array(
				'Name'        => 'Plugin Name',
				'PluginURI'   => 'Plugin URI',
				'Version'     => 'Version',
				'Description' => 'Description',
				'Author'      => 'Author',
				'AuthorURI'   => 'Author URI',
				'TextDomain'  => 'Text Domain',
				'DomainPath'  => 'Domain Path',
				'Network'     => 'Network',
			)
		);
	}

	return $data;
}

/**
 * Block Initializer.
 */
require_once dirname( __FILE__ ) . '/src/init.php';
