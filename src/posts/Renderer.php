<?php

namespace Advanced_Posts_Blocks\Posts;

/**
 * Class Renderer
 *
 * Posts blocks.
 *
 * @package Advanced_Posts_Blocks\Blocks\Posts
 */
class Renderer extends \Advanced_Posts_Blocks\Renderer {

	/**
	 * @var string $name Name for block.
	 */
	protected $name = '';

	/**
	 * @var |WP_Post_Type post type.
	 */
	protected $post_type = '';

	/**
	 * @var string post type.
	 */
	protected $taxonomy = '';

	/**
	 * @var array $attributes Attributes schema for blocks.
	 */
	protected $attributes = [
//		'taxonomy'    => [
//			'type' => 'string',
//		],
		'postType'    => [
			'type' => 'string',
		],
		'className'   => [
			'type' => 'string',
		],
		'postsToShow' => [
			'type'    => 'number',
			'default' => 5,
		],
		'order'       => [
			'type'    => 'string',
			'default' => 'desc',
		],
		'orderBy'     => [
			'type'    => 'string',
			'default' => 'date',
		],
	];


	/**
	 * Constructor
	 *
	 * @param $name
	 * @param string $post_type
	 */
	public function __construct( $name, $post_type = 'post' ) {
		$this->post_type = get_post_type_object( $post_type );
		foreach ( get_object_taxonomies( $post_type ) as $taxonomy ) {
			$this->attributes[ $taxonomy ] = [
				'type'    => 'array',
				'default' => [],
			];
		}
		if ( $name ) {
			$this->name = $name;
			parent::__construct();
		}
	}


	public function render( $attributes ) {
		$args = [
			'posts_per_page' => $attributes['postsToShow'],
			'post_status'    => 'publish',
			'order'          => $attributes['order'],
			'orderby'        => $attributes['orderBy'],
			'post_type'      => $this->post_type->name,
		];

		$args['tax_query'] = [];

		foreach ( get_object_taxonomies( $this->post_type->name ) as $taxonomy ) {
			if ( ! empty( $attributes[ $taxonomy ] ) ) {
				$args['tax_query'][] = [
					'taxonomy' => $taxonomy,
					'field'    => 'term_id',
					'terms'    => $attributes[ $taxonomy ],
					'operator' => 'AND',
				];
			}
		}

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
