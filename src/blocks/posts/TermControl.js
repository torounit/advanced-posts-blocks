import { useSelect } from '@wordpress/data';
import { FormTokenField } from '@wordpress/components';

const TermControl = ( { taxonomy, termIds, handleChange } ) => {
	const categories = (
		useSelect(
			( select ) => {
				return select( 'core' ).getEntityRecords(
					'taxonomy',
					taxonomy.slug,
					{
						per_page: -1,
					}
				);
			},
			[ taxonomy ]
		) ?? []
	).flatMap( ( category ) => {
		return [
			{
				id: category.id,
				name: category.name,
			},
			{
				id: category.id * -1,
				name: `- ${ category.name }`,
			},
		];
	} );
	const categoriesMapById = categories.reduce( ( acc, category ) => {
		return {
			...acc,
			[ category.id ]: category,
		};
	}, {} );
	const categoriesMapByName = categories.reduce( ( acc, category ) => {
		return {
			...acc,
			[ category.name ]: category,
		};
	}, {} );

	return categories && categories.length > 0 ? (
		<FormTokenField
			key={ taxonomy.rest_base }
			label={ taxonomy.labels.name }
			value={ termIds.map( ( categoryId ) => {
				return categoriesMapById[ categoryId ].name;
			} ) }
			suggestions={ categories.map( ( category ) => category.name ) }
			onChange={ ( newCategoryNames ) => {
				const categoryIds = newCategoryNames.map(
					( categoryName ) => categoriesMapByName[ categoryName ]?.id
				);
				if ( ! categoryIds.includes( undefined ) ) {
					handleChange( categoryIds );
				}
			} }
		/>
	) : null;
};

export default TermControl;
