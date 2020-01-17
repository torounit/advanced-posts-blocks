const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );
const glob = require( 'glob' );

const getEntries = () => {
	const srcDir = './src/blocks';
	const entries = {};
	glob.sync( '*/index.js', {
		cwd: srcDir,
	} ).forEach( ( key ) => {
		entries[ 'blocks/' + key.replace( '/index.js', '/index' ) ] = path.resolve( srcDir, key );
	} );
	return entries;
};

const entry = getEntries();
module.exports = {
	...defaultConfig,
	entry,
};
