/**
 * External dependencies
 */
import { identity } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	Disabled,
	PanelBody,
	Placeholder,
	Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ServerSideRender from '@wordpress/server-side-render';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import QueryControls from '../../util/QueryControls';
import PostTypeControl from '../../util/PostTypeControl';
import TermControl from './TermControl';
import { usePosts, usePostType, usePostTypeTaxonomies } from '../../util/hooks';
import metadata from './block.json';

const { name } = metadata;

const Edit = ( { attributes, setAttributes } ) => {
	const {
		postsToShow,
		order,
		orderBy,
		postType: postTypeName,
		offset,
		ignoreStickyPosts,
		showAllPosts,
	} = attributes;

	const selectedPostType = usePostType( postTypeName );
	const taxonomies = usePostTypeTaxonomies( selectedPostType );

	const taxQuery = {};
	for ( const taxonomy of taxonomies ) {
		const taxonomyTerms = attributes[ taxonomy.rest_base ];
		if ( Array.isArray( taxonomyTerms ) && taxonomyTerms.length > 0 ) {
			taxQuery[ taxonomy.rest_base ] = taxonomyTerms.filter( identity );
		} else if ( taxonomyTerms?.terms && taxonomyTerms.terms?.length > 0 ) {
			taxQuery[ taxonomy.rest_base ] = taxonomyTerms.terms;
		}
	}
	const latestPosts = usePosts( selectedPostType, {
		...taxQuery,
		order,
		offset,
		orderby: orderBy,
		per_page: postsToShow,
		advanced_posts_blocks_preview: true,
	} );

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

	const title = __( 'Query setting', 'advanced-posts-blocks' );

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ title }>
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
	const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
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
					label={ __( 'Multiple Posts', 'advanced-posts-blocks' ) }
				>
					{ ! Array.isArray( latestPosts ) ? (
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
