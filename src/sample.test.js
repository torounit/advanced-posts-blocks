/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';

const inc = ( a ) => {
	return a + 1;
};

const square = ( a ) => {
	return a * a;
};

test( '(1 + 2) ^ 2 = 9', () => {
	expect( square( inc( 2 ) ) ).toBe( 9 );
	expect( compose( [ square, inc ] )( 2 ) ).toBe( 9 );
} );

test( '1 + 2 ^ 2 = 5', () => {
	expect( inc( square( 2 ) ) ).toBe( 5 );
	expect( compose( [ inc, square ] )( 2 ) ).toBe( 5 );
} );
