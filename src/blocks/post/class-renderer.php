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
		'postId'    => [
			'type' => 'number',
		],
		'postType'  => [
			'type'    => 'string',
			'default' => 'post',
		],
		'className' => [
			'type' => 'string',
		],
		'align'     => [
			'type' => 'string',
		],
	];

	/**
	 * Render callback
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return false|string
	 */
	public function render( $attributes ) {
		if ( empty( $attributes['postId'] ) ) {
			return '';
		}

		$query = new \WP_Query(
			[
				'p' => $attributes['postId'],
				'post_type' => 'any',
			]
		);
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
