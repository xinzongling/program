const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');//处理html页面
const CleanWebpackPlugin = require('clean-webpack-plugin');//清除多余文件
//css单独打包成一个文件,也就是说让css以link的形式引入进来
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const publicPath = "/";

const getHtmlConfig = (name,title)=>({
    template:'./src/view/'+name+'.html',//模板文件
    filename:name+'.html',//输出的文件名
    title:title,//页面标题
    inject:true,//脚本写在那个标签里,默认是true(在body结束后)
    hash:true,//给生成的js/css文件添加一个唯一的hash
    chunks:['common',name]//使html页面只引入固定的css或js文件
})

module.exports = {
  //指定打包环境
  mode:'development',
  // mode:'production',
  //指定入口
  //单入口写法一
  entry:{
    //chunk名称:文件路径
    'common':'./src/pages/common/index.js',   
    'index':'./src/pages/index/index.js',   
    'user-login':'./src/pages/user-login/index.js',   
    'user-register':'./src/pages/user-register/index.js',   
    'result':'./src/pages/result/index.js',   
    'user-center':'./src/pages/user-center/index.js',
    'user-update-password':'./src/pages/user-update-password/index.js',
    'list':'./src/pages/list/index.js', 
    'detail':'./src/pages/detail/index.js',
    'cart':'./src/pages/cart/index.js',
    'order-confirm':'./src/pages/order-confirm/index.js',
    'payment':'./src/pages/payment/index.js',
    'order-list':'./src/pages/order-list/index.js',
    'order-detail':'./src/pages/order-detail/index.js'
  },
  //单入口写法二
  //entry: './src/index.js',
  //指定出口
  output: {
    //出口文件名称
    filename: 'js/[name].[hash].bundle.js',
    //输出路径
    publicPath:publicPath,
    //出口的文件所在的目录
    path: path.resolve(__dirname, 'dist')
  },
  //配置别名
    resolve:{
        alias:{
            pages:path.resolve(__dirname,'./src/pages'),
            util:path.resolve(__dirname,'./src/util'),
            common:path.resolve(__dirname,'./src/common'),
            service:path.resolve(__dirname,'./src/service'),
            node_modules:path.resolve(__dirname,'./node_modules'),
            images:path.resolve(__dirname,'./src/images')
        }
    },  
  module: {
    rules: [
    //处理css文件
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
      //处理图片 
      {
        test: /\.(png|jpg|gif|jpeg|ttf|woff2|woff|eot|svg)\??.*$/i,
        use: [
            {
              loader: 'url-loader',
              options: {
                  limit: 100,
                  name:'resource/[name].[ext]'
              }
            }
        ]
      },
    //babel 
      {
          test:/\.js$/,
          exclude: /(node_modules)/,
          use: {
              loader: 'babel-loader',
              options: {
                  presets: ['env','es2015','stage-3'],
              }
          }               
      },
      //处理tpl文件的loader
      {
          test:/\.tpl$/,
          use: {
              loader: 'html-loader',
          }               
      }             
    ]
  },
  plugins:[
      new htmlWebpackPlugin(getHtmlConfig('index','首页')),
      new htmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),     
      new htmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),     
      new htmlWebpackPlugin(getHtmlConfig('result','登录结果页')),     
      new htmlWebpackPlugin(getHtmlConfig('user-center','用户中心')),     
      new htmlWebpackPlugin(getHtmlConfig('user-update-password','用户修改密码')),
      new htmlWebpackPlugin(getHtmlConfig('list','商品列表')),             
      new htmlWebpackPlugin(getHtmlConfig('detail','商品详情')),             
      new htmlWebpackPlugin(getHtmlConfig('cart','购物信息')),             
      new htmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认')),             
      new htmlWebpackPlugin(getHtmlConfig('payment','订单支付')),             
      new htmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),             
      new htmlWebpackPlugin(getHtmlConfig('order-detail','订单详情')),             
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename:'css/[name].css'
      })
  ],
  devServer:{
    contentBase: './dist',//内容的目录
    port:3002,//服务运行的端口
    proxy: [{ //解决跨域的问题
      context: ['/user','/product','/cart','/shipping','/order','/payment'],
      target: 'http://127.0.0.1:3000',
    }]
  }     
};