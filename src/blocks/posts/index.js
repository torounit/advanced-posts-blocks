/**
 * External dependencies
 */
import { isUndefined, pickBy, identity } from 'lodash';

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
/**
 * Internal dependencies
 */
import getEditComponent from './getEditComponent';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	usePostTypes,
	usePostType,
	usePostTypeTaxonomies,
	usePosts,
} from '../../util/hooks';

const name = 'advanced-posts-blocks/posts';
const title = __( 'Multiple Posts', 'advanced-posts-blocks' );
const EditComponent = getEditComponent( name, title );

const Edit = ( props ) => {
	const { attributes } = props;
	const {
		postsToShow,
		order,
		orderBy,
		postType: postTypeName,
		offset,
	} = attributes;
	const postTypes = usePostTypes();
	const selectedPostType = usePostType( postTypeName );
	const taxonomies = usePostTypeTaxonomies( selectedPostType );

	const taxQuery = {};
	for ( const taxonomy of taxonomies ) {
		const taxonomyTerms = attributes[ taxonomy.rest_base ];
		if ( Array.isArray( taxonomyTerms ) && taxonomyTerms.length > 0 ) {
			taxQuery[ taxonomy.rest_base ] = taxonomyTerms.filter( identity );
		}
	}
	const latestPostsQuery = pickBy(
		{
			...taxQuery,
			order,
			offset,
			orderby: orderBy,
			per_page: postsToShow,
			advanced_posts_blocks_preview: true,
		},
		( value ) => ! isUndefined( value )
	);

	const newProps = {
		...props,
		latestPosts: usePosts( selectedPostType, latestPostsQuery ),
		taxonomies,
		selectedPostType,
		postTypes: postTypes.filter(
			( postType ) =>
				! [ 'attachment', 'wp_block' ].includes( postType.slug )
		),
	};
	return <EditComponent { ...newProps } />;
};

registerBlockType( name, {
	title: `${ title } (Advanced Posts Blocks)`,
	description: __( 'Display multiple posts.', 'advanced-posts-blocks' ),
	keywords: [
		'multiple posts',
		__( 'multiple posts', 'advanced-posts-blocks' ),
	],
	icon: (
		//https://material.io/tools/icons/?icon=library_books&style=outline
		<SVG
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<Path fill="none" d="M0 0h24v24H0V0z" />
			<Path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
		</SVG>
	),
	category: 'widgets',
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
	},
	edit: Edit,

	save() {
		return null;
	},
} );
