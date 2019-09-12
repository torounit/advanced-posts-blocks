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
		new Blocks\Post\Renderer( 'advanced-posts-blocks/post' );
		new Blocks\Posts\Renderer( 'advanced-posts-blocks/posts' );
		new Blocks\Children\Renderer( 'advanced-posts-blocks/children' );
	},
	9999
);

add_action(
	'enqueue_block_editor_assets',
	function () {
		$deps = json_decode( file_get_contents( dirname( PLUGIN_FILE ) . '/build/index.deps.json' ) );
		wp_enqueue_script(
			'advanced-posts-blocks',
			plugins_url( 'build/index.js', PLUGIN_FILE ),
			$deps,
			get_plugin_data()['Version'],
			true
		);
		wp_set_script_translations( 'advanced-posts-blocks', 'advanced-posts-blocks', basename( PLUGIN_FILE ) . '/languages' );
	}
);

