/**
 * External dependencies
 */
import { isUndefined, pickBy } from 'lodash';

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
import { usePosts, usePostType, usePostTypes } from '../../util/hooks';

const name = 'advanced-posts-blocks/post';
const title = __( 'Single Post', 'advanced-posts-blocks' );
const EditComponent = getEditComponent( name, title );

const Edit = ( props ) => {
	const { attributes } = props;
	const { postType: postTypeName } = attributes;
	const postTypes = usePostTypes();
	const selectedPostType = usePostType( postTypeName );
	const PostsQuery = pickBy( {
		per_page: -1,
		advanced_posts_blocks: true,
	}, ( value ) => ! isUndefined( value ) );

	const newProps = {
		...props,
		posts: usePosts( selectedPostType, PostsQuery ),
		selectedPostType,
		postTypes: postTypes
			.filter( ( postType ) => postType.viewable )
			.filter( ( postType ) => postType.rest_base !== 'media' ),
	};
	return <EditComponent { ...newProps } />;
};

registerBlockType(
	name,
	{
		title: `${ title } (Advanced Posts Blocks)`,

		description: __( 'Display single post.', 'advanced-posts-blocks' ),

		keywords: [ 'single post', __( 'single post', 'advanced-posts-blocks' ) ],

		icon: (
			//https://material.io/tools/icons/?icon=description&style=outline
			<SVG xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<Path fill="none" d="M0 0h24v24H0V0z" />
				<Path
					d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
			</SVG>
		),

		category: 'widgets',

		supports: {
			html: false,
		},

		edit: Edit,
		save() {
			return null;
		},
	}
);
