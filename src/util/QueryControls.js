/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	RangeControl,
	SelectControl,
	CheckboxControl,
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
			label: __( 'Date' ),
			value: 'date',
		},
		{
			label: __( 'Title' ),
			value: 'title',
		},
	];

	return [
		onOrderByChange && (
			<SelectControl
				key="query-controls-order-by-select"
				label={ __( 'Order by' ) }
				value={ orderBy }
				options={
					postType?.supports[ 'page-attributes' ]
						? [
								...orderbyOptions,
								{
									label: __( 'Page Order' ),
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
				label={ __( 'Order' ) }
				value={ order }
				options={ [
					{
						label: __( 'DESC' ),
						value: 'desc',
					},
					{
						label: __( 'ASC' ),
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
				label={ __( 'Number of items' ) }
				value={ numberOfItems }
				onChange={ onNumberOfItemsChange }
				min={ minItems }
				max={ maxItems }
			/>
		),

		onIgnoreStickyPostsChange && (
			<CheckboxControl
				key="query-controls-nopaging-control"
				label={ __( 'Show all posts' ) }
				checked={ showAllPosts }
				onChange={ onshowAllPostsChange }
			/>
		),

		onOffsetChange && (
			<RangeControl
				key="query-controls-offset-control"
				label={ __( 'Offset' ) }
				value={ offset }
				onChange={ onOffsetChange }
				min={ 0 }
				max={ maxItems }
			/>
		),
		onIgnoreStickyPostsChange && (
			<CheckboxControl
				key="query-controls-ignore-sticky-posts-control"
				label={ __( 'Ignore sticky posts' ) }
				checked={ ignoreStickyPosts }
				onChange={ onIgnoreStickyPostsChange }
			/>
		),
	];
}
