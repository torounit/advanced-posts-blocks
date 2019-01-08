<?php
/**
 * Posts Renderer Class.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Blocks\Children;

/**
 * Class Renderer
 *
 * Posts blocks.
 */
class Renderer extends \Advanced_Posts_Blocks\Blocks\Renderer {

	/**
	 * Name of Block.
	 *
	 * @var string
	 */
	protected $name = '';

	/**
	 * Attributes schema for blocks.
	 *
	 * @var array
	 */
	protected $attributes = [
		'postType'    => [
			'type'    => 'string',
		],
		'postId'    => [
			'type'    => 'number',
		],
		'className'   => [
			'type' => 'string',
		],
		'postsToShow' => [
			'type'    => 'number',
			'default' => -1,
		],
		'order'       => [
			'type'    => 'string',
			'default' => 'asc',
		],
		'orderBy'     => [
			'type'    => 'string',
			'default' => 'menu_order',
		],
		'align'       => [
			'type' => 'string',
		],
	];

	/**
	 * Constructor
	 *
	 * @param string $name block name.
	 */
	public function __construct( string $name ) {
		parent::__construct( $name );
	}

	/**
	 * Render callback
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return false|string
	 */
	public function render( $attributes ) {
		$args      = [
			'posts_per_page' => $attributes['postsToShow'],
			'post_status'    => 'publish',
			'post_parent'    => $attributes['postId'] ? $attributes['postId'] : get_the_ID(),
			'order'          => $attributes['order'],
			'orderby'        => $attributes['orderBy'],
			'post_type'      => $attributes['postType'] ? $attributes['postType'] : get_post_type(),
		];

		$query = new \WP_Query( $args );
		set_query_var( 'query', $query );
		$output = $this->get_content_from_template( $attributes );
		if ( $output ) {
			return $output;
		}

		ob_start();
		load_template( dirname( __FILE__ ) . '/template.php' );
		$output = ob_get_contents();
		ob_end_clean();

		return $output;
	}
}
