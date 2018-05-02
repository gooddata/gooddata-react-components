const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const getConfig = require('./server/src/utils/getConfig');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const backendShortcuts = {
    sec: 'https://secure.gooddata.com',
    secure: 'https://secure.gooddata.com',
    stg: 'https://staging.intgdc.com',
    stg2: 'https://staging2.intgdc.com',
    stg3: 'https://staging3.intgdc.com',
    demo: 'https://client-demo-be.na.intgdc.com',
    developer: 'https://developer.na.gooddata.com'
};

const defaultBackend = backendShortcuts.developer;


module.exports = async (env) => {
    const basePath = env && env.basePath || ''; // eslint-disable-line no-mixed-operators
    const backendParam = env ? env.backend : '';
    const backendUri = backendShortcuts[backendParam] || backendParam || defaultBackend;
    console.log('Backend URI: ', backendUri); // eslint-disable-line no-console

    const isProduction = process.env.NODE_ENV === 'production';

    const serverConfig = await getConfig()
        .catch((reason) => {
            // eslint-disable-next-line no-console
            console.warn(`Invalid server config: ${reason}. You need to setup Node env variables USERNAME and PASSWORD
            for platform domain admin account in order for registration to work.
            See examples/server/.env.sample and use it as a template for .env
            that should be created in root of this repo (not in examples/server).
            You can still use examples, but the proxy to examples server will be disabled and therefore registration will not work.`);
        });

    console.log('resolve serverConfig', serverConfig);

    // TODO: backendUri should be the same as serverConfig.domain, but serverConfig might not be available
    const serverProxy = serverConfig ? {
        '/api-register': {
            target: `https://localhost:${serverConfig.port}/gdc-register`,
            secure: false,
            pathRewrite: { '^/api-register': '' },
            onProxyReq: () => {
                console.log('Client req /api-register proxy to', `https://localhost:${serverConfig.port}/gdc-register`);
            }
        }
    } : {};

    const proxy = {
        '/gdc': {
            target: backendUri,
            secure: false,
            cookieDomainRewrite: '',
            onProxyReq: (proxyReq) => {
                if (proxyReq.method === 'DELETE' && !proxyReq.getHeader('content-length')) {
                    // Only set content-length to zero if not already specified
                    proxyReq.setHeader('content-length', '0');
                }

                // White labeled resources are based on host header
                proxyReq.setHeader('host', 'localhost:8999');
                proxyReq.setHeader('referer', backendUri);
                proxyReq.setHeader('origin', null);
            }
        },
        ...serverProxy
    };

    console.log('proxy', proxy);

    const resolve = {
        extensions: ['.js', '.jsx'],
        alias: {
            '@gooddata/react-components/styles': path.resolve(__dirname, '../styles/'),
            '@gooddata/react-components': path.resolve(__dirname, '../dist/')
        }
    };

    const plugins = [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'GoodData React Components'
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules|dist/,
            failOnError: true
        }),
        new webpack.DefinePlugin({
            BACKEND_URI: JSON.stringify(backendUri),
            BASEPATH: JSON.stringify(basePath),
            'process.env': {
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development')
            }
        })
    ];

    if (process.env.NODE_ENV === 'production') {
        const uglifyOptions = {
            mangle: true,
            compress: {
                sequences: true,
                dead_code: true,
                drop_debugger: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                warnings: false
            }
        };

        plugins.push(
            new webpack.optimize.OccurrenceOrderPlugin(),

            new webpack.optimize.ModuleConcatenationPlugin(),

            new UglifyJsPlugin({
                uglifyOptions,
                parallel: true
            }),
            new CompressionPlugin({
                asset: '[file].gz',
                algorithm: 'gzip'
            }),
            function collectStats() {
                this.plugin('done', (stats) => {
                    const filename = path.join(__dirname, 'dist', 'stats.json');
                    const serializedStats = JSON.stringify(stats.toJson(), null, '\t');
                    require('fs').writeFileSync(filename, serializedStats);
                });
            }
        );
    }

    return {
        entry: ['./src/index.jsx'],
        plugins,
        output: {
            filename: '[name].[hash].js',
            path: path.join(__dirname, 'dist'),
            publicPath: `${basePath}/`
        },
        devtool: isProduction ? false : 'cheap-module-eval-source-map',
        node: {
            __filename: true
        },
        devtool: isProduction ? false : 'cheap-module-eval-source-map',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    loaders: ['style-loader', 'css-loader']
                },
                {
                    test: /.scss$/,
                    loaders: ['style-loader', 'css-loader', 'sass-loader']
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules|update-dependencies/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.(jpe?g|gif|png|svg|ico|eot|woff2?|ttf|wav|mp3)$/,
                    use: 'file-loader'
                }
            ]
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            historyApiFallback: true,
            compress: true,
            port: 8999,
            stats: { chunks: false, assets: false, modules: false, hash: false, version: false },
            proxy
        },
        resolve
    };
};
