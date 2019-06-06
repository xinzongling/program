import React,{ Component } from 'react' 
import { Route,Switch } from "react-router-dom" 
import ProductSave from './save.js' 
import ProductList from './list.js' 
import ProductDetail from './detail.js' 
//save指的是点击添加商品后的首页
//list指的是点击商品管理后的首页
//productId来自list.js中的record.id
class Product extends Component{ 
   render(){ 
       return( 
           <Switch> 
               <Route path="/product/save/:productId?" component={ProductSave} /> 
               <Route path="/product/detail/:productId?" component={ProductDetail} />
               <Route path="/product/" component={ProductList} /> 
           </Switch> 
       ) 
   } 
} 

export default Product 
