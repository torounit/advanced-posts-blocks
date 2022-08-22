import { Placeholder } from '@wordpress/components';

export default function BlockPlaceholder( { title, children } ) {
	return <Placeholder label={ title }>{ children }</Placeholder>;
}
