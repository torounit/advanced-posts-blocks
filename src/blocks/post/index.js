/**
 * External dependencies
 */
import { isUndefined, pickBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import getEditComponent from './getEditComponent';
import { withSelect } from '@wordpress/data';
import { Path, SVG } from '@wordpress/components';

const name = 'advanced-posts-blocks/post';
const edit = getEditComponent( name );

registerBlockType(
	name,
	{
		title: ' Single Post (Advanced Posts Blocks)',

		icon: (
			//https://material.io/tools/icons/?icon=description&style=outline
			<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<Path fill="none" d="M0 0h24v24H0V0z" />
				<Path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
			</SVG>
		),

		category: 'widgets',

		supports: {
			html: false,
		},

		edit: withSelect( ( select, props ) => {
			const { attributes } = props;
			const { postType: postTypeName } = attributes;
			const { getEntityRecords, getPostType, getPostTypes } = select( 'core' );
			const postTypes = getPostTypes( { per_page: -1 } ) || [];
			const selectedPostType = getPostType( postTypeName ) || {};

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
