/**
 * WordPress dependencies
 */
import {
	PanelBody,
	Placeholder,
	SelectControl,
	ComboboxControl,
	Disabled,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ServerSideRender } from '@wordpress/editor';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

const getEditComponent = ( blockName, blockTitle ) => {
	return ( {
		attributes,
		setAttributes,
		posts,
		selectedPostType,
		postTypes,
	} ) => {
		const { postId } = attributes;

		const PostTypeControls = (
			<SelectControl
				label={ __( 'Post Type', 'advanced-posts-blocks' ) }
				value={ selectedPostType.slug }
				options={ postTypes.map( ( type ) => ( {
					label: type.name,
					value: type.slug,
				} ) ) }
				onChange={ ( postType ) => {
					setAttributes( { postId: undefined } );
					setAttributes( { postType } );
				} }
			/>
		);
		const PostControls = (
			<ComboboxControl
				label={ __( 'Post' ) }
				value={ postId }
				options={ [
					{
						value: '',
						label: __( 'Select Post', 'advanced-posts-blocks' ),
					},
					...posts.map( ( post ) => ( {
						label: post.title.rendered,
						value: post.id,
					} ) ),
				] }
				onChange={ ( value ) => {
					setAttributes( {
						postId: value ? parseInt( value ) : undefined,
					} );
				} }
			/>
		);

		const title = __( 'Query setting', 'advanced-posts-blocks' );

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ title }>
					{ PostTypeControls }
					{ PostControls }
				</PanelBody>
			</InspectorControls>
		);

		if ( ! postId ) {
			return (
				<div { ...useBlockProps() }>
					{ inspectorControls }
					<Placeholder icon="admin-post" label={ blockTitle }>
						{ __( 'Post Not Found.', 'advanced-posts-blocks' ) }
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
