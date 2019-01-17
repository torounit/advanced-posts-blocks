/**
 * External dependencies
 */
import { isUndefined, pickBy, identity } from 'lodash';

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import getEditComponent from './getEditComponent';
import { withSelect } from '@wordpress/data';
import { Path, SVG } from '@wordpress/components';

const name = 'advanced-posts-blocks/posts';
const edit = getEditComponent( name );

registerBlockType(
	name,
	{
		title: 'Posts (Advanced Posts Blocks)',

		icon: (
			//https://material.io/tools/icons/?icon=library_books&style=outline
			<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<Path fill="none" d="M0 0h24v24H0V0z" />
				<Path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
			</SVG>
		),

		category: 'widgets',

		supports: {
			align: [ 'wide', 'full' ],
			html: false,
		},

		edit: withSelect( ( select, props ) => {
			const { attributes } = props;
			const { postsToShow, order, orderBy, postType: postTypeName } = attributes;
			const { getEntityRecords, getTaxonomies, getPostType, getPostTypes } = select( 'core' );
			const postTypes = getPostTypes( { per_page: -1 } ) || [];
			const selectedPostType = getPostType( postTypeName ) || {};
			let taxonomies = getTaxonomies() || [];

			taxonomies = taxonomies.filter( ( taxonomy ) => {
				const postTypeTaxonomies = selectedPostType.taxonomies || [];
				return postTypeTaxonomies.includes( taxonomy.slug );
			} );

			const taxQuery = {};
			for ( const taxonomy of taxonomies ) {
				const terms = attributes[ taxonomy.rest_base ];
				if ( Array.isArray( terms ) && terms.length > 0 ) {
					taxQuery[ taxonomy.rest_base ] = terms.filter( identity );
				}
			}
			const latestPostsQuery = pickBy( {
				...taxQuery,
				order,
				orderby: orderBy,
				per_page: postsToShow,
				advanced_posts_blocks: true,
			}, ( value ) => ! isUndefined( value ) );
			return {
				latestPosts: getEntityRecords( 'postType', selectedPostType.slug, latestPostsQuery ) || [],
				taxonomies,
				selectedPostType,
				postTypes: postTypes
					.filter( postType => postType.viewable )
					.filter( postType => postType.rest_base !== 'media' ),
			};
		} )( edit ),

		save() {
			return null;
		},
	}
);
