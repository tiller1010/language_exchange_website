const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		main: path.resolve(__dirname, 'js/components/main.jsx')
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'public/js')
	},
	mode: 'development',
	module: {
		rules: [
			{
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
}
