/**
 * 公共配置
 */
const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');
const utils = require('./utils')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
function resolve (dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    // 加载器
    module: {
        // https://doc.webpack-china.org/guides/migrating/#module-loaders-module-rules
        rules: [
            {
                // https://vue-loader.vuejs.org/en/configurations/extract-css.html
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        less: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                            fallback: 'vue-style-loader'
                        }),
                        css: ExtractTextPlugin.extract({
                            use: ['css-loader', 'autoprefixer-loader'],
                            fallback: 'vue-style-loader'
                        }),
                        scss: ExtractTextPlugin.extract({
                            use: ['css-loader', 'autoprefixer-loader', 'sass-loader'],
                            fallback: 'vue-style-loader'
                        })
                    },
                    postLoaders: {
                        html: 'babel-loader?sourceMap'
                    },
                    sourceMap: true,
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    sourceMap: true,
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loaders: ExtractTextPlugin.extract([
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        },
                    },
                    {
                        loader: 'autoprefixer-loader',
                    }
                ])
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                  limit: 100,
                  name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
              },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            },
              {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                  publicPath: './',
                  limit: 10000,
                  name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
              }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'ex': resolve('examples'),
        }
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ExtractTextPlugin('amuiLayout.css'),
        new webpack.DefinePlugin({
            'process.env.VERSION': `'${pkg.version}'`,
            'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
        }),
    ]
};
