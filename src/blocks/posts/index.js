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
		//https://material.io/tools/icons/?icon=library_books&style=outline
		<SVG
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
		>
			<Path fill="none" d="M0 0h24v24H0V0z" />
			<Path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" />
		</SVG>
	),
	edit,
	save() {
		return null;
	},
} );
