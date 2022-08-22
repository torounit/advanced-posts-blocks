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
	 * Path to the block.json dir.
	 *
	 * @var string
	 */
	protected $dirname = 'children';

	/**
	 * Render callback
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return string
	 */
	public function render( array $attributes ) : string {
		$args = array(
			'posts_per_page' => $attributes['postsToShow'],
			'post_status'    => 'publish',
			'post_parent'    => $attributes['postId'] ? $attributes['postId'] : get_the_ID(),
			'order'          => $attributes['order'],
			'orderby'        => $attributes['orderBy'],
			'post_type'      => $attributes['postType'] ? $attributes['postType'] : get_post_type(),
		);

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
