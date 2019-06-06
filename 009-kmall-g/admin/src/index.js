
//1.整个应用的入口
//2.因为在webpack-config.js中的入口指定该文件

//用React的语法解析文件
import React from 'react'; // const React = require('react')

//ReactDOM就是用来把组件挂载到DOM节点上
import ReactDOM from 'react-dom'; 

//整个应用的唯一stor,默认的会找目录下的index.html文件
import store from './store';

//Provider的作用是将整个应用的唯一store传递到所有的子组件
//注意:Provider组件的store属性用来指定整个应用的唯一store
import { Provider } from 'react-redux';

//react-redux作用:不用每次每个组件导入store,不用订阅函数,使得流程更清晰
//自己定义的组件，首字母必须大写
import App from './App'
ReactDOM.render(<Provider store={store}><App /></Provider>,
document.getElementById('root'))