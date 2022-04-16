<?php
/**
 * Class SampleTest
 *
 * @package Advanced_Posts_Blocks
 */

namespace Advanced_Posts_Blocks\Tests;

use WP_Query;
use WP_UnitTestCase;

/**
 * Sample test case.
 */
class Posts_Test extends WP_UnitTestCase {

	private function render_test_template( $query ) {
		ob_start();
		?>
		<div class="wp-block-advanced-posts-blocks-posts">
			<?php if ( $query->have_posts() ) : ?>
				<?php while ( $query->have_posts() ) : ?>
					<?php $query->the_post(); ?>

					<a href="<?php the_permalink(); ?>">
						<article>
							<h4><?php the_title(); ?></h4>
							<?php the_excerpt(); ?>
						</article>
					</a>

				<?php endwhile; ?>
				<?php wp_reset_postdata(); ?>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * A single example test.
	 */
	public function test_render() {
		$this->factory()->post->create_many( 2 );
		$query  = new WP_Query( array( 'post_type' => 'post' ) );
		$expect = $this->render_test_template( $query );
		$post   = $this->factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Posts Block Test',
				'post_excerpt' => 'posts block test',
				'post_content' => '<!-- wp:advanced-posts-blocks/posts {"postsToShow":2} /-->',
			)
		);
		$actual = apply_filters( 'the_content', get_the_content( null, false, $post ) ); // phpcs:ignore
		$this->assertXmlStringEqualsXmlString( $expect, $actual );
	}


	/**
	 * A single example test.
	 */
	public function test_render_with_category_and_tags() {
		$cat_ids = $this->factory()->category->create_many( 2 );
		$tag_ids = $this->factory()->tag->create_many( 2 );
		foreach ( $this->factory()->post->create_many( 2 ) as $post_id ) {
			wp_set_post_terms( $post_id, $cat_ids, 'category', true );
		}

		foreach ( $this->factory()->post->create_many( 2 ) as $post_id ) {
			wp_set_post_terms( $post_id, $tag_ids, 'post_tag', true );
		}

		$posts = $this->factory()->post->create_many( 2 );
		foreach ( $posts as $post_id ) {
			wp_set_post_terms( $post_id, $cat_ids, 'category', true );
			wp_set_post_terms( $post_id, $tag_ids, 'post_tag', true );
		}

		$query = new WP_Query(
			array(
				'post_type' => 'post',
				'post__in'  => $posts,
				'orderby'   => 'title',
				'order'     => 'ASC',
			)
		);
		$this->assertEquals( 2, $query->post_count );
		$expect = $this->render_test_template( $query );

		$post = $this->factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Posts Block Test',
				'post_excerpt' => 'posts block test',
				'post_content' => '<!-- wp:advanced-posts-blocks/posts {"categories":[' . join( ',', $cat_ids ) . '], "tags":[' . join( ',', $tag_ids ) . '], "order":"asc","orderBy":"title"} /-->',
			)
		);

		$actual = apply_filters( 'the_content', get_the_content( null, false, $post ) ); // phpcs:ignore
		$this->assertXmlStringEqualsXmlString( $expect, $actual );

		$post = $this->factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Posts Block Test',
				'post_excerpt' => 'posts block test',
				'post_content' => '<!-- wp:advanced-posts-blocks/posts {"categories":{"terms":[' . join( ',', $cat_ids ) . ']}, "tags":{"terms":[' . join( ',', $tag_ids ) . ']}, "order":"asc","orderBy":"title"} /-->',
			)
		);

		$actual = apply_filters( 'the_content', get_the_content( null, false, $post ) ); // phpcs:ignore
		$this->assertXmlStringEqualsXmlString( $expect, $actual );

		$post = $this->factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Posts Block Test',
				'post_excerpt' => 'posts block test',
				'post_content' => '<!-- wp:advanced-posts-blocks/posts {"categories":{"terms":[' . join( ',', $cat_ids ) . ']}, "tags":[' . join( ',', $tag_ids ) . '], "order":"asc","orderBy":"title"} /-->',
			)
		);

		$actual = apply_filters( 'the_content', get_the_content( null, false, $post ) ); // phpcs:ignore
		$this->assertXmlStringEqualsXmlString( $expect, $actual );
	}

	public function tear_down() {
		parent::tear_down();
		wp_reset_postdata();
	}
}
