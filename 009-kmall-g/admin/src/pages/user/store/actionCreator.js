// as types 给action起个名字
import * as types from './actionTypes.js';
import axios from 'axios';
import { message } from 'antd';

import { request,setUserName } from 'util';
import { GET_USERS } from 'api';



const getPageRequestAction = ()=>{
  return {
    type:types.PAGE_REQUEST
  }
}
const getPageDoneAction = ()=>{
  return {
    type:types.PAGE_DONE
  }
}

const setPageAction = (data)=>{ 
 	return { 
 		type:types.SET_PAGE,
 		data:data 
 	} 
} 
export const getPageAction=(page)=>{
	return (dispatch)=>{ 	
        dispatch(getPageRequestAction())	  
        request({ 
            url:GET_USERS,
            data:{
              page:page
            }
        })
        .then(result=>{ 
           	if(result.code==0){
           		const action=setPageAction(result.data);
           		dispatch(action);
           	}
        })
        .catch(err=>{
          console.log(err);
        }) 	
        .finally(()=>{
          dispatch(getPageDoneAction())
        }) 
 	} 
}