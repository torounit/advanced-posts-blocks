/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	Placeholder,
	SelectControl,
	Disabled,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ServerSideRender } from '@wordpress/editor';
import { InspectorControls } from '@wordpress/block-editor';

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
			<SelectControl
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
				<Fragment>
					{ inspectorControls }
					<Placeholder icon="admin-post" label={ blockTitle }>
						{ __( 'Post Not Found.', 'advanced-posts-blocks' ) }
					</Placeholder>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ inspectorControls }
				<Disabled>
					<ServerSideRender
						block={ blockName }
						attributes={ attributes }
					/>
				</Disabled>
			</Fragment>
		);
	};
};

export default getEditComponent;
