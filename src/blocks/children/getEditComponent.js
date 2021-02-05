/**
 * WordPress dependencies
 */
import {
	PanelBody,
	Placeholder,
	Spinner,
	SelectControl,
	Disabled,
	TreeSelect,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';
import { ServerSideRender } from '@wordpress/editor';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import QueryControls from '../../util/QueryControls';
import { buildTermsTree } from '../../util/terms';

const getEditComponent = ( blockName, blockTitle ) => {
	return ( {
		attributes,
		setAttributes,
		posts,
		children,
		postId,
		selectedPostType,
		postTypes,
	} ) => {
		const { order, orderBy, postsToShow } = attributes;
		const labels = selectedPostType.labels || {};

		const title = __( 'Query setting', 'advanced-posts-blocks' );

		const PostTypeControls = (
			<SelectControl
				label={ __( 'Post Type', 'advanced-posts-blocks' ) }
				value={ selectedPostType.slug }
				options={ postTypes.map( ( type ) => ( {
					label: type.name,
					value: type.slug,
				} ) ) }
				onChange={ ( postType ) => {
					setAttributes( {
						postType,
						orderBy: '',
					} );
				} }
			/>
		);
		const pagesTree = buildTermsTree(
			posts.map( ( item ) => ( {
				id: item.id,
				parent: item.parent,
				name: item.title.raw
					? item.title.raw
					: `#${ item.id } ${ __( '(no title)' ) }`,
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
					{ PostTypeControls }
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
		const hasPosts = Array.isArray( children ) && children.length;
		if ( ! hasPosts ) {
			return (
				<div { ...useBlockProps() }>
					{ inspectorControls }
					<Placeholder icon="admin-post" label={ blockTitle }>
						{ ! Array.isArray( children ) ? (
							<Spinner />
						) : (
							labels.not_found
						) }
					</Placeholder>
				</div>
			);
		}

		return (
			<div { ...useBlockProps() }>
				{ inspectorControls }
				<Disabled>
					<ServerSideRender
						block={ blockName }
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		);
	};
};

export default getEditComponent;
