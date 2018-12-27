/**
 * External dependencies
 */
import { isUndefined, pickBy, identity } from 'lodash';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import getEditComponent from './getEditComponent';
import { select, subscribe, withSelect } from '@wordpress/data';

let postTypes = [];
const registerPostBlockType = () => {
	const name = 'advanced-posts-blocks/posts';
	const edit = getEditComponent( name );
	registerBlockType(
		name,
		{
			title: 'Advanced Posts Blocks',

			icon: 'admin-post',

			category: 'common',

			supports: {
				align: [ 'wide', 'full' ],
				html: false,
			},

			edit: withSelect( ( ownSelect, props ) => {
				const { attributes } = props;
				const { postsToShow, order, orderBy, postType: postTypeName } = attributes;
				const { getEntityRecords, getTaxonomies, getPostType } = select( 'core' );
				const selectedPostType = getPostType( postTypeName );
				let taxonomies = getTaxonomies() || [];
				taxonomies = taxonomies.filter( ( taxonomy ) => {
					return selectedPostType.taxonomies.includes( taxonomy.slug );
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
				}, ( value ) => ! isUndefined( value ) );
				return {
					latestPosts: getEntityRecords( 'postType', selectedPostType.slug, latestPostsQuery ),
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
};

const unsubscribe = subscribe( () => {
	postTypes = select( 'core' ).getPostTypes();
	if ( postTypes ) {
		unsubscribe();
		registerPostBlockType();
	}
} );
