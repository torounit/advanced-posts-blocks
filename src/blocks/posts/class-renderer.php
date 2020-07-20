<?php
/**
 * Posts Renderer Class.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Blocks\Posts;

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
	protected $name = 'advanced-posts-blocks/posts';

	/**
	 * Attributes schema for blocks.
	 *
	 * @var array
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
		'offset' => [
			'type'    => 'number',
			'default' => 0,
		],
		'order'       => [
			'type'    => 'string',
			'default' => 'desc',
		],
		'orderBy'     => [
			'type'    => 'string',
			'default' => 'date',
		],
		'align'       => [
			'type' => 'string',
		],
		'ignoreStickyPosts' => [
			'type'    => 'boolean',
			'default' => true,
		]
	];

	/**
	 * Constructor
	 *
	 */
	public function __construct() {
		$this->setup_term_attributes();
		new Matrix_Term_Query( 'advanced_posts_blocks' );
		parent::__construct();
	}


	protected function register() {
		register_block_type(
			'advanced-posts-blocks/posts',
			$this->register_block_type_arguments()
		);
	}

	/**
	 * Set term attributes.
	 */
	private function setup_term_attributes() {
		foreach ( get_taxonomies( [ 'publicly_queryable' => true ], 'objects' ) as $taxonomy ) {
			$this->get_rest_base( $taxonomy );
			$base                      = $this->get_rest_base( $taxonomy );
			$this->attributes[ $base ] = [
				'type'    => 'array',
				'items'   => [
					'type' => 'number',
				],
				'default' => [],
			];
		}
	}

	/**
	 * Get rest Base.
	 *
	 * @param \WP_Taxonomy $taxonomy Taxonomy object.
	 *
	 * @return bool|string
	 */
	public function get_rest_base( \WP_Taxonomy $taxonomy ) {
		return ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
	}

	/**
	 * Get taxonomies with connected.
	 *
	 * @param array|string|\WP_Post $post_type Name of the type of taxonomy object, or an object (row from posts).
	 *
	 * @return \WP_Taxonomy[]
	 */
	public function get_post_type_taxonomies( $post_type ) {
		return array_map( 'get_taxonomy', get_object_taxonomies( $post_type ) );
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
			'posts_per_page'        => $attributes['postsToShow'],
			'post_status'           => 'publish',
			'ignore_sticky_posts'   => $attributes['ignoreStickyPosts'],
			'order'                 => $attributes['order'],
			'orderby'               => $attributes['orderBy'],
			'post_type'             => $attributes['postType'],
			'offset'                => $attributes['offset'],
			'advanced_posts_blocks' => true,
		];
		$post_type = $attributes['postType'];

		$args['tax_query'] = [];
		foreach ( $this->get_post_type_taxonomies( $post_type ) as $taxonomy ) {
			$this->get_rest_base( $taxonomy );
			$base  = $this->get_rest_base( $taxonomy );
			if ( $base && isset( $attributes[ $base ] ) && is_array( $attributes[ $base ] ) ) {
				$terms = array_filter( $attributes[ $base ] );
				if ( ! empty( $terms ) ) {
					$args['tax_query'][] = array_merge(
						[
							'taxonomy' => $taxonomy->name,
							'field'    => 'term_id',
							'terms'    => $terms,
						]
					);
				}
			}
		}

		$this->setup_query( $args );
		$output = $this->get_content_from_template( $attributes );
		if ( $output ) {
			return $output;
		}

		$output = $this->get_content_from_default_template( dirname( __FILE__ ) . '/template.php' );

		return $output;
	}
}
