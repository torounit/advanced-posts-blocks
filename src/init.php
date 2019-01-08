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
		new Blocks\Post\Renderer( 'advanced-posts-blocks/post' );
		new Blocks\Posts\Renderer( 'advanced-posts-blocks/posts' );
	},
	9999
);

add_action(
	'enqueue_block_editor_assets',
	function () {
		wp_enqueue_script(
			'advanced-posts-blocks',
			plugins_url( 'dist/main.js', PLUGIN_FILE ),
			[
				'wp-api-fetch',
				'wp-blocks',
				'wp-components',
				'wp-data',
				'wp-element',
				'wp-editor',
				'wp-edit-post',
				'wp-i18n',
			],
			get_plugin_data()['Version'],
			true
		);
	}
);

