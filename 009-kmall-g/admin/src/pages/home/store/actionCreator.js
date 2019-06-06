// as types 给action起个名字
import * as types from './actionTypes.js';
import axios from 'axios';
import { message } from 'antd';

import { request,setUserName } from 'util';
import { ADMIN_COUNT } from 'api';


const setCountAction = (data)=>{ 
 	return { 
 		type:types.SET_COUNT,
 		data:data 
 	} 
} 
export const getCountAction=(values)=>{
	return (dispatch)=>{ 		  
        request({ 
            url:ADMIN_COUNT
        })
        .then(result=>{ 
        	//console.log(result)
           	if(result.code==0){
           		const action=setCountAction(result.data);
           		dispatch(action);
           	}
        }) 	 
 	} 
}