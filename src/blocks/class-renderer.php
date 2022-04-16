<?php
/**
 * Posts Renderer Class.
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Blocks;

use WP_Query;
use const Advanced_Posts_Blocks\PLUGIN_FILE;

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
	 * Path to the block.json dir.
	 *
	 * @var string
	 */
	protected $dirname = '';


	/**
	 * Attributes schema for blocks.
	 *
	 * @var array
	 */
	protected $attributes = array(
		'className' => array(
			'type' => 'string',
		),
	);

	/**
	 * The argument to be passed to the template.
	 *
	 * @var array
	 */
	protected $args = array();

	/**
	 * The WP_Query as passed to the template.
	 *
	 * @var WP_Query
	 */
	protected $query;

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
		$block      = register_block_type( dirname( PLUGIN_FILE ) . '/build/blocks/' . $this->dirname );
		$this->name = $block->name;
		$block->set_props(
			array(
				'attributes'      => array_merge( $block->attributes, $this->get_attributes() ),
				'render_callback' => array( $this, 'render' ),
			)
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
	 * @return string
	 */
	abstract public function render( array $attributes ): string;

	/**
	 * Get html class names.
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return array
	 */
	public function get_class_names( array $attributes ): array {
		$class_names = array();
		if ( ! empty( $attributes['className'] ) ) {
			$class_names = explode( ' ', $attributes['className'] );
		}
		if ( ! empty( $attributes['align'] ) ) {
			$class_names[] = 'align' . $attributes['align'];
		}

		return $class_names;
	}

	/**
	 * Set template arguments.
	 *
	 * @param string $key
	 * @param $value
	 */
	public function set_template_args( string $key, $value ) {
		$this->args[ $key ] = $value;
		set_query_var( $key, $value );
	}

	/**
	 * Get template part directory.
	 *
	 * @return string
	 */
	public function get_template_part_dir(): string {
		$template_part_dir = apply_filters( 'advanced_posts_blocks_template_part_directory', 'template-parts/blocks', $this->name );

		return trim( $template_part_dir, '/\\' );
	}

	/**
	 * Loads a template part into a template.
	 *
	 * @param string $slug The slug name for the generic template.
	 * @param string|null $name The name of the specialised template.
	 *
	 * @return string
	 */
	public function get_template_part( string $slug, ?string $name = null ): string {
		ob_start();
		get_template_part( $slug, $name, $this->args );
		$output = ob_get_contents();
		ob_end_clean();

		return trim( $output );
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
	 * @return string
	 */
	protected function get_content_from_template( array $attributes ): string {
		$class_name = join( ' ', $this->get_class_names( $attributes ) );
		$this->set_template_args( 'class_name', $class_name );
		$path = array(
			$this->get_template_part_dir(),
			$this->name,
			$attributes['postType'],
		);

		$priority = has_filter( 'the_content', 'wpautop' );
		if ( false !== $priority && doing_filter( 'the_content' ) ) {
			remove_filter( 'the_content', 'wpautop', $priority );
		}

		$output = $this->get_template_part( join( '/', $path ), $this->get_style_name( $class_name ) );

		if ( ! $output ) {
			$path   = array(
				$this->get_template_part_dir(),
				$this->name,
			);
			$output = $this->get_template_part( join( '/', $path ), $this->get_style_name( $class_name ) );
		}

		if ( false !== $priority ) {
			add_filter( 'the_content', '_restore_wpautop_hook', $priority + 1 );
		}

		return $output;
	}

	/**
	 * Get fallback template path.
	 *
	 * @param string $name block name.
	 *
	 * @return string template path.
	 */
	private function get_default_template_path( string $name ): string {
		$block_path    = explode( '/', $name );
		$block_dir     = end( $block_path );
		$template_path = __DIR__ . '/' . $block_dir . '/template.php';

		/**
		 * Filters the fallback template file path.
		 *
		 * @param string $template_path The fallback template file.
		 * @param string $name block name.
		 * @param WP_Query $query WP_Query instance.
		 * @param array $args Template arguments.
		 *
		 * @since 0.8.0
		 */
		return apply_filters( 'advanced_posts_blocks_default_template_path', $template_path, $this->name, $this->query, $this->args );
	}

	/**
	 * Get content form default template.
	 *
	 * @param string $name Block name.
	 *
	 * @return false|string
	 */
	protected function get_content_from_default_template( string $name ) {
		$template = $this->get_default_template_path( $name );
		ob_start();
		load_template( $template, false, $this->args );
		$output = ob_get_contents();
		ob_end_clean();

		return $output;
	}

	/**
	 * Create \WP_Query and set $query.
	 *
	 * @param array $args URL query string or array of vars.
	 * @param string $query_var query var.
	 */
	protected function setup_query( array $args, string $query_var = 'query' ) {
		$args        = apply_filters( 'advanced_posts_blocks_posts_query', $args, $this->name );
		$this->query = new WP_Query( $args );
		$this->set_template_args( $query_var, $this->query );
	}

	/**
	 * Get component style name.
	 *
	 * @param string $class_name class strings.
	 *
	 * @return string
	 */
	protected function get_style_name( string $class_name ): string {
		$classes = explode( ' ', $class_name );
		$styles  = array_filter(
			$classes,
			function ( $class ) {
				return strpos( $class, 'is-style-' ) !== false;
			}
		);

		if ( ! empty( $styles ) ) {
			$style = reset( $styles );

			return str_replace( 'is-style-', '', $style );
		}

		return '';
	}
}
