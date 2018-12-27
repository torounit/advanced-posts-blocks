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
		'postType'    => [
			'type'    => 'string',
			'default' => 'post',
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
	 */
	public function __construct( $name ) {
		foreach ( get_taxonomies( [ 'publicly_queryable' => true ], 'objects' ) as $taxonomy ) {
			$this->get_rest_base( $taxonomy );
			$base                      = $this->get_rest_base( $taxonomy );
			$this->attributes[ $base ] = [
				'type'    => 'array',
				'default' => [],
			];
		}
		parent::__construct( $name );
	}

	/**
	 * Get rest Base.
	 *
	 * @param \WP_Taxonomy $taxonomy
	 *
	 * @return bool|string
	 */
	public function get_rest_base( \WP_Taxonomy $taxonomy ) {
		return ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
	}

	/**
	 * Get taxonomies with connected.
	 *
	 * @param $post_type
	 *
	 * @return \WP_Taxonomy[]
	 */
	public function get_post_type_taxonomies( $post_type ) {
		return array_map( 'get_taxonomy', get_object_taxonomies( $post_type ) );
	}


	/**
	 * @param array $attributes
	 *
	 * @return false|string
	 */
	public function render( $attributes ) {
		$args = [
			'posts_per_page' => $attributes['postsToShow'],
			'post_status'    => 'publish',
			'order'          => $attributes['order'],
			'orderby'        => $attributes['orderBy'],
			'post_type'      => $attributes['postType'],
		];
		$post_type = $attributes['postType'];

		$args['tax_query'] = [];
		foreach ( $this->get_post_type_taxonomies( $post_type ) as $taxonomy ) {
			$this->get_rest_base( $taxonomy );
			$base = $this->get_rest_base( $taxonomy );
			if ( ! empty( $attributes[ $base ] ) ) {
				$args['tax_query'][] = [
					'taxonomy' => $taxonomy->name,
					'field'    => 'term_id',
					'terms'    => $attributes[ $base ],
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
