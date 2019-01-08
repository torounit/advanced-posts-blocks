/**
 * External dependencies
 */
import { isUndefined, pickBy, identity } from 'lodash';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import getEditComponent from './getEditComponent';
import { select, subscribe, withSelect } from '@wordpress/data';
import { Path, SVG } from '@wordpress/components';

let postTypes = [];
const registerPostBlockType = () => {
	const name = 'advanced-posts-blocks/posts';
	const edit = getEditComponent( name );
	registerBlockType(
		name,
		{
			title: 'Advanced Posts Blocks',

			icon: <SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M4 6H2v16h16v-2H4V6zm18-4H6v16h16V2zm-3 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" /></SVG>,

			category: 'widgets',

			supports: {
				align: [ 'wide', 'full' ],
				html: false,
			},

			edit: withSelect( ( _, props ) => {
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
					advanced_posts_blocks: true,
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
