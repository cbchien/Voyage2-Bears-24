/* eslint-disable */
'use strict'
const webpack = require('webpack')
const path = require('path')
const os = require('os')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

let plugins = []
let test = /\.js?$/

module.exports = (env) => {
  if (!env.in) {
    console.log('No input file was specified.')
    process.exit(1)
  }
  if (env.prod) {
    plugins = [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"production"`
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new UglifyJSPlugin({
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          compress: {
            warnings: false
          }
        }
      })
    ]
  } else {
    plugins = [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': `"development"`
      })
    ]
  }
  return {
    context: __dirname,
    devtool: 'source-map',
    entry: {
      [env.out || 'bundle']: env.in
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
      publicPath: '/build/',
    },
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          test,
          loader: 'cache-loader'
        },
        {
          test,
          loader: 'thread-loader',
          options: { workers: os.cpus().length - 1 }
        },
        {
          test,
          loader: 'ts-loader',
          options: {
            entryFileIsJs: true,
            happyPackMode: true
          }
        },
        {
          test,
          enforce: 'pre',
          loader: 'source-map-loader'
        },
      ]
    },
    plugins
  }
}
