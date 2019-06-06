import * as types from './actionTypes.js';
import { fromJS } from 'immutable';

//用fromJS包装一个对象
const defaultState = fromJS({
  isAddFetching:false,
  isPageFetching:false,
  levelOneCategories:[],  
  list:[],
  current:1,
  pageSize:0,
  total:0,
  updateNameModalVisible:false,
  updateId:'',
  updateName:''
})
export default (state=defaultState,action)=>{
  if(action.type == types.SET_PAGE){
    return state.merge({
      list:fromJS(action.payload.list),
      current:action.payload.current,
      pageSize:action.payload.pageSize,
      total:action.payload.total        
    })
  }
  if(action.type == types.PAGE_REQUEST){
    return state.set('isPageFetching',true)
  }
  if(action.type == types.PAGE_DONE){
    return state.set('isPageFetching',false)
  }
  if(action.type == types.ADD_REQUEST){
    return state.set('isAddFetching',true)
  }
  if(action.type == types.ADD_DONE){
    return state.set('isAddFetching',false)
  }
  if(action.type == types.SET_LEVEL_ONE_CATEGORIES){
    return state.set('levelOneCategories',fromJS(action.payload))
  }
  if(action.type == types.SHOW_UPDATE_NAME_MODAL){
    return state.merge({
      updateNameModalVisible:true,
      updateName:action.payload.updateName,
      updateId:action.payload.updateId
    })
  }
  if(action.type == types.CLOSE_UPDATE_NAME_MODAL){
    return state.set('updateNameModalVisible',false)
  }
  if(action.type == types.UPDATE_NAME_CHANGE){
    return state.set('updateName',action.payload)
  }     
  return state;
}