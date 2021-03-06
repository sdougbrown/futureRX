/* eslint max-len: 0 */
import { resolve } from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

import {
  DEV,
  JS_REGEX,
  EXCLUDE_REGEX,
  AUTOPREFIXER_BROWSERS
} from '../constants'

const { BUILD_HASH = 'DEFAULT', SERVER } = process.env

const clean = (arr) => arr.filter(i => i !== false)

export default {
  module: {
    preLoaders: [
      { test: JS_REGEX, exclude: EXCLUDE_REGEX, loader: 'eslint' }
    ],

    loaders: [
      { test: /\.json$/, exclude: EXCLUDE_REGEX, loader: 'json' },
      { test: JS_REGEX, exclude: EXCLUDE_REGEX, loader: 'babel' },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?v=[0-9].[0-9].[0-9])?$/,
        loader: `file?name=[path][name]_${BUILD_HASH}.[ext]`
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loaders: clean([
          `file?name=[path][name]_${BUILD_HASH}.[ext]`,
          // optimize image for production client build
          !DEV && !SERVER && 'image-webpack?optimizationLevel=7&progressive&interlaced'
        ])
      },
      {
        test: /\.css$/,
        exclude: /global\.css$/,
        loaders: [
          'isomorphic-style',
          `css?sourceMap&modules&localIdentName=[name]_[local]_${BUILD_HASH}`,
          'postcss'
        ]
      },
      {
        test: /global\.css$/,
        loader: DEV ? 'style!css!postcss' : ExtractTextPlugin.extract('style', 'css!postcss')
      },
      { test: /\.md$/, loader: 'raw' }
    ]
  },

  postcss: (webpackInstance) => [
    require('postcss-import')({ addDependencyTo: webpackInstance }),
    require('postcss-url')(),
    require('precss')(),
    require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS })
  ],

  resolve: {
    extensions: [ '', '.js', '.json', '.jsx' ],
    modules: [ resolve('./'), 'node_modules' ]
  }
}
