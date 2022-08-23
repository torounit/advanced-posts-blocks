<?php
/**
 * Posts Renderer Class.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Blocks\Posts;

use WP_Post;
use WP_Taxonomy;

/**
 * Class Renderer
 *
 * Posts blocks.
 */
class Renderer extends \Advanced_Posts_Blocks\Blocks\Renderer {

	/**
	 * Path to the block.json dir.
	 *
	 * @var string
	 */
	protected $dirname = 'posts';

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->setup_term_attributes();
		parent::__construct();
	}

	/**
	 * Set term attributes.
	 */
	private function setup_term_attributes() {
		foreach ( get_taxonomies( array(), 'objects' ) as $taxonomy ) {
			$base                      = $this->get_rest_base( $taxonomy );
			$this->attributes[ $base ] = array(
				'anyOf'   => array(
					array(
						'title' => 'Term ids (v1)',
						'type'  => 'array',
						'items' => array(
							'type' => 'number',
						),
					),
					array(
						'title'      => 'Term object (v2)',
						'type'       => 'object',
						'properties' => array(
							'terms'    => array(
								'type'    => 'array',
								'items'   => array(
									'type' => 'number',
								),
								'default' => array(),
							),
							'relation' => array(
								'type'     => 'string',
								'required' => false,
								'default'  => 'AND',
							),
						),
					),
				),
				'default' => array(),
			);
		}
	}

	/**
	 * Get rest Base.
	 *
	 * @param WP_Taxonomy $taxonomy Taxonomy object.
	 *
	 * @return string
	 */
	public function get_rest_base( WP_Taxonomy $taxonomy ): string {
		return ! empty( $taxonomy->rest_base ) && is_string( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
	}

	/**
	 * Get taxonomies with connected.
	 *
	 * @param array|string|WP_Post $post_type Name of the type of taxonomy object, or an object (row from posts).
	 *
	 * @return WP_Taxonomy[]
	 */
	public function get_post_type_taxonomies( $post_type ): array {
		return array_map( 'get_taxonomy', get_object_taxonomies( $post_type ) );
	}

	/**
	 * Render callback
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return string|null
	 */
	public function render( array $attributes ): string {
		$args      = array(
			'posts_per_page'      => $attributes['postsToShow'],
			'post_status'         => 'publish',
			'ignore_sticky_posts' => $attributes['ignoreStickyPosts'],
			'order'               => $attributes['order'],
			'orderby'             => $attributes['orderBy'],
			'post_type'           => $attributes['postType'],
			'offset'              => $attributes['offset'],
			'nopaging'            => $attributes['showAllPosts'],
		);
		$post_type = $attributes['postType'];

		$args['tax_query'] = array();
		foreach ( $this->get_post_type_taxonomies( $post_type ) as $taxonomy ) {
			$base = $this->get_rest_base( $taxonomy );
			if ( ! $base ) {
				continue;
			}

			if ( ! isset( $attributes[ $base ] ) ) {
				continue;
			}

			if ( ! isset( $attributes[ $base ]['terms'] ) && is_array( $attributes[ $base ] ) ) {
				$attributes[ $base ] = array(
					'terms'    => $attributes[ $base ],
					'relation' => 'AND',
				);
			}

			/**
			 * @var int[] $terms
			 */
			$terms = array_filter( $attributes[ $base ]['terms'] );
			if ( ! empty( $terms ) ) {
				$tax_query = array();
				foreach ( $terms as $term ) {
					$tax_query[] = array(
						'taxonomy' => $taxonomy->name,
						'field'    => 'term_id',
						'terms'    => $term,
						'operator' => $term > 0 ? 'IN' : 'NOT IN',
					);
				}

				$args['tax_query'][]           = $tax_query;
				$args['tax_query']['relation'] = 'AND';
			}
		}

		$this->setup_query( $args );

		if ( ! $this->query->found_posts ) {
			return '';
		}

		$output = $this->get_content_from_template( $attributes );
		if ( $output ) {
			return $output;
		}

		if ( apply_filters( 'advanced_posts_blocks_use_default_template', true, $this->name ) ) {
			$output = $this->get_content_from_default_template( $this->name );
		}

		return $output;
	}
}
