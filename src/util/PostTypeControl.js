import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { usePostTypes } from './hooks';

const PostTypeControl = ( { onChange, value } ) => {
	const postTypes = usePostTypes().filter(
		( postType ) => ! [ 'attachment', 'wp_block' ].includes( postType.slug )
	);

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
