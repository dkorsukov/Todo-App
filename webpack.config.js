let path = require("path");

let webpack = require("webpack");

let MiniCSSExtractPlugin = require("mini-css-extract-plugin"),
		HTMLWebpackPlugin = require("html-webpack-plugin"),
		ImageminWebpackPlugin = require('imagemin-webpack-plugin').default,
		UglifyJSWebpackPlugin = require("uglifyjs-webpack-plugin"),
		VueLoaderPlugin = require("vue-loader/lib/plugin");

let dev = process.env.NODE_ENV === "development";

module.exports = {
	mode: dev ? "development" : "production",

	entry: "./src/index.js",

	output: {
		path: path.resolve(__dirname, "build"),
		filename: dev ? "build.js" : "build.min.js"
	},

	devtool: dev ? "source-map" : "",

	devServer: {
		host: "localhost",
		port: 8080,
		hot: true
	},

  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
			"@components": path.resolve(__dirname, "src/components"),
			"@api": path.resolve(__dirname, "src/api/index.js")
    }
  },

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new HTMLWebpackPlugin({
			template: "./src/index.pug",
			filename: "index.html",
			minify: !dev
		}),
		new MiniCSSExtractPlugin({
			filename: dev ? "build.css" : "build.min.css"
		}),
		new VueLoaderPlugin(),
		new ImageminWebpackPlugin({
			disable: dev,
			test: /\.(png|jpg|jpeg)$/,
			pngquant: {
				quality: "90-100"
			}			
		})
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				use: ["babel-loader"]
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: {
					hotReload: true
				}
			},
			{
				test: /\.(css|sass|scss)$/,
				use: ["style-loader",
							MiniCSSExtractPlugin.loader,
							"css-loader",
							"postcss-loader",
							"sass-loader"]
			},
			{
				test: /\.pug$/,
				oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader']
          },
					{
						use: ["pug-loader"]
					}
				]
			},
			{
				test: /\.(png|jpg|jpeg)$/,
				use: {
					loader: "file-loader",
					options: {
						name: "[path][name].[ext]"
					}
				}
			},			
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: [{
					loader: "file-loader",
					options: {
						name: "./fonts/[name].[ext]"
					}
				}]
			}			
		]
	},
	
	optimization: {
		splitChunks: {
			chunks: "all"
		},
		minimizer: [
			new UglifyJSWebpackPlugin({
				test: /\.js$/,
      	sourceMap: true
			})	
		]
	}		
};