const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: [
		path.resolve(__dirname, 'js/main.jsx'),
		path.resolve(__dirname, 'node_modules/purecss/build/pure-min.css'),
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
				test: /\.jsx$/,
				use: {
					loader: 'babel-loader'
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
					}
				]
			}
		]
	}
}