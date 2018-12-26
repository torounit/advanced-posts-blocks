/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	SelectControl,
} from '@wordpress/components';

const createOptionsFromTermList = ( termList ) => {
	if ( Array.isArray ( termList ) )  {
		return [
			{ label: __( 'All' ), value: 0 },
			...termList.map( ( { id, name } ) => ( { label: name, value: id } ) ),
		];
	}
	return [
		{ label: __( 'All' ), value: 0 },
	];

};

export default function TermsControls(
	{
		termList,
		taxonomy,
		selectedTermId,
		onTermChange,
	} ) {
	return [
		onTermChange && (
			<SelectControl
				multiple={ true }
				options={ createOptionsFromTermList( termList ) }
				label={ taxonomy.labels.name }
				value={ selectedTermId }
				onChange={ onTermChange }
			/> ),

	];
}
