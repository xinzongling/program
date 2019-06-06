const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

//把css单独打包成一个文件,也就是说让css文件以link的形式引进来
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const publicPath = "/";
//导出配置
module.exports = {
	//模式
	mode:'development',
	//指定入口文件
	entry:'./src/index.js',	
	//指定出口
	output:{
		//出口文件名称
		filename:'[name].bundle.js',
    //输出路径
    publicPath:publicPath,
		//出口文件存储路径
		path:path.resolve(__dirname,'dist')
	},
  //配置别名 
  resolve:{ 
    alias:{ 
        pages:path.resolve(__dirname,'./src/pages'),
        util:path.resolve(__dirname,'./src/util'),
        api:path.resolve(__dirname,'./src/api'),
        common:path.resolve(__dirname,'./src/common'),
      } 
  },
	//配置loader
  module: {
    rules: [
    	//处理css文档的loader
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
            }
          },
          "css-loader"
        ]
      },
      //处理图片loader
	    {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
    	},
      {//处理js中含有html代码的loader
        test:/\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets:  ['env','es2015','react','stage-3'],//实现自定义路由
                //antd中的css,按需加载,防止引用了很多无用的css文件
                plugins: [
                   ["import",{ "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] 
              ]
            }
        }               
      }              
    ]
  },
  plugins: [
  	new HtmlWebpackPlugin({
  		template:'./src/index.html',//模板文件
  		filename:'index.html',
  		inject:true,//脚本写在那个标签里,默认是true(在body结束后)
  		hash:true//给生成的js/css文件添加一个唯一的hash
  	}),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({})
  ],
  devServer: {
    contentBase: './dist',
    port:3001,
    historyApiFallback:true//react路由,刷新页面时不会向后台发送请求
  }
}