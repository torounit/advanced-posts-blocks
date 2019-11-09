<?php
/**
 * Posts Renderer Class.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Blocks;

use const Advanced_Posts_Blocks\SCRIPT_HANDLE;

/**
 * Class Renderer
 *
 * Posts blocks.
 */
abstract class Renderer {

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
		'className'   => [
			'type' => 'string',
		],
	];

	/**
	 * Constructor
	 *
	 * @param string $name block name.
	 */
	public function __construct( string $name ) {
		if ( $name ) {
			$this->name = $name;
		}

		$this->register();
	}

	/**
	 * Regsiter Block Type.
	 */
	protected function register() {
		register_block_type(
			$this->name,
			[
				'editor_script'   => SCRIPT_HANDLE,
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
	 * Render callback
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return false|string
	 */
	abstract public function render( $attributes );

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
	 *   1. template-parts/blocks/advanced-posts-blocks/post/post-{style}.php
	 *   2. template-parts/blocks/advanced-posts-blocks/post/post.php
	 *   3. template-parts/blocks/advanced-posts-blocks/post-{style}.php
	 *   4. template-parts/blocks/advanced-posts-blocks/post.php
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

		$priority = has_filter( 'the_content', 'wpautop' );
		if ( false !== $priority && doing_filter( 'the_content' ) ) {
			remove_filter( 'the_content', 'wpautop', $priority );
		}

		$output = $this->get_template_part( join( '/', $path ), $this->get_style_name( $class_name ) );

		if ( ! $output ) {
			$path   = [
				$this->get_template_part_dir(),
				$this->name,
			];
			$output = $this->get_template_part( join( '/', $path ), $this->get_style_name( $class_name ) );
		}

		if ( false !== $priority ) {
			add_filter( 'the_content', '_restore_wpautop_hook', $priority + 1 );
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
