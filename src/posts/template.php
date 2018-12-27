<?php
/**
 * @var string $class_name
 * @var WP_Query $query
 */
global $post;
?>
<div class="wp-block-advanced-posts-block-posts <?php echo esc_attr( $class_name ); ?>">
	<?php foreach ( $query->get_posts() as $post ) : ?>
		<article class="">
			<h4 class=""><a href="<?php the_permalink( $post ); ?>"><?php echo esc_html( get_the_title( $post ) ); ?></a></h4>
		</article>
	<?php endforeach; ?>
	<?php wp_reset_postdata(); ?>
</div>

