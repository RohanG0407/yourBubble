const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin");

let htmlPageNames = ['umass', 'map', 'uiuc', 'rpi', 'map', 'riskcalc'];
let multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: `./src/${name}.html`, // relative path to the HTML files
        filename: `${name}.html`, // output HTML files
        chunks: [`${name}`], // respective JS files
        minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true
        }
    })
});

module.exports = {
    mode: "development",

    entry: {
        main: "./src/js/index.js",
        umass: "./src/js/umass.js",
        uiuc: "./src/js/uiuc.js",
        rpi: "./src/js/rpi.js",
        map: "./src/js/map.js",
        riskcalc: "./src/js/map.js"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: ''
    },
    optimization: {
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new TerserPlugin(),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        new HtmlWebpackPlugin({
            template: `./src/index.html`,
            chunks: [`main`],
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true
            }
        })

    ].concat(multipleHtmlPlugins),

    module: {

        rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                  loader: "babel-loader"
              }

            },
            {
                test: /\.scss$/,
                //Reverse order is how it loads so SCSS -> CSS -> <script> injection
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                //Reverse order is how it loads so SCSS -> CSS -> <script> injection
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "assets/"
                    }
                }
            },
            {
                test: /\.ttf$/,
                use: [
                    {
                        loader: 'ttf-loader',
                        options: {
                            name: './fonts/[name].[ext]',
                        },
                    },
                ]
            }
        ]
    },

    devServer: {
        contentBase: [
            path.join(__dirname, '/src'),
        ],
        watchContentBase: true,
        compress: true,
        port: 9000,
        open: true,
    },


}
