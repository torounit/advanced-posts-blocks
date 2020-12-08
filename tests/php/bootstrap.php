<?php
/**
 * PHPUnit bootstrap file
 *
 * @package Advanced_Posts_Blocks
 */

// Require composer dependencies.
require_once dirname( __DIR__ ) . '/../vendor/autoload.php';

$_tests_dir = getenv( 'WP_TESTS_DIR' );

// Next, try the WP_PHPUNIT composer package.
if ( ! $_tests_dir ) {
	$_tests_dir = getenv( 'WP_PHPUNIT__DIR' );
}

if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

// See if we're installed inside an existing WP dev instance.
if ( ! $_tests_dir ) {
	$_try_tests_dir = __DIR__ . '/../../../../../tests/phpunit';
	if ( file_exists( $_try_tests_dir . '/includes/functions.php' ) ) {
		$_tests_dir = $_try_tests_dir;
	}
}
// Fallback.
if ( ! $_tests_dir ) {
	$_tests_dir = '/tmp/wordpress-tests-lib';
}


if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	echo "Could not find $_tests_dir/includes/functions.php, have you run bin/install-wp-tests.sh ?" . PHP_EOL; // phpcs:ignore
	exit( 1 );
}


// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';


/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	require dirname( dirname( dirname( __FILE__ ) ) ) . '/advanced-posts-blocks.php';
}
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';
