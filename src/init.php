<?php
/**
 * Initialize.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks;

require_once dirname( __FILE__ ) . '/autoload.php';

add_action(
	'init',
	function () {
		load_plugin_textdomain( 'advanced-posts-blocks', false, basename( PLUGIN_FILE ) . '/languages' );
	}
);

add_action(
	'init',
	function () {
		new Blocks\Post\Renderer();
		new Blocks\Posts\Renderer();
		new Blocks\Children\Renderer();
	},
	999
);

