// (C) 2007-2019 GoodData Corporation
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");
const StatsPlugin = require("stats-webpack-plugin");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const backendShortcuts = {
    sec: "https://secure.gooddata.com",
    secure: "https://secure.gooddata.com",
    stg: "https://staging.intgdc.com",
    stg2: "https://staging2.intgdc.com",
    stg3: "https://staging3.intgdc.com",
    demo: "https://client-demo-be.na.intgdc.com",
    developer: "https://developer.na.gooddata.com",
};

const defaultBackend = backendShortcuts.developer;

function SimplestProgressPlugin() {
    let lastPercent = -10;
    return new webpack.ProgressPlugin(percent => {
        const percentInt = Math.ceil(percent * 100);
        if (percentInt >= lastPercent + 5) {
            lastPercent = percentInt;
            process.stderr.write(`${percentInt}% `);
        }
    });
}

module.exports = async (env, argv) => {
    const basePath = (env && env.basePath) || ""; // eslint-disable-line no-mixed-operators
    const backendParam = env ? env.backend : "";
    const backendUrl = backendShortcuts[backendParam] || backendParam || defaultBackend;
    console.log("Backend URI: ", backendUrl); // eslint-disable-line no-console

    const isProduction = argv.mode === "production";

    // see also production proxy at /examples/server/src/endpoints/proxy.js
    const proxy = {
        "/gdc": {
            changeOrigin: true,
            cookieDomainRewrite: "localhost",
            secure: false,
            target: backendUrl,
            headers: {
                host: backendUrl,
                origin: null,
            },
            onProxyReq(proxyReq) {
                proxyReq.setHeader("accept-encoding", "identity");
            },
        },
        "/api": {
            target: "http://localhost:3009",
            secure: false,
            onProxyReq: req => {
                console.log("proxy", "/gdc", req.path); // eslint-disable-line no-console
                if (req.method === "DELETE" && !req.getHeader("content-length")) {
                    // Only set content-length to zero if not already specified
                    req.setHeader("content-length", "0");
                }
                // eslint-disable-next-line no-console
                console.log(`Proxy ${req.path} to http://localhost:3009 (use: yarn examples-server)`);
            },
        },
    };

    const plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "GoodData React Components",
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules|dist/,
            failOnError: true,
        }),
        new webpack.DefinePlugin({
            BACKEND_URL: JSON.stringify(backendUrl),
            BASEPATH: JSON.stringify(basePath),
            MAPBOX_TOKEN: JSON.stringify(process.env.MAPBOX_TOKEN),
        }),
        new SimplestProgressPlugin(),
    ];

    if (isProduction) {
        plugins.push(new CompressionPlugin(), new StatsPlugin("stats.json"));
    }

    return {
        entry: ["./src/index.jsx"],
        plugins,
        output: {
            filename: "[name].[hash].js",
            path: path.join(__dirname, "dist"),
            publicPath: `${basePath}/`,
        },
        devtool: isProduction ? false : "cheap-module-eval-source-map",
        node: {
            __filename: true,
        },
        resolve: {
            extensions: [".js", ".jsx"],
            alias: {
                "@gooddata/react-components/styles": path.resolve(__dirname, "../styles/"),
                "@gooddata/react-components": path.resolve(__dirname, "../dist/"),
            },
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    loaders: ["style-loader", "css-loader"],
                },
                {
                    test: /.scss$/,
                    loaders: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules|update-dependencies/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                {
                    test: /\.(jpe?g|gif|png|svg|ico|eot|woff2?|ttf|wav|mp3)$/,
                    use: "file-loader",
                },
            ],
        },
        devServer: {
            contentBase: path.join(__dirname, "dist"),
            historyApiFallback: true,
            compress: true,
            port: 8999,
            stats: "errors-only",
            proxy,
        },
        stats: "errors-only",
    };
};
