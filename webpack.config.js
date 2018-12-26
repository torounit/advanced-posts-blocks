'use strict';
const nodeEnv = process.env.NODE_ENV;
const mode = nodeEnv ? nodeEnv : 'development';

function camelCaseDash( string ) {
  return string.replace(
    /-([a-z])/g,
    ( match, letter ) => letter.toUpperCase()
  );
}

const gutenbergPackages = [
  'a11y',
  'annotations',
  'api-fetch',
  'autop',
  'blob',
  'block-library',
  'block-serialization-default-parser',
  'block-serialization-spec-parser',
  'blocks',
  'components',
  'compose',
  'core-data',
  'data',
  'date',
  'deprecated',
  'dom',
  'dom-ready',
  'edit-post',
  'editor',
  'element',
  'escape-html',
  'format-library',
  'hooks',
  'html-entities',
  'i18n',
  'is-shallow-equal',
  'keycodes',
  'list-reusable-blocks',
  'notices',
  'nux',
  'plugins',
  'redux-routine',
  'rich-text',
  'shortcode',
  'token-list',
  'url',
  'viewport',
  'wordcount',
];

const externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  tinymce: 'tinymce',
  moment: 'moment',
  jquery: 'jQuery',
  lodash: 'lodash',
  'lodash-es': 'lodash',
};

gutenbergPackages.forEach( ( name ) => {
  externals[ `@wordpress/${ name }` ] = {
    window: [ 'wp', camelCaseDash( name ) ],
  };
} );

const enableSouceMap = mode === 'development' ? 'source-map' : false;

module.exports = [
  {
    mode: mode,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    devtool: enableSouceMap,
    externals,
    resolve: {
      extensions: [ '.js', '.jsx' ],
    },
    performance: { hints: false },
    entry: {
      main: [ './src/index.js' ],
    },
    output: {
      library: [ 'wp', '[name]' ],
      libraryTarget: 'window',
      path: __dirname + '/dist',
      publicPath: '/dist/',
    },
  },
];

