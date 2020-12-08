<?php
/**
 * Class SampleTest
 *
 * @package Advanced_Posts_Blocks
 */

/**
 * Sample test case.
 */
class Posts_Test extends WP_UnitTestCase {

	/**
	 * A single example test.
	 */
	public function test_render() {
		global $post;
		$this->factory()->post->create_many( 2 );
		ob_start();
		$query      = new WP_Query( array( 'post_type' => 'post' ) );
		$class_name = '';
		include dirname( __FILE__ ) . '/../../src/blocks/posts/template.php';
		$expect = ob_get_clean();
		wp_reset_postdata();

		$post   = $this->factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Posts Block Test',
				'post_excerpt' => 'posts block test',
				'post_content' => '<!-- wp:advanced-posts-blocks/posts {"postsToShow":2} /-->',
			)
		);
		$actual = apply_filters( 'the_content', get_the_content( null, false, $post ) );
		$this->assertXmlStringEqualsXmlString( $expect, $actual );
	}

	public function tearDown() {
		parent::tearDown();
		wp_reset_postdata();
	}

	/**
	 * A single example test.
	 */
	public function test_render_with_category() {
		global $post;
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

		ob_start();
		$query = new WP_Query(
			array(
				'post_type' => 'post',
				'post__in'  => $posts,
				'orderby'   => 'title',
				'order'     => 'ASC',
			)
		);
		$this->assertEquals( 2, $query->post_count );
		$class_name = '';
		include dirname( __FILE__ ) . '/../../src/blocks/posts/template.php';
		$expect = ob_get_clean();
		wp_reset_postdata();

		$post = $this->factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Posts Block Test',
				'post_excerpt' => 'posts block test',
				'post_content' => '<!-- wp:advanced-posts-blocks/posts {"categories":[' . join( ',', $cat_ids ) . '], "tags":[' . join( ',', $tag_ids ) . '], "order":"asc","orderBy":"title"} /-->',
			)
		);

		$actual = apply_filters( 'the_content', get_the_content( null, false, $post ) );
		$this->assertXmlStringEqualsXmlString( $expect, $actual );

		$post = $this->factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Posts Block Test',
				'post_excerpt' => 'posts block test',
				'post_content' => '<!-- wp:advanced-posts-blocks/posts {"categories":{"terms":[' . join( ',', $cat_ids ) . ']}, "tags":{"terms":[' . join( ',', $tag_ids ) . ']}, "order":"asc","orderBy":"title"} /-->',
			)
		);

		$actual = apply_filters( 'the_content', get_the_content( null, false, $post ) );
		$this->assertXmlStringEqualsXmlString( $expect, $actual );

		$post = $this->factory()->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Posts Block Test',
				'post_excerpt' => 'posts block test',
				'post_content' => '<!-- wp:advanced-posts-blocks/posts {"categories":{"terms":[' . join( ',', $cat_ids ) . ']}, "tags":[' . join( ',', $tag_ids ) . '], "order":"asc","orderBy":"title"} /-->',
			)
		);

		$actual = apply_filters( 'the_content', get_the_content( null, false, $post ) );
		$this->assertXmlStringEqualsXmlString( $expect, $actual );
	}
}
