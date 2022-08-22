/**
 * External dependencies
 */
import { uniqBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { ComboboxControl, Disabled, PanelBody } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/**
 * Internal dependencies
 */
import PostTypeControl from '../../components/PostTypeControl';
import metadata from './block.json';
import { usePosts, usePostType } from '../../util/hooks';
import { useSelect } from '@wordpress/data';
import { getBlockDefaultClassName } from '@wordpress/blocks';
import { omitClassNamesFromBlockProps } from '../../util/omitClassNamesFromBlockProps';
import Render from '../../components/Render';

const { name, title } = metadata;

const usePost = ( postType, id ) => {
	return useSelect(
		( select ) => {
			if ( ! id ) {
				return null;
			}

			return select( 'core' ).getEntityRecord(
				'postType',
				postType.slug,
				id
			);
		},
		[ postType, id ]
	);
};

const Edit = ( { attributes, setAttributes } ) => {
	const [ keyword, setKeyword ] = useState( '' );
	const { postId, className, postType: postTypeName } = attributes;
	const selectedPostType = usePostType( postTypeName );

	const selectedPost = usePost( selectedPostType, postId );

	let posts = usePosts( selectedPostType, {
		per_page: -1,
		advanced_posts_blocks: true,
		search: keyword,
	} );

	if ( selectedPost ) {
		posts = uniqBy( [ selectedPost, ...posts ], 'id' );
	}

	const PostControls = (
		<ComboboxControl
			help={ __( 'Select post', 'advanced-posts-blocks' ) }
			label={ __( 'Post', 'advanced-posts-blocks' ) }
			value={ postId }
			options={ [
				...posts.map( ( post ) => ( {
					label: `${ post.title.rendered } (ID: ${ post.id })`,
					value: post.id,
				} ) ),
			] }
			onFilterValueChange={ ( value ) => {
				setKeyword( value );
			} }
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
					onChange={ ( postType ) => {
						setAttributes( { postId: undefined } );
						setAttributes( { postType: postType.slug } );
					} }
				/>
				{ PostControls }
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
					emptyResponseLabel={ __(
						'Post Not Found.',
						'advanced-posts-blocks'
					) }
				/>
			</Disabled>
		</div>
	);
};

export default Edit;
