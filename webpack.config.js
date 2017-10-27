/* eslint-disable */
'use strict'
const webpack = require('webpack')
const path = require('path')
const os = require('os')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')

let plugins = []
let test = /\.js?$/
let exclude = /node_modules/

module.exports = (env = {}) => {
  if (env.prod) {
    plugins = [
      new CleanWebpackPlugin(['build', '.cache-loader']),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new UglifyJSPlugin({
        cache: true,
        parallel: os.cpus().length - 1,
        sourceMap: true,
        uglifyOptions: {
          ecma: 8,
          compress: {
            warnings: true,
            dead_code: true
          },
          mangle: true,
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ]
  } else {
    plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      }),
    ]
  }
  return {
    context: __dirname,
    devtool: 'source-map',
    bail: true,
    cache: true,
    parallelism: 10,
    target: 'web',
    entry: {
      [env.out || 'bundle']: env.in
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
      publicPath: '/build/'
    },
    resolve: {
      extensions: ['.js']
    },
    externals: {
      'socket.io-client': 'io'
    },
    module: {
      rules: [
        {
          test,
          exclude,
          loader: 'cache-loader'
        },
        {
          enforce: 'pre',
          test,
          exclude,
          loader: 'eslint-loader',
          options: {
            cache: false,
            eslintPath: path.resolve(__dirname, 'node_modules/eslint'),
            options: {
              useEslintrc: true,
              emitError: true,
              emitWarning: true,
              failOnError: true,
            }
          }
        },
        {
          test,
          exclude,
          loader: 'ts-loader',
          options: {
            happyPackMode: true,
            getCustomTransformers: () => ({
              before: [tsImportPluginFactory([
                {
                  libraryName: 'antd',
                  libraryDirectory: 'es',
                  style: false,
                }
              ])]
            })
          }
        },
        {
          test,
          exclude,
          enforce: 'pre',
          loader: 'source-map-loader'
        },
      ]
    },
    plugins
  }
}
