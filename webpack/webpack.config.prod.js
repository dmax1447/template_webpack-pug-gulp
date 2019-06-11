process.env.BUILD = 'prod';

const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const { rootDir } = require('./utils.js');

module.exports = webpackMerge(webpackConfigBase('prod'), {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1,
                        }
                    },
                    'postcss-loader',
                ],
            },
        ],
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin({
                parallel: true,
                extractComments: true,
            })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:8].css',
            chunkFilename: 'css/[id].[hash:8].css',
        }),
        new CleanWebpackPlugin(),
    ],
});