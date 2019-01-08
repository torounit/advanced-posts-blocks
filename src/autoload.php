<?php

namespace Advanced_Posts_Blocks;

spl_autoload_register( 'Advanced_Posts_Blocks\autoload_register' );

function autoload_register( $name ) {
	$dir        = dirname( __FILE__ );
	$namespaces = explode( '\\', $name );
	$class_name = array_pop( $namespaces );

	$dir = dirname( __FILE__ ) . '/blocks' . str_replace( 'advanced_posts_blocks', '', strtolower( join( '/', $namespaces ) ) );

	$class_file_name = 'class-' . strtolower( $class_name ) . '.php';
	$file_name       = $dir . '/' . $class_file_name;

	if ( is_readable( $file_name ) ) {
		include $file_name;
	}
}
