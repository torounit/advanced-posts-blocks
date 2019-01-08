/**
 * External dependencies
 */
import { isUndefined, pickBy } from 'lodash';

import { registerBlockType } from '@wordpress/blocks';
import getEditComponent from './getEditComponent';
import { select, withSelect } from '@wordpress/data';
import { Path, SVG } from '@wordpress/components';

const name = 'advanced-posts-blocks/post';
const edit = getEditComponent( name );
registerBlockType(
	name,
	{
		title: 'Post (Advanced Posts Blocks)',

		icon: <SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M4 6H2v16h16v-2H4V6zm18-4H6v16h16V2zm-3 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" /></SVG>,

		category: 'widgets',

		supports: {
			html: false,
		},

		edit: withSelect( ( _, props ) => {
			const { attributes } = props;
			const { postType: postTypeName } = attributes;
			const { getEntityRecords, getPostType, getPostTypes } = select( 'core' );
			const postTypes = getPostTypes();
			const selectedPostType = getPostType( postTypeName );

			const PostsQuery = pickBy( {
				per_page: -1,
				advanced_posts_blocks: true,
			}, ( value ) => ! isUndefined( value ) );

			return {
				posts: getEntityRecords( 'postType', selectedPostType.slug, PostsQuery ) || [],
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
