import { useSelect } from '@wordpress/data';

export const usePostTypes = () =>
	useSelect(
		( select ) => select( 'core' ).getPostTypes( { per_page: -1 } ) || [],
		[]
	);

export const usePostType = ( postType ) =>
	useSelect( ( select ) => select( 'core' ).getPostType( postType ) || {}, [
		postType,
	] );

export const usePostTypeTaxonomies = ( postType ) =>
	useSelect(
		( select ) =>
			( select( 'core' ).getTaxonomies() || [] ).filter( ( taxonomy ) => {
				const postTypeTaxonomies = postType.taxonomies || [];
				return postTypeTaxonomies.includes( taxonomy.slug );
			} ),
		[ postType ]
	);

export const usePosts = ( postType, query ) =>
	useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords(
				'postType',
				postType.slug,
				query
			) || [],
		[ postType, query ]
	);

export const useCurrentPostId = () =>
	useSelect( ( select ) => select( 'core/editor' ).getCurrentPostId(), [] );

export const useCurrentPostType = () =>
	useSelect( ( select ) => select( 'core/editor' ).getCurrentPostType(), [] );
