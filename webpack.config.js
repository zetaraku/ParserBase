const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	mode: 'development',
	node: {
		fs: 'empty',
		child_process: 'empty',
		net: 'empty',
		tls: 'empty',
		process: false
	},
	// watch: true,
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [
					'html-loader',
					{
						loader: 'pug-html-loader',
						options: {
							pretty: true,
							data: {
								example_cfgs_page: 'https://github.com/zetaraku/ParserBase/tree/master/example-cfgs',
							}
						},
					},
				]
			},
			{
				test: /\.scss$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader", options: {
						sourceMap: true
					}},
					{ loader: "sass-loader", options: {
						sourceMap: true
					}},
				]
			},
			// {
			// 	test: /\.js$/,
			// 	exclude: /(node_modules|bower_components)/,
			// 	use: [
			// 		{
			// 			loader: 'babel-loader'
			// 		}
			// 	]
			// }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template:'src/pug/index.pug',
			filename:'index.html',
		}),
	],
	resolve: {
		alias: {
			'~': path.resolve(__dirname)
		}
	}
};
