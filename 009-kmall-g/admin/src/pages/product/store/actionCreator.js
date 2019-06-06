
import * as types from './actionTypes.js'
import { message } from 'antd'
import { request } from 'util'
import { 
  SAVE_PRODUCT,
  GET_PRODUCTS,
  UPDATE_PRODUCT_ORDER,
  UPDATE_PRODUCT_STATUS,
  GET_PRODUCT_DETAIL,
  SEARCH_PRODUCTS
} from 'api'

//把一级分类和二级分类的id存入store之中
export const getSetCategoryIdAction = (pid,id)=>{
  return {
    type:types.SET_CATEGORY_ID,
    payload:{
      parentCategoryId:pid,
      categoryId:id
    }
  } 
}

//把上传的图片存入store中进行管理
export const getSetImagesAction = (payload)=>{
  return {
    type:types.SET_IMAGES,
    payload
  } 
}

//把富文本编辑器的内容存入store中进行管理
export const getSetDetailAction = (payload)=>{
  return {
    type:types.SET_DETAIL,
    payload
  } 
}

const setCategoryError=()=>{
  return {
    type:types.SET_CATEGORY_ERROR
  } 
}
const setImagesError=()=>{
  return {
    type:types.SET_IMAGES_ERROR
  } 
}

//点击提交时,
const getSaveRequestAction = ()=>{
  return {
    type:types.SAVE_REQUEST
  }
}

//请求结束,后台返回数据时
const getSaveDoneAction = ()=>{
  return {
    type:types.SAVE_DONE
  }
}
//当点击提交时,首先加载图标,因此需要SAVE_REQUEST,然后把提交的内容发送给后台,
//当后台返回结果时,成功就返回商品首页,失败就返回错误页面,最终停止加载图标。
export const getSaveAction = (err,values)=>{
  return (dispatch,getState)=>{
    const state = getState().get('product');
    const category = state.get('categoryId');
    const images = state.get('images');
    const detail = state.get('detail');
    let hasError = false;
    if(err){
      hasError = true;
    }
    if(!category){
      dispatch(setCategoryError())
      hasError = true;
    }
    if(!images){
      dispatch(setImagesError())
      hasError = true;      
    }
    if(hasError){
      return;
    }
    dispatch(getSaveRequestAction())
    request({
      method:'post',
      url:SAVE_PRODUCT,
      data:{
        ...values,
        category,
        images,
        detail
      }
    })
    .then(result=>{
      if(result.code == 0){
        window.location.href="/product"
      }else{
        message.error(result.message)
      }
    })
    .finally(()=>{
      dispatch(getSaveDoneAction())
    })
  } 
}

//关于图标的加载
const getPageRequestAction = ()=>{
  return {
    type:types.PAGE_REQUEST
  }
}
//关于图标的加载
const getPageDoneAction = ()=>{
  return {
    type:types.PAGE_DONE
  }
}
const setPageAction = (payload)=>{
  return {
    type:types.SET_PAGE,
    payload
  }
}

//先加载图标,然后向后台请求数据,拿到数据后,通过setPageAction发送请求，
//拿到数据后,再向store发送action,最后停止加载图标
export const getPageAction = (page)=>{
  return (dispatch)=>{//page指当前是在哪一页
    dispatch(getPageRequestAction())
    request({
      url:GET_PRODUCTS,
      data:{
        page:page
      }
    })
    .then(result=>{
      if(result.code == 0){
        dispatch(setPageAction(result.data))
      }
    })
    .catch(err=>{
      console.log(err)
    })
    .finally(()=>{
      dispatch(getPageDoneAction())
    })
  }
}

//当改变排序输入框的值时,重新排序,拿到返回的数据后,显示排序成功
export const getUpdateOrderAction = (id,newOrder)=>{
  return (dispatch,getState)=>{
    const state = getState().get('product');
    request({
      method:'put',
      url:UPDATE_PRODUCT_ORDER,
      data:{
        id:id,
        order:newOrder,
        page:state.get('current')
      }
    })
    .then(result=>{
      if(result.code == 0){
        message.success('更新排序成功')
        dispatch(setPageAction(result.data))
      }
    })
  } 
}


//更新在售和下架,当后台返回结果时,需要再次向store发送set page 的action
export const getUpdateStatusAction = (id,newStatus)=>{
  return (dispatch,getState)=>{
    const state = getState().get('product');
    request({
      method:'put',
      url:UPDATE_PRODUCT_STATUS,
      data:{
        id:id,
        status:newStatus,
        page:state.get('current')
      }
    })
    .then(result=>{
      if(result.code == 0){
        message.success('更新状态成功')
        dispatch(setPageAction(result.data))
      }
    })
  } 
}
const setProductDetailAction = (payload)=>{ 
   return { 
     type:types.SET_PRODUCT_DETAIL, 
     payload 
   } 
 }  
export const getProductDetailAction = (productId)=>{ 
 return (dispatch,getState)=>{ 

   request({ 
     url:GET_PRODUCT_DETAIL, 
     data:{ 
       id:productId, 
     } 
   }) 
   .then(result=>{ 
     if(result.code == 0){

       dispatch(setProductDetailAction(result.data)) 
     } 
   }) 
 }  
} 
//搜索框

export const getSearchAction = (keyword,page)=>{
  return (dispatch)=>{
    request({
      url:SEARCH_PRODUCTS,
      data:{
        keyword:keyword,
        page:page
      }
    })
    .then(result=>{
      if(result.code == 0){
        dispatch(setPageAction(result.data))
      }else if(result.code == 1){
        message.error(result.message)
      }
    })
  }
}