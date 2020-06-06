/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	Placeholder,
	Spinner,
	SelectControl,
	Disabled,
	FormTokenField,
} from '@wordpress/components';
/**
 * Internal dependencies
 */
import QueryControls from './QueryControls';
import { __ } from '@wordpress/i18n';
import { ServerSideRender } from '@wordpress/editor';
import { InspectorControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

const getEditComponent = ( blockName, blockTitle ) => {
	return ( {
		className,
		attributes,
		setAttributes,
		latestPosts,
		taxonomies,
		selectedPostType,
		postTypes,
	} ) => {
		const {
			order,
			orderBy,
			postsToShow,
			offset,
			ignoreStickyPosts,
		} = attributes;
		const labels = selectedPostType.labels || {};

		const PostTypeControls = (
			<SelectControl
				label={ __( 'Post Type', 'advanced-posts-blocks' ) }
				value={ selectedPostType.slug }
				options={ postTypes.map( ( type ) => ( {
					label: type.name,
					value: type.slug,
				} ) ) }
				onChange={ ( postType ) => {
					setAttributes( { postType } );
				} }
			/>
		);

		const TermControls = taxonomies.map( ( taxonomy ) => {
			const termIds = attributes[ taxonomy.rest_base ];
			const {
				categories,
				categoriesMapById,
				categoriesMapByName,
			} = useSelect(
				( select ) => {
					const _categories = select( 'core' ).getEntityRecords(
						'taxonomy',
						taxonomy.slug,
						{
							per_page: -1,
						}
					);
					return {
						categories: _categories,
						..._categories?.reduce(
							( acc, category ) => ( {
								categoriesMapById: {
									...acc.categoriesMapById,
									[ category.id ]: category,
								},
								categoriesMapByName: {
									...acc.categoriesMapByName,
									[ category.name ]: category,
								},
							} ),
							{ categoriesMapById: {}, categoriesMapByName: {} }
						),
					};
				},
				[ taxonomy ]
			);
			return categories && categories.length > 0 ? (
				<FormTokenField
					key={ taxonomy.rest_base }
					label={ taxonomy.labels.name }
					value={ termIds.map( ( categoryId ) => {
						return categoriesMapById[ categoryId ].name;
					} ) }
					suggestions={ categories.map(
						( category ) => category.name
					) }
					onChange={ ( newCategoryNames ) => {
						const categoryIds = newCategoryNames.map(
							( categoryName ) =>
								categoriesMapByName[ categoryName ]?.id
						);
						if ( categoryIds.includes( undefined ) ) return;
						setAttributes( {
							[ taxonomy.rest_base ]: categoryIds,
						} );
					} }
				/>
			) : null;
		} );

		const title = __( 'Query setting', 'advanced-posts-blocks' );

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ title }>
					<QueryControls
						{ ...{ order, orderBy, offset, ignoreStickyPosts } }
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
					<Placeholder icon="admin-post" label={ blockTitle }>
						{ ! Array.isArray( latestPosts ) ? (
							<Spinner />
						) : (
							labels.not_found
						) }
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
	};
};

export default getEditComponent;
