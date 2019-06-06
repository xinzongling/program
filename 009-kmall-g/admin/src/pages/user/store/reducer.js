import * as types from './actionTypes.js';
import { fromJS } from 'immutable';

//用fromJS包装一个对象
const defaultState=fromJS({
	list:[{
  _id: '1',
  username: '胡彦祖11',
  isAdmin: false,
  email: '3083483323aa.@qq.com',
  phone:'15649820287',
  creatAt:'2019-4-18 15:15:20'
},{
  _id: '2',
  username: '胡彦祖22',
  isAdmin: false,
  email: '3083483323bb.@qq.com',
  phone:'15649820287',
  creatAt:'2019-4-18 15:15:20'
}],
    total:120,
    current:5,
    pageSize:10,
    isFetching:false  
})

export default (state=defaultState,action)=>{
	if(action.type == types.SET_PAGE){ 
 		return state.merge({//需要设置对象上多个属性,因此需要用到merge方法
			list:fromJS(action.data.list),
			total:action.data.total,
			current: action.data.current,
			pageSize:action.data.pageSize
 		}) 
 	}
  if(action.type == types.PAGE_REQUEST){
    return state.set('isFetching',true)
  }
  if(action.type == types.PAGE_DONE){
    return state.set('isFetching',false)
  } 
	return state;
}