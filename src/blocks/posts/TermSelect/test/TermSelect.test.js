/**
 * External dependencies
 */
import renderer from 'react-test-renderer';
/**
 * Internal dependencies
 */
import TermSelect from '../index';

test( 'TermSelect Multiple', () => {
	const termList = [
		{ id: 2232, parent: 0, name: 'term1', slug: 'term1' },
		{ id: 2245, parent: 2232, name: 'term2', slug: 'term2' },
		{ id: 2249, parent: 0, name: 'term3', slug: 'term3' },
		{ id: 2246, parent: 2232, name: 'term4', slug: 'term4' },
	];
	const component = renderer.create(
		<TermSelect
			noOptionLabel={ 'All' }
			multiple={ true }
			termList={ termList }
			label={ 'Terms' }
			selectedTermId={ [ 2232 ] }
		/>,
	);
	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
