<?php
/**
 * Class Renderer
 *
 * @package Advanced_Posts_Blocks
 */

use Advanced_Posts_Blocks\Blocks\Renderer;

/**
 * Test Renderer case.
 */
class Renderer_Test extends WP_UnitTestCase {

	public function testConcreteMethod() {
		$stub = $this->getMockForAbstractClass( Renderer::class );

		$stub->expects( $this->any() )
		     ->method( 'get_class_names' )
		     ->with( [] )
		     ->willReturn( '' );
	}
}
