/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import {
	PanelBody,
	Placeholder,
	Spinner,
	SelectControl,
	Disabled,
} from '@wordpress/components';
/**
 * Internal dependencies
 */
import QueryControls from './QueryControls';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	ServerSideRender,
} from '@wordpress/editor';
import TermSelect from './TermSelect';

const getEditComponent = ( blockName, blockTitle ) => {
	return class extends Component {
		render() {
			const {
				className,
				attributes,
				setAttributes,
				latestPosts,
				taxonomies,
				selectedPostType,
				postTypes,
				terms,
			} = this.props;

			const { order, orderBy, postsToShow, offset } = attributes;
			const labels = selectedPostType.labels || {};

			const PostTypeControls = (
				<SelectControl
					label={ __( 'Post Type', 'advanced-posts-blocks' ) }
					value={ selectedPostType.slug }
					options={ postTypes.map( ( type ) => ( { label: type.name, value: type.slug } ) ) }
					onChange={ ( postType ) => {
						setAttributes( { postType } );
					} }
				/>
			);
			const TermControls = taxonomies.map( ( taxonomy ) => {
				return (
					<TermSelect
						key={ taxonomy.rest_base }
						noOptionLabel={ __( 'All' ) }
						multiple={ true }
						termList={ terms[ taxonomy.rest_base ] || [] }
						label={ taxonomy.labels.name }
						selectedTermId={ attributes[ taxonomy.rest_base ] }
						onChange={ ( value ) => {

							if ( ! Array.isArray( value ) ) {
								value = [ value ];
							}
							value = value.filter( ( e ) => e );
							setAttributes( { [ taxonomy.rest_base ]: value } );
						} }
					/>
				);
			} );

			const title = __( 'Query setting', 'advanced-posts-blocks' );

			const inspectorControls = (
				<InspectorControls>
					<PanelBody title={ title }>
						<QueryControls
							{ ...{ order, orderBy, offset } }
							numberOfItems={ postsToShow }
							onOffsetChange={ ( value ) => setAttributes( { offset: value } ) }
							onOrderChange={ ( value ) => setAttributes( { order: value } ) }
							onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
							onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
						/>
						{ PostTypeControls }
						{ TermControls }
					</PanelBody>
				</InspectorControls>
			);
			const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
			if ( ! hasPosts ) {
				return (
					<Fragment>
						{ inspectorControls }
						<Placeholder
							icon="admin-post"
							label={ blockTitle }
						>
							{ ! Array.isArray( latestPosts ) ?
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
