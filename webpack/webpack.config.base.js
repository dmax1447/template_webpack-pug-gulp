const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const loaderUtils = require('loader-utils');

const { getEntries, rootDir } = require('./utils.js');

const entries = getEntries(rootDir('./src/pages/'), 'index', 'ts');
const pages = getEntries(rootDir('./src/pages/'), 'index', 'pug');
const outputPath = process.env.BUILD_OUTPUT || './dist';

/** isDev should be 'dev' or 'prod' */
module.exports = function (isDev = 'dev') {
    isDev = isDev !== 'prod';

    const htmlLoader = {
        loader: 'html-loader',
        options: {
            minimize: true,
            attrs: false,
        },
    };

    const pug = {
        test: /\.pug$/,
        // test: /(src\/pages\/.+\/.+\.pug$)|(src\\pages\\.+\\.+\.pug$)/,
        use: [
            htmlLoader,
            {
                loader: 'pug-html-loader',
                options: {
                    data: {
                        loaderUtils: loaderUtils,
                    }
                }
            },
        ]
    };

    const sass = {
        test: /\.(sa|sc|c)ss$/,
        use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    url: false,
                    importLoaders: 1,
                }
            },
            'postcss-loader',
            'sass-loader',
        ],
    };

    const typescript = {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/
    };

    const config = {
        entry: Object.assign(
            entries,
            { app: rootDir('./src/index.ts'), }
        ),
        output: {
            pathinfo: false,
            path: rootDir(outputPath),
            filename: 'js/[name].[hash:8].js',
            chunkFilename: 'js/[name].chunk.[chunkhash:8].js',
            publicPath: '',
        },
        resolve: {
            alias: {
                src: rootDir('./src')
            },
            extensions: ['.ts', '.js']
        },
        module: {
            rules: [
                pug,
                sass,
                typescript,
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.html$/,
                    use: [ htmlLoader ],
                },
                {
                    test: /\.(png|jpg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: 'images/[name].[md5:hash:hex:8].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|otf|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: 'fonts/[name].[md5:hash:hex:8].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(mp4|ogg|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/[name].[md5:hash:hex:8].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        parallelism: 8,
        optimization: {
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    commons: {
                        name: 'commons',
                        chunks: 'initial',
                        minChunks: 2,
                    },
                    vendors: {
                        chunks: 'initial',
                        name: 'vendors',
                        test: /node_modules\//,
                        minChunks: 5,
                        priority: 10,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: 'static' }
            ]),
        ],
    };

    for (const pathname in pages) {
        console.log(`pathname="${pathname}" pages[pathname]="${pages[pathname]}"`);
        // Configured to generate the html file, define paths, etc.
        const conf = {
            filename: `${pathname}.html`, // html output pathname
            template: `${pages[pathname]}`, // Template path
            inject: 'head',
            chunks: ['commons', 'vendors', 'app', pathname],
            chunksSortMode: 'manual',
        };
        config.plugins.push(new HtmlWebpackPlugin(conf));
    }

    return config;
}
