/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import TermSelect from './TermSelect';

export default function TermsControls(
	{
		termList,
		taxonomy,
		selectedTermId,
		onTermChange,
	} ) {
	return [
		onTermChange && (
			<TermSelect
				noOptionLabel={ __( 'All' ) }
				multiple={ true }
				termList={ termList }
				label={ taxonomy.labels.name }
				selectedTermId={ selectedTermId }
				onChange={ onTermChange }
			/> ),

	];
}
