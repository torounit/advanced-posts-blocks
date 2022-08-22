import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';

export default function BlockPlaceholder( { children } ) {
	return (
		<Placeholder
			icon="admin-post"
			label={ __( 'Multiple Posts', 'advanced-posts-blocks' ) }
		>
			{ children }
		</Placeholder>
	);
}
