const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');

// Get environment variables to be loaded into frontend components
const env = dotenv.config().parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(env[next]);
	return prev;
}, {});

module.exports = {
	entry: [
		path.resolve(__dirname, 'js/main.jsx'),
		path.resolve(__dirname, 'node_modules/css-modal/modal.js'),
		path.resolve(__dirname, 'node_modules/purecss/build/pure-min.css'),
		path.resolve(__dirname, 'node_modules/purecss/build/grids-responsive-min.css'),
		path.resolve(__dirname, 'sass/custom.scss')
	],
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'public')
	},
	mode: 'development',
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.(j|t)sx$/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.tsx$/,
				use: {
					loader: 'ts-loader'
				}
			},
			{
				test: /modal\.js$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'js/[name].js'
					}
				}
			},
			{
				test: /\.(scss|css)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'file-loader',
						options: {
							name: 'css/[name].css'
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
}