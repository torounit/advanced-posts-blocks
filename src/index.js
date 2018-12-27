/**
 * External dependencies
 */
import { isUndefined, pickBy, identity } from 'lodash';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import getEditComponent from './posts/getEditComponent';
import { select, withSelect, subscribe } from '@wordpress/data';

const { getPostTypes } = select( 'core' );

const registerPostBlockType = ( postType ) => {
	const name = `advanced-posts-blocks/${ postType.rest_base }`;
	const edit = getEditComponent( name );
	registerBlockType(
		name,
		{

			title: postType.labels.archives,

			icon: 'admin-post',

			category: 'common',

			supports: {
				html: false,
			},

			edit: withSelect( ( ownSelect, props ) => {
				const { attributes } = props;
				const { postsToShow, order, orderBy } = attributes;
				const { getEntityRecords, getTaxonomies } = select( 'core' );

				let taxonomies = getTaxonomies() || [];
				taxonomies = taxonomies.filter( ( taxonomy ) => {
					return postType.taxonomies.includes( taxonomy.slug );
				} );

				const taxQuery = {};
				for ( const taxonomy of taxonomies ) {
					const terms = attributes[ taxonomy.slug ];
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
					latestPosts: getEntityRecords( 'postType', postType.slug, latestPostsQuery ),
					taxonomies,
				};
			} )( edit ),

			save() {
				return null;
			},
		}
	);
};

const unsubscribe = subscribe( () => {
	const postTypes = getPostTypes();
	if ( postTypes ) {
		unsubscribe();
		postTypes
			.filter( ( postType ) => postType.viewable )
			.map( registerPostBlockType );
	}
} );

