<?php
/**
 * Posts Renderer Class.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks;

/**
 * Class Renderer
 *
 * Posts blocks.
 */
class Renderer {

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
	 * Query var
	 *
	 * @var string
	 */
	private $query_var = 'advanced_posts_blocks';

	/**
	 * Constructor
	 *
	 * @param string $name block name.
	 */
	public function __construct( string $name ) {
		if ( $name ) {
			$this->name = $name;
		}

		foreach ( get_taxonomies( [ 'publicly_queryable' => true ], 'objects' ) as $taxonomy ) {
			$this->get_rest_base( $taxonomy );
			$base                      = $this->get_rest_base( $taxonomy );
			$this->attributes[ $base ] = [
				'type'    => 'array',
				'default' => '',
			];
		}
		$this->register();

		add_filter( 'query_vars', [ $this, 'add_query_var' ] );
		add_action( 'pre_get_posts', [ $this, 'pre_get_posts' ] );
	}

	/**
	 * Add Query var.
	 *
	 * @param array $query_vars $public_query_vars.
	 *
	 * @return array
	 */
	public function add_query_var( $query_vars ) {
		$query_vars[] = $this->query_var;

		return $query_vars;
	}

	/**
	 * Change tax_query `operator` in the_wp_query
	 *
	 * @param \WP_Query $query The WP_Query instance (passed by reference).
	 */
	public function pre_get_posts( \WP_Query $query ) {
		$tax_query             = $query->get( 'tax_query' );
		$advanced_posts_blocks = filter_input( INPUT_GET, 'advanced_posts_blocks' );

		if ( $advanced_posts_blocks && $tax_query ) {
			$tax_query = array_map(
				function ( $term_query ) {
					if ( ! is_array( $term_query ) ) {
						  return $term_query;
					}
						$term_query['operator'] = $this->term_operator;

						return $term_query;
				},
				$tax_query
			);
		}
		$query->set( 'tax_query', $tax_query );
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

	/**
	 * Regsiter Block Type.
	 */
	protected function register() {
		register_block_type(
			$this->name,
			[
				'attributes'      => $this->get_attributes(),
				'render_callback' => [ $this, 'render' ],
			]
		);
	}

	/**
	 * Getter for attirbutes.
	 *
	 * @return array
	 */
	public function get_attributes(): array {
		return $this->attributes;
	}

	/**
	 * Get html class names.
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return array
	 */
	public function get_class_names( $attributes ): array {
		$class_names = [];
		if ( ! empty( $attributes['className'] ) ) {
			$class_names = explode( ' ', $attributes['className'] );
		}
		if ( ! empty( $attributes['align'] ) ) {
			$class_names[] = 'align' . $attributes['align'];
		}

		return $class_names;
	}

	/**
	 * Get template part directory.
	 *
	 * @return string
	 */
	public function get_template_part_dir() {
		$template_part_dir = apply_filters( 'advanced_posts_blocks_template_part_directory', 'template-parts/blocks', $this->name );

		return trim( $template_part_dir, '/\\' );
	}

	/**
	 * Loads a template part into a template.
	 *
	 * @param string $slug The slug name for the generic template.
	 * @param string $name The name of the specialised template.
	 *
	 * @return string
	 */
	public function get_template_part( $slug, $name = null ) {
		ob_start();
		get_template_part( $slug, $name );
		$output = ob_get_contents();
		ob_end_clean();

		return $output;
	}

	/**
	 * Get content from template.
	 *
	 * Examples:
	 *
	 *   1. template-parts/blocks/advanced-posts-blocks/posts/post-{style}.php
	 *   2. template-parts/blocks/advanced-posts-blocks/posts/post.php
	 *   3. template-parts/blocks/advanced-posts-blocks/posts-{style}.php
	 *   4. template-parts/blocks/advanced-posts-blocks/posts.php
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return false|string
	 */
	protected function get_content_from_template( $attributes ) {
		$class_name = join( ' ', $this->get_class_names( $attributes ) );
		set_query_var( 'class_name', $class_name );
		$path = [
			$this->get_template_part_dir(),
			$this->name,
			$attributes['postType'],
		];

		$output = $this->get_template_part( join( '/', $path ), $this->get_style_name( $class_name ) );

		if ( ! $output ) {
			$path   = [
				$this->get_template_part_dir(),
				$this->name,
			];
			$output = $this->get_template_part( join( '/', $path ), $this->get_style_name( $class_name ) );
		}

		return $output;
	}

	/**
	 * Get component style name.
	 *
	 * @param string $class_name class strings.
	 *
	 * @return string
	 */
	protected function get_style_name( $class_name ) {
		$classes = explode( ' ', $class_name );
		$styles  = array_filter(
			$classes,
			function ( $class ) {
				return strpos( $class, 'is-style-' ) !== false;
			}
		);

		if ( ! empty( $styles ) && is_array( $styles ) ) {
			$style = reset( $styles );

			return str_replace( 'is-style-', '', $style );
		}

		return '';
	}
}
