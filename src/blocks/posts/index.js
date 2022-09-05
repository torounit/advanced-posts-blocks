/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
/**
 * Internal dependencies
 */
import edit from './Edit';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

const { name, supports, category } = metadata;
const title = __( 'Multiple Posts', 'advanced-posts-blocks' );

registerBlockType( name, {
	supports,
	category,
	title: `${ title } (Advanced Posts Blocks)`,
	description: __( 'Display multiple posts.', 'advanced-posts-blocks' ),
	keywords: [
		'multiple posts',
		__( 'multiple posts', 'advanced-posts-blocks' ),
	],
	icon: (
		//https://css.gg/stack
		<SVG
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path d="M20 4V16H22V2H8V4H20Z" fill="currentColor" />
			<Path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M2 8V22H16V8H2ZM14 10H4V20H14V10Z"
				fill="currentColor"
			/>
			<Path d="M17 7H5V5H19V19H17V7Z" fill="currentColor" />
		</SVG>
	),
	edit,
	save() {
		return null;
	},
} );
