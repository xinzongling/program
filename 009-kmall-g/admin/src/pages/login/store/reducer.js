import * as types from './actionTypes.js';
import { fromJS } from 'immutable';

//用fromJS包装一个对象
const defaultState=fromJS({
	isFetching:false
})

//reducer 是一个函数，并且是一个纯函数(给固定的输入，就有固定的输出，并且不能改变参数)
export default (state=defaultState,action)=>{
	if(action.type == types.LOGIN_REQUEST){ 
 		//1.发送登录请求前把state里面的isFetching改为true并且返回一个新的数据 
 		//2.当数据返回给store时,执行组件中的mapStateToProps方法重新映射数据 
 		//3.UI组件中的this.props中的数据发生改变,导致UI页面发生改变 
 		return state.set('isFetching',true) 
 	} 
 	if(action.type == types.LOGIN_DONE){ 
 		return state.set('isFetching',false) 
 	}  
 	return state; 
}