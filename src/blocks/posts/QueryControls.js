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
	onNumberOfItemsChange,
	onOrderChange,
	onOrderByChange,
	onOffsetChange,
	onIgnoreStickyPostsChange,
} ) {
	return [
		onOrderChange && onOrderByChange && (
			<SelectControl
				key="query-controls-order-select"
				label={ __( 'Order by' ) }
				value={ `${ orderBy }/${ order }` }
				options={ [
					{
						label: __( 'Newest to Oldest' ),
						value: 'date/desc',
					},
					{
						label: __( 'Oldest to Newest' ),
						value: 'date/asc',
					},
					{
						/* translators: label for ordering posts by title in ascending order */
						label: __( 'A → Z' ),
						value: 'title/asc',
					},
					{
						/* translators: label for ordering posts by title in descending order */
						label: __( 'Z → A' ),
						value: 'title/desc',
					},
				] }
				onChange={ ( value ) => {
					const [ newOrderBy, newOrder ] = value.split( '/' );
					if ( newOrder !== order ) {
						onOrderChange( newOrder );
					}
					if ( newOrderBy !== orderBy ) {
						onOrderByChange( newOrderBy );
					}
				} }
			/>
		),

		onNumberOfItemsChange && (
			<RangeControl
				key="query-controls-range-control"
				label={ __( 'Number of items' ) }
				value={ numberOfItems }
				onChange={ onNumberOfItemsChange }
				min={ minItems }
				max={ maxItems }
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
