/**
 * 打包lib
 */
const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config.js')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = merge(webpackBaseConfig, {
    entry: {
        amuimap:'./src/index.js'
    },
    output:{
        path: path.resolve(__dirname, '../dist'),
        publicPath: '../',
        filename: '[name].v1.0.min.js',
        library: '[name]',//公开方式
        libraryTarget: 'umd',
        chunkFilename: 'commponents/[name].js',//按需打包
        umdNamedDefine: true
    },
    externals:{//方式
        jquery: "jQuery",
        iview: 'iview',
        vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue'
        }
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            parallel: true,
            sourceMap: false,
        }),
        new UglifyJsPlugin({
            parallel: true,
            sourceMap: true,
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
});
