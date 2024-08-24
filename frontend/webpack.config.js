const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.ttf$/i,
                type: 'asset/resource'
            },
            {
                test: /\.png$/i,
                type: 'asset/resource'
            },



        ],

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),

    new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates" },
                {from: "./src/static/fonts", to: "webfonts"},
                {from: "./src/static/img", to: "image"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "styles"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap-utilities.min.css", to: "styles"},
                {from: "./node_modules/js-datepicker/dist/datepicker.min.css", to: "styles"},
                {from: "./node_modules/js-datepicker/dist/datepicker.min.js", to: "js"},
            ],
        }),
    ],
};
