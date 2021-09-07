/**
 * External dependencies
 */
import { pickBy } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	Disabled,
	PanelBody,
	Placeholder,
	Spinner,
	TreeSelect,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import QueryControls from '../../util/QueryControls';
import { buildTermsTree } from '../../util/terms';
import PostTypeControl from '../../util/PostTypeControl';
import metadata from './block.json';
import {
	useCurrentPostId,
	useCurrentPostType,
	usePosts,
	usePostType,
} from '../../util/hooks';

const { name } = metadata;

const Edit = ( { attributes, setAttributes } ) => {
	const { postsToShow, order, orderBy, postType: postTypeName } = attributes;
	const { postId } = attributes;
	const currentPostType = useCurrentPostType();
	const currentPostId = useCurrentPostId();
	const selectedPostType = usePostType(
		postTypeName ? postTypeName : currentPostType
	);

	const posts = usePosts( selectedPostType, {
		orderby: orderBy,
		per_page: -1,
	} );
	const childPosts =
		usePosts(
			selectedPostType,
			pickBy(
				{
					order,
					parent: postId ? postId : currentPostId,
					orderby: orderBy,
					per_page: postsToShow,
					ignore_sticky_posts: 1,
				},
				( value ) => !! value
			)
		) || [];

	const labels = selectedPostType.labels || {};

	const title = __( 'Query setting', 'advanced-posts-blocks' );

	const pagesTree = buildTermsTree(
		posts.map( ( item ) => ( {
			id: item.id,
			parent: item.parent,
			name: item.title.raw
				? item.title.raw
				: `#${ item.id } ${ __(
						'(no title)',
						'advanced-posts-blocks'
				  ) }`,
		} ) )
	); //.filter( ( item ) => ( item.children.length ) );

	const fillWithChildren = ( terms ) => {
		return terms
			.map( ( term ) => {
				if ( term.children.length > 0 ) {
					return {
						...term,
						children: fillWithChildren( term.children ),
					};
				}
				return null;
			} )
			.filter( ( term ) => term );
	};
	const ParentControls = (
		<TreeSelect
			label={ labels.parent_item_colon }
			noOptionLabel={ `${ __(
				'(This Page)',
				'advanced-posts-blocks'
			) }` }
			tree={ fillWithChildren( pagesTree ) }
			selectedId={ postId }
			onChange={ ( value ) => {
				setAttributes( {
					postId: value ? parseInt( value ) : undefined,
				} );
			} }
		/>
	);

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ title }>
				<PostTypeControl
					value={ selectedPostType }
					filter={ ( { supports } ) => supports[ 'page-attributes' ] }
					onChange={ ( postType ) => {
						setAttributes( {
							postType: postType.slug,
						} );

						if (
							! postType?.supports[ 'page-attributes' ] &&
							orderBy === 'menu_order'
						) {
							setAttributes( {
								orderBy: metadata.attributes.orderBy.default,
							} );
						}
					} }
				/>
				{ ParentControls }
				<QueryControls
					postType={ selectedPostType }
					showAllPosts={ true }
					{ ...{ order, orderBy } }
					numberOfItems={ postsToShow }
					onOrderChange={ ( value ) =>
						setAttributes( { order: value } )
					}
					onOrderByChange={ ( value ) =>
						setAttributes( { orderBy: value } )
					}
					onNumberOfItemsChange={ ( value ) =>
						setAttributes( { postsToShow: value } )
					}
				/>
			</PanelBody>
		</InspectorControls>
	);
	const hasPosts = Array.isArray( childPosts ) && childPosts.length;
	return (
		<div { ...useBlockProps() }>
			{ inspectorControls }
			{ hasPosts ? (
				<Disabled>
					<ServerSideRender
						block={ name }
						attributes={ attributes }
					/>
				</Disabled>
			) : (
				<Placeholder
					icon="admin-post"
					label={ __( 'Child Posts', 'advanced-posts-blocks' ) }
				>
					{ ! Array.isArray( childPosts ) ? (
						<Spinner />
					) : (
						labels.not_found
					) }
				</Placeholder>
			) }
		</div>
	);
};

export default Edit;
