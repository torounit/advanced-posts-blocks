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
		$this->assertXmlStringEqualsXmlString( "<div>$expect</div>", "<div>$actual</div>" );
	}

	public function tearDown() {
		parent::tearDown();
		wp_reset_postdata();
	}
}
