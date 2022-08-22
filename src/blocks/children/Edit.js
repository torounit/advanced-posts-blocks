/**
 * WordPress dependencies
 */
import { Disabled, PanelBody, TreeSelect } from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import QueryControls from '../../components/QueryControls';
import { buildTermsTree } from '../../util/terms';
import PostTypeControl from '../../components/PostTypeControl';
import metadata from './block.json';
import { useCurrentPostType, usePosts, usePostType } from '../../util/hooks';
import { getBlockDefaultClassName } from '@wordpress/blocks';
import { omitClassNamesFromBlockProps } from '../../util/omitClassNamesFromBlockProps';
import Render from '../../components/Render';

const { name, title } = metadata;

const Edit = ( { attributes, setAttributes } ) => {
	const {
		postId,
		postsToShow,
		order,
		orderBy,
		postType: postTypeName,
		className,
	} = attributes;
	const currentPostType = useCurrentPostType();
	const selectedPostType = usePostType(
		postTypeName ? postTypeName : currentPostType
	);

	const posts = usePosts( selectedPostType, {
		orderby: orderBy,
		per_page: -1,
	} );

	const labels = selectedPostType.labels || {};

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
			<PanelBody title={ __( 'Query setting', 'advanced-posts-blocks' ) }>
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

	const blockDefaultClassName = getBlockDefaultClassName( name );
	const blockProps = omitClassNamesFromBlockProps( useBlockProps(), [
		blockDefaultClassName,
		className,
	] );

	return (
		<div { ...blockProps }>
			{ inspectorControls }
			<Disabled>
				<Render
					name={ name }
					attributes={ attributes }
					title={ title }
					emptyResponseLabel={ labels.not_found }
				/>
			</Disabled>
		</div>
	);
};

export default Edit;
