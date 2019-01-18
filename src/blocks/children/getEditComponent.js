/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import {
	PanelBody,
	Placeholder,
	Spinner,
	SelectControl,
	Disabled, TreeSelect,
} from '@wordpress/components';
import QueryControls from './QueryControls';
import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	ServerSideRender,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { buildTermsTree } from '../../util/terms';

const getEditComponent = ( blockName ) => {
	return class extends Component {
		render() {
			const { className, attributes, setAttributes, posts, children, postId, selectedPostType, postTypes } = this.props;
			const { order, orderBy, postsToShow } = attributes;
			const labels = selectedPostType.labels || {};

			const title = sprintf( __( '%s Block Seetting', 'advanced-posts-blocks' ), labels.name );

			const PostTypeControls = (
				<SelectControl
					label="PostType"
					value={ selectedPostType.slug }
					options={ postTypes.map( type => ( { label: type.name, value: type.slug } ) ) }
					onChange={ ( postType ) => {
						setAttributes( { postType } );
					} }
				/>
			);
			const pagesTree = buildTermsTree( posts.map( ( item ) => ( {
				id: item.id,
				parent: item.parent,
				name: item.title.raw ? item.title.raw : `#${ item.id } (${ __( 'no title' ) })`,
			} ) ) );//.filter( ( item ) => ( item.children.length ) );

			const fillWithChildren = ( terms ) => {
				return terms.map( ( term ) => {
					if ( term.children.length > 0 ) {
						return {
							...term,
							children: fillWithChildren( term.children ),
						};
					}
					return null;
				} ).filter( term => term );
			};

			const ParentControls = (
				<TreeSelect
					label={ 'Parent Post' }
					noOptionLabel={ `(${ __( 'Not Selected' ) })` }
					tree={ fillWithChildren( pagesTree ) }
					selectedId={ postId }
					onChange={ ( value ) => {
						setAttributes( { postId: value ? parseInt( value ) : undefined } );
					} }
				/>
			);

			const inspectorControls = (
				<InspectorControls>
					<PanelBody title={ title }>
						<QueryControls
							{ ...{ order, orderBy } }
							numberOfItems={ postsToShow }
							onOrderChange={ ( value ) => setAttributes( { order: value } ) }
							onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
							onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
						/>
						{ PostTypeControls }
						{ ParentControls }
					</PanelBody>
				</InspectorControls>
			);
			const hasPosts = Array.isArray( children ) && children.length;
			if ( ! hasPosts ) {
				return (
					<Fragment>
						{ inspectorControls }
						<Placeholder
							icon="admin-post"
							label={ labels.name }
						>
							{ ! Array.isArray( children ) ?
								<Spinner /> : labels.not_found
							}
						</Placeholder>
					</Fragment>
				);
			}

			return (
				<Fragment>
					{ inspectorControls }
					<Disabled>
						<ServerSideRender
							className={ className }
							block={ blockName }
							attributes={ attributes }
						/>
					</Disabled>
				</Fragment>
			);
		}
	};
};

export default getEditComponent;
