import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import getEditComponent from './posts/getEditComponent';
import { select } from '@wordpress/data';

const { getEntityRecords, getPostTypes, getTaxonomies } = select( 'core' );

const { subscribe } = wp.data;

const unsubscribe = subscribe( () => {
	const postTypes = getPostTypes();
	if ( postTypes ) {
		unsubscribe();
		postTypes
			.filter( ( postType ) => postType.viewable )
			.map( ( postType ) => {
			const name = `advanced-posts-blocks/${ postType.rest_base }`;
			registerBlockType(
				name,
				{
					title: postType.labels.postss,
					icon: 'admin-post',
					category: 'common',
					supports: {
						html: false,
					},
					edit: getEditComponent( name, postType ),
					save() {
						return null;
					},
				}
			);
		} );

	}
} );


