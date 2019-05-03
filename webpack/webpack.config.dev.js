const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackConfigBase = require('./webpack.config.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const portfinder = require('portfinder');
const { rootDir } = require('./utils.js');

const webpackConfigDev = webpackMerge(webpackConfigBase('dev'), {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }, 'postcss-loader',
                ],
            },
        ],
    },
    devServer: {
        contentBase: rootDir('./public'),
        port: 8080,
        watchOptions: {
            poll: 1000,
        },
        stats: {
            children: false,
        },
        proxy: {
            '*': {
                bypass: function(req, res, proxyOptions) {
                    if (!req.url.endsWith('.html') && req.headers.accept.indexOf('text/html') !== -1) {
                        console.log(`bypass "${req.url}"; redirect to .html. You can change this in webpack\\webpack.config.dev.js`);
                        return req.url + '.html';
                    }
                }
            }
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
    ],
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = 8080;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            webpackConfigDev.devServer.port = port;
            resolve(webpackConfigDev);
        }
    });
});