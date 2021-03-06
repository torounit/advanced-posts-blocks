<?php
/**
 * Posts Renderer Class.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Blocks\Post;

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
	protected $dir = __DIR__;

	/**
	 * Render callback
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return string
	 */
	public function render( array $attributes ) : string {
		if ( empty( $attributes['postId'] ) ) {
			return '';
		}
		$args = array(
			'p'         => $attributes['postId'],
			'post_type' => $attributes['postType'],
		);

		$this->setup_query( $args );
		$output = $this->get_content_from_template( $attributes );
		if ( $output ) {
			return $output;
		}

		$output = $this->get_content_from_default_template( $this->name );

		return $output;
	}
}
