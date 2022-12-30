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
		path.resolve(__dirname, 'sass/custom.scss')
	],
	output: {
		filename: 'js/main.js',
		path: path.resolve(__dirname, 'public')
	},
	/* Actual Values */
	mode: process.env.APP_ENV ? process.env.APP_ENV : 'development',
	devtool: process.env.APP_ENV != 'production' ? 'source-map' : false,

	/* Test "Production" Locally Values */
	// mode: 'development',
	// devtool: 'source-map',
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
				test: /\.(scss|css)$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
            options: {
              sourceMap: true,
            }
					},
					{
						loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
					}
				]
			}
		]
	},
  plugins: [
    new webpack.DefinePlugin(envKeys)
  ]
}