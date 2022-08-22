import { memo } from '@wordpress/element';
import ServerSideRender from '@wordpress/server-side-render';
import BlockPlaceholder from './BlockPlaceholder';
import { Spinner } from '@wordpress/components';

const Render = memo( ( { name, attributes, emptyResponseLabel } ) => (
	<ServerSideRender
		block={ name }
		attributes={ attributes }
		LoadingResponsePlaceholder={ () => (
			<BlockPlaceholder>
				<Spinner />
			</BlockPlaceholder>
		) }
		EmptyResponsePlaceholder={ () => (
			<BlockPlaceholder>{ emptyResponseLabel }</BlockPlaceholder>
		) }
	/>
) );

export default Render;
