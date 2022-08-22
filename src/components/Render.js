import { memo } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import BlockPlaceholder from './BlockPlaceholder';
import { Spinner } from '@wordpress/components';

const Render = memo( ( { name, attributes, title, emptyResponseLabel } ) => (
	<ServerSideRender
		block={ name }
		attributes={ attributes }
		LoadingResponsePlaceholder={ () => (
			<BlockPlaceholder>
				<Spinner />
			</BlockPlaceholder>
		) }
		EmptyResponsePlaceholder={ () => (
			<BlockPlaceholder title={ title }>
				{ emptyResponseLabel }
			</BlockPlaceholder>
		) }
	/>
) );

export default Render;
