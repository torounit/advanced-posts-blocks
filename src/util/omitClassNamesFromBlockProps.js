/**
 * Flat classnames.
 *
 * @param {string[]} classNames classnames.
 *
 * @return {string[]} Classname array.
 */
const flatClassNames = ( classNames ) => {
	return classNames.flatMap( ( className ) => {
		if ( className ) {
			return className.split( ' ' );
		}
		return [];
	} );
};

/**
 * Omit target className from props.
 *
 * @param {Object}   blockProps block props.
 * @param {string[]} classNames classNames.
 *
 * @return {Object} blockProps.
 */
export const omitClassNamesFromBlockProps = ( blockProps, classNames = [] ) => {
	const flattenClassNames = flatClassNames( classNames );
	const { className: blockClassName } = blockProps;
	const blockClassNames = blockClassName ? blockClassName.split( ' ' ) : [];

	return {
		...blockProps,
		className: blockClassNames
			.filter(
				( className ) => ! flattenClassNames.includes( className )
			)
			.join( ' ' ),
	};
};
