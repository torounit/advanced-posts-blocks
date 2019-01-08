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
	protected $name = '';

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
	];

	/**
	 * Tax Query Term operator
	 *
	 * @var string
	 */
	private $term_operator = 'AND';

	/**
	 * Constructor
	 *
	 * @param string $name block name.
	 */
	public function __construct( string $name ) {
		parent::__construct( $name );

		foreach ( get_taxonomies( [ 'publicly_queryable' => true ], 'objects' ) as $taxonomy ) {
			$this->get_rest_base( $taxonomy );
			$base                      = $this->get_rest_base( $taxonomy );
			$this->attributes[ $base ] = [
				'type'    => 'array',
				'default' => '',
			];
		}

		new Query( $this->term_operator );
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
					'operator' => $this->term_operator,
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
