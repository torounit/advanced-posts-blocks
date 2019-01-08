<?php
/**
 * View template.
 *
 * @package Advanced_Posts_Blocks
 *
 * @var string $class_name
 * @var WP_Query $query
 */
?>
<div class="wp-block-advanced-posts-block-post <?php echo esc_attr( $class_name ); ?>">
	<?php if ( $query->have_posts() ) : ?>
		<?php while ( $query->have_posts() ) : ?>
			<?php $query->the_post(); ?>
			<article>
				<h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
			</article>
		<?php endwhile; ?>
		<?php wp_reset_postdata(); ?>
	<?php endif; ?>
</div>
