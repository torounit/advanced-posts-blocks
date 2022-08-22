import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { usePostTypes } from '../util/hooks';

const PostTypeControl = ( { onChange, value, filter = () => true } ) => {
	const postTypes = usePostTypes()
		.filter(
			( postType ) =>
				! [ 'attachment', 'wp_block' ].includes( postType.slug )
		)
		.filter( filter );

	return (
		<SelectControl
			label={ __( 'Post Type', 'advanced-posts-blocks' ) }
			value={ value.slug }
			options={ postTypes.map( ( type ) => ( {
				label: type.name,
				value: type.slug,
			} ) ) }
			onChange={ ( slug ) => {
				const postType = postTypes.find(
					( type ) => type.slug === slug
				);
				onChange( postType );
			} }
		/>
	);
};

export default PostTypeControl;
