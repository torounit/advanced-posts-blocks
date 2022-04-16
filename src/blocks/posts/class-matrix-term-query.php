<?php
/**
 * WP_Query fixer.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Blocks\Posts;

use WP_Query;
use WP_REST_Request;
use WP_Tax_Query;

/**
 * Class Query
 *
 * Fix Matrix Term Query.
 *
 * @package Advanced_Posts_Blocks\Blocks\Posts
 */
class Matrix_Term_Query {

	/**
	 * Query var
	 *
	 * @var string
	 */
	private $query_var = '';

	/**
	 * Query constructor.
	 *
	 * @param string $query_var Query var.
	 */
	public function __construct( string $query_var = 'advanced_posts_blocks_preview' ) {
		if ( $query_var ) {
			$this->query_var = $query_var;
		}

		foreach ( get_post_types( array( 'show_in_rest' => true ), 'objects' ) as $post_type ) {
			add_filter( 'rest_' . $post_type->name . '_query', array( $this, 'rest_api_add_query_param' ), 10, 2 );
		}
		add_action( 'parse_tax_query', array( $this, 'parse_tax_query' ), 9999 );
	}

	/**
	 * Add query parameter to rest api.
	 *
	 * @param array $args The query arguments.
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return array $args.
	 **/
	public function rest_api_add_query_param( array $args, WP_REST_Request $request ) : array {
		$args[ $this->query_var ] = ! empty( $request[ $this->query_var ] );

		return $args;
	}

	/**
	 * Change tax_query `operator` in the_wp_query
	 *
	 * @param WP_Query $query The WP_Query instance (passed by reference).
	 */
	public function parse_tax_query( WP_Query $query ) {
		$tax_query             = $query->get( 'tax_query' );
		$advanced_posts_blocks = $query->get( $this->query_var );
		if ( $advanced_posts_blocks && $tax_query ) {
			$new_tax_query = array();
			foreach ( $tax_query as $sub_query ) {
				if ( ! is_array( $sub_query ) ) {
					$new_tax_query[] = $sub_query;
					continue;
				}

				if ( ! empty( $sub_query['terms'] ) && is_array( $sub_query['terms'] ) ) {
					$new_tax_sub_query = array();
					foreach ( $sub_query['terms'] as $term ) {
						$new_tax_sub_query[] = array_merge(
							$sub_query,
							array(
								'terms'            => array( $term ),
								'include_children' => true,
							)
						);
					}
					$new_tax_sub_query['relation'] = 'AND';

					$new_tax_query[] = $new_tax_sub_query;
				}
			}
			$new_tax_query['relation'] = 'AND';
			$query->set( 'tax_query', $new_tax_query );
			$query->set( $this->query_var, false );
			$query->tax_query = new WP_Tax_Query( $new_tax_query );
		}
	}
}
