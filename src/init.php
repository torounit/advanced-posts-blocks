<?php

namespace Advanced_Posts_Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once dirname( __FILE__ ) . '/Renderer.php';
require_once dirname( __FILE__ ) . '/posts/Renderer.php';


add_action( 'wp_loaded', function () {
	$post_types = get_post_types( [ 'public' => true ] );
	foreach ( $post_types as $post_type ) {
		$wp_post_type = get_post_type_object( $post_type );
		$base         = $wp_post_type->rest_base;
		if ( ! is_string( $base ) ) {
			$base = $post_type;
		}
		new Posts\Renderer( 'advanced-posts-blocks/' . $base, $post_type );

	}
} );

add_action(
	'enqueue_block_editor_assets',
	function () {
		$deps = [
			'wp-api-fetch',
			'wp-blocks',
			'wp-components',
			'wp-data',
			'wp-element',
			'wp-editor',
			'wp-edit-post',
			'wp-i18n',
			'wp-plugins',
		];
		wp_enqueue_script( 'blocks-script', plugins_url( 'dist/main.js', PLUGIN_FILE ), $deps, 1, true );
	}
);

