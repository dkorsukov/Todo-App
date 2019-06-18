let path = require("path");

let webpack = require("webpack");

let MiniCSSExtractPlugin = require("mini-css-extract-plugin"),
		HTMLWebpackPlugin = require("html-webpack-plugin"),
		ImageminWebpackPlugin = require('imagemin-webpack-plugin').default,
		UglifyJSWebpackPlugin = require("uglifyjs-webpack-plugin"),
		VueLoaderPlugin = require("vue-loader/lib/plugin");

let dev = process.env.NODE_ENV === "development";

module.exports = {
	entry: "./src/index.js",

	output: {
		path: path.resolve(__dirname, "./build"),
		filename: "build.min.js"
	},

	devtool: dev ? "source-map" : "",

	devServer: {
		host: "http://192.168.1.4",
		port: 8080,
		overlay: true,
		hot: true
	},

  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
			"@components": path.resolve(__dirname, "src/components")
    }
  },

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HTMLWebpackPlugin({
			template: "./src/index.pug",
			filename: "index.html",
			minify: !dev
		}),
		new MiniCSSExtractPlugin({
			filename: "build.min.css"
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
					hotReload: dev
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
						name: "./images/[name].[ext]"
					}
				}
			},			
			{
				test: /\.(ttf|woff|woff2)$/,
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
      	sourceMap: true,
      	compress: {
      	  warnings: false
				}
			})	
		]
	}		
};