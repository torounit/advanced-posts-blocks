/**
 * Internal dependencies
 */
import { buildTermsTree } from '../../../util/terms';
import { TreeSelect } from '@wordpress/components';

export default function TermSelect( { label, noOptionLabel, termList, selectedTermId, onChange, multiple } ) {
	const termsTree = buildTermsTree( termList );
	return (
		<TreeSelect
			{ ...{ label, noOptionLabel, onChange, multiple } }
			tree={ termsTree }
			selectedId={ selectedTermId }
		/>
	);
}
