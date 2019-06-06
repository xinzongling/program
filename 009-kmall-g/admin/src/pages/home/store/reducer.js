import * as types from './actionTypes.js';
import { fromJS } from 'immutable';

//用fromJS包装一个对象
const defaultState=fromJS({
	usernum:100,
	productnum:111,
	ordernum:2222
})

export default (state=defaultState,action)=>{
	if(action.type == types.SET_COUNT){ 
 		return state.merge({//需要设置对象上多个属性,因此需要用到merge方法
			usernum:action.data.usernum,
			productnum:action.data.productnum,
			ordernum:action.data.ordernum
 		}) 
 	} 
	return state;
}