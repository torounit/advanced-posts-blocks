<?php

namespace Advanced_Archive_Blocks;

/**
 * Class Renderer
 *
 * Dynamic custom block base.
 *
 * @package Advanced_Archive_Blocks
 */
abstract class Renderer {

	/**
	 * @var string $name Name for block.
	 */
	protected $name = '';

	/**
	 * @var array $attributes Attributes schema for blocks.
	 */
	protected $attributes = [
		'className' => [
			'type' => 'string',
		],
	];

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->register();
	}

	/**
	 * Regsiter Block Type.
	 */
	protected function register() {
		if ( function_exists( 'register_block_type' ) ) {
			register_block_type(
				$this->name,
				[
					'attributes'      => $this->get_attributes(),
					'render_callback' => [ $this, 'render' ],
				]
			);
		}
	}

	/**
	 * @return array
	 */
	public function get_attributes(): array {
		return $this->attributes;
	}

	/**
	 * Get content from template.
	 *
	 * @param $attributes
	 *
	 * @return false|string
	 */
	protected function get_content_from_template( $attributes ) {
		$class_name = '';
		if ( ! empty( $attributes['className'] ) ) {
			$class_name = $attributes['className'];
		}
		set_query_var( 'class_name', $class_name );
		ob_start();
		get_template_part( 'template-parts/blocks/' . $this->name, $this->get_style_name( $class_name ) );
		$output = ob_get_contents();
		ob_end_clean();

		return $output;
	}

	/**
	 * Get component style name.
	 *
	 * @param string $class_name
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

	/**
	 * @param array $attributes
	 *
	 * @return string
	 */
	abstract public function render( $attributes );

}

