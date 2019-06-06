import {createStore,applyMiddleware} from 'redux'
import reducer from './reducer.js'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
//redux-logger协助开发调试用的
const middleware=[thunk];
if(process.env.NODE_ENV	!='production'){
	const logger=createLogger({});
	middleware.push(logger);
}


//redux-thunk让diapatch方法更高级，使得dispatch不仅可以可以接受一个对象，还可以接受一个函数
//通过接受到的函数完成发送ajax 的请求
//创建store
const store=createStore(reducer,applyMiddleware(...middleware));

export default store;