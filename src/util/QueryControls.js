/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	CheckboxControl,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

const DEFAULT_MIN_ITEMS = 1;
const DEFAULT_MAX_ITEMS = 100;

export default function QueryControls( {
	numberOfItems,
	order,
	orderBy,
	offset,
	ignoreStickyPosts,
	maxItems = DEFAULT_MAX_ITEMS,
	minItems = DEFAULT_MIN_ITEMS,
	showAllPosts,
	postType,
	onNumberOfItemsChange,
	onOrderChange,
	onOrderByChange,
	onOffsetChange,
	onIgnoreStickyPostsChange,
	onshowAllPostsChange,
} ) {
	const orderbyOptions = [
		{
			label: __( 'Date', 'advanced-posts-blocks' ),
			value: 'date',
		},
		{
			label: __( 'Title', 'advanced-posts-blocks' ),
			value: 'title',
		},
	];

	return [
		onOrderByChange && (
			<SelectControl
				key="query-controls-order-by-select"
				label={ __( 'Order by', 'advanced-posts-blocks' ) }
				value={ orderBy }
				options={
					postType?.supports?.[ 'page-attributes' ]
						? [
								...orderbyOptions,
								{
									label: __(
										'Page Order',
										'advanced-posts-blocks'
									),
									value: 'menu_order',
								},
						  ]
						: orderbyOptions
				}
				onChange={ ( newOrderBy ) => {
					if ( newOrderBy !== orderBy ) {
						onOrderByChange( newOrderBy );
					}
				} }
			/>
		),

		onOrderChange && (
			<SelectControl
				key="query-controls-order-select"
				label={ __( 'Order', 'advanced-posts-blocks' ) }
				value={ order }
				options={ [
					{
						label: __( 'DESC', 'advanced-posts-blocks' ),
						value: 'desc',
					},
					{
						label: __( 'ASC', 'advanced-posts-blocks' ),
						value: 'asc',
					},
				] }
				onChange={ ( newOrder ) => {
					if ( newOrder !== order ) {
						onOrderChange( newOrder );
					}
				} }
			/>
		),

		! showAllPosts && onNumberOfItemsChange && (
			<RangeControl
				key="query-controls-range-control"
				label={ __( 'Number of items', 'advanced-posts-blocks' ) }
				value={ numberOfItems }
				onChange={ onNumberOfItemsChange }
				min={ minItems }
				max={ maxItems }
			/>
		),

		onIgnoreStickyPostsChange && (
			<CheckboxControl
				key="query-controls-nopaging-control"
				label={ __( 'Show all posts', 'advanced-posts-blocks' ) }
				checked={ showAllPosts }
				onChange={ onshowAllPostsChange }
			/>
		),

		onOffsetChange && (
			<RangeControl
				key="query-controls-offset-control"
				label={ __( 'Offset', 'advanced-posts-blocks' ) }
				value={ offset }
				onChange={ onOffsetChange }
				min={ 0 }
				max={ maxItems }
			/>
		),
		onIgnoreStickyPostsChange && (
			<CheckboxControl
				key="query-controls-ignore-sticky-posts-control"
				label={ __( 'Ignore sticky posts', 'advanced-posts-blocks' ) }
				checked={ ignoreStickyPosts }
				onChange={ onIgnoreStickyPostsChange }
			/>
		),
	];
}
