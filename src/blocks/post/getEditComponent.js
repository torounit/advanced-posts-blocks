/**
 * WordPress dependencies
 */
import {
	PanelBody,
	Placeholder,
	ComboboxControl,
	Disabled,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ServerSideRender } from '@wordpress/editor';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import PostTypeControl from '../../util/PostTypeControl';

const getEditComponent = ( blockName, blockTitle ) => {
	return ( { attributes, setAttributes, posts, selectedPostType } ) => {
		const { postId } = attributes;

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
