/**
 * WordPress dependencies
 */
import { Disabled, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { getBlockDefaultClassName } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import QueryControls from '../../components/QueryControls';
import PostTypeControl from '../../components/PostTypeControl';
import TermControl from './TermControl';
import { usePostType, usePostTypeTaxonomies } from '../../util/hooks';
import metadata from './block.json';
import { omitClassNamesFromBlockProps } from '../../util/omitClassNamesFromBlockProps';
import Render from '../../components/Render';

const { name, title } = metadata;

const Edit = ( { attributes, setAttributes } ) => {
	const {
		postsToShow,
		order,
		orderBy,
		postType: postTypeName,
		offset,
		ignoreStickyPosts,
		showAllPosts,
		className,
	} = attributes;

	const selectedPostType = usePostType( postTypeName );
	const taxonomies = usePostTypeTaxonomies( selectedPostType );

	const labels = selectedPostType.labels || {};

	const TermControls = taxonomies.map( ( taxonomy, i ) => {
		const termIds =
			attributes[ taxonomy.rest_base ]?.terms ??
			attributes[ taxonomy.rest_base ] ??
			[];
		return (
			<TermControl
				key={ i }
				taxonomy={ taxonomy }
				termIds={ termIds }
				handleChange={ ( value ) => {
					setAttributes( {
						[ taxonomy.rest_base ]: {
							terms: value,
						},
					} );
				} }
			/>
		);
	} );

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ __( 'Query setting', 'advanced-posts-blocks' ) }>
				<PostTypeControl
					value={ selectedPostType }
					onChange={ ( postType ) => {
						if (
							! postType?.supports[ 'page-attributes' ] &&
							orderBy === 'menu_order'
						) {
							setAttributes( {
								orderBy: metadata.attributes.orderBy.default,
							} );
						}
						setAttributes( {
							postType: postType.slug,
						} );
					} }
				/>
				{ TermControls }
				<QueryControls
					{ ...{
						order,
						orderBy,
						offset,
						ignoreStickyPosts,
						showAllPosts,
					} }
					postType={ selectedPostType }
					numberOfItems={ postsToShow }
					onOffsetChange={ ( value ) =>
						setAttributes( { offset: value } )
					}
					onOrderChange={ ( value ) =>
						setAttributes( { order: value } )
					}
					onOrderByChange={ ( value ) =>
						setAttributes( { orderBy: value } )
					}
					onNumberOfItemsChange={ ( value ) =>
						setAttributes( { postsToShow: value } )
					}
					onIgnoreStickyPostsChange={ ( value ) =>
						setAttributes( { ignoreStickyPosts: value } )
					}
					onshowAllPostsChange={ ( value ) => {
						setAttributes( { showAllPosts: value } );
					} }
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
