<?php
/**
 * WP_Query fixer.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Blocks\Posts;

/**
 * Class Query
 *
 * @package Advanced_Posts_Blocks\Blocks\Posts
 */
class Query {

	/**
	 * Tax Query Term operator
	 *
	 * @var string
	 */
	private $term_operator = '';

	/**
	 * Query var
	 *
	 * @var string
	 */
	private $query_var = '';

	/**
	 * Query constructor.
	 *
	 * @param string $term_operator Term operator for tax_query. default: AND.
	 * @param string $query_var Query var. default: advanced_posts_blocks.
	 */
	public function __construct( $term_operator = 'AND', $query_var = 'advanced_posts_blocks' ) {
		if ( $query_var ) {
			$this->query_var = $query_var;
		}
		if ( $term_operator ) {
			$this->term_operator = $term_operator;
		}

		foreach ( get_post_types( [ 'show_in_rest' => true ], 'objects' ) as $post_type ) {
			add_filter( 'rest_' . $post_type->name . '_query', [ $this, 'rest_api_add_query_param' ], 10, 2 );
		}
		add_action( 'pre_get_posts', [ $this, 'pre_get_posts' ] );
	}

	/**
	 * Add query parameter to rest api.
	 *
	 * @param  array            $args The query arguments.
	 * @param  \WP_REST_Request $request Full details about the request.
	 *
	 * @return array $args.
	 **/
	public function rest_api_add_query_param( $args, $request ) {
		$args[ $this->query_var ] = ! empty( $request[ $this->query_var ] );

		return $args;
	}

	/**
	 * Change tax_query `operator` in the_wp_query
	 *
	 * @param \WP_Query $query The WP_Query instance (passed by reference).
	 */
	public function pre_get_posts( \WP_Query $query ) {
		$tax_query             = $query->get( 'tax_query' );
		$advanced_posts_blocks = $query->get( $this->query_var );
		if ( $advanced_posts_blocks && $tax_query ) {
			$tax_query = array_map(
				function ( $term_query ) {
					if ( ! is_array( $term_query ) ) {
						return $term_query;
					}
					if ( empty( $term_query['operator'] ) ) {
						$term_query['operator'] = $this->term_operator;
					}

					return $term_query;
				},
				$tax_query
			);
		}
		$query->set( 'tax_query', $tax_query );
	}
}
