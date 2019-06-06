import React,{ Component } from 'react'
import { Select } from 'antd';
import { request } from 'util'
import { GET_CATEGORIES } from 'api'
const Option = Select.Option;
class CategorySelector extends Component{
  constructor(props){
    super(props);
    this.state={
      levelOneCategories:[],
      levelOneId:'',
      levelTwoCategories:[],
      levelTwoId:'',
      isChanged:false,
      needLoadLevelTwo:false
    }
    this.handleLevelOneChange = this.handleLevelOneChange.bind(this)
    this.handleLevelTwoChange = this.handleLevelTwoChange.bind(this)
  }
  componentDidMount(){//组件加载完,向后台拿数据
    this.loadLevelOneCategories();
  }
  static getDerivedStateFromProps(props, state){//当state或props发生改变时触发该函数
    const { parentCategoryId,categoryId } = props;
    const levelOneIdChanged = parentCategoryId != state.levelOneId;
    const levelTwoIdChanged = categoryId != state.levelTwoId;
    //新增商品时,不更新state
    if(state.levelOneId && !parentCategoryId && !categoryId){
      return null;
    }
    //分类ID没有改变,不更新state
    if(!levelOneIdChanged && !levelTwoIdChanged){
      return null;
    }
    if(state.isChanged){
      return null;
    }
    //更新state
    if(parentCategoryId == 0){
      return {
        levelOneId:categoryId,
        levelTwoId:'',
        isChanged:true
      }
    }else{
      return {
        levelOneId:parentCategoryId,
        levelTwoId:categoryId,
        isChanged:true,
        needLoadLevelTwo:true
      }     
    }

    return null;
  }
  componentDidUpdate(){
    if(this.state.needLoadLevelTwo){
      this.loadLevelTowCategories();
      this.setState(()=>({needLoadLevelTwo:false}))
    }
  } 
  loadLevelOneCategories(){//向后台拿一级分类的数据
    request({
      url:GET_CATEGORIES,
      data:{
        pid:0     //传参数,告诉后台拿哪一个分类的数据,一级分类的id
      }
    })
    .then(result=>{  //拿到一级分类的数据,然后设置state，重新渲染页面
      if(result.code == 0){
        this.setState(()=>({levelOneCategories:result.data}))
      }
    })
  }
  handleLevelOneChange(value){//改变一级分类时,设置state,向后台拿二级分类的数据
    //console.log('value...',value)
    this.setState(()=>({levelOneId:value,levelTwoId:''}),()=>{
      this.loadLevelTowCategories()//当选了一级分类时,才会向后台请求二级分类的数据
      this.onValueChange()
    })
  }
  loadLevelTowCategories(){//向后台拿二级分类的数据
    request({
      url:GET_CATEGORIES,
      data:{
        pid:this.state.levelOneId //传参数,告诉后台该拿哪一个一级分类下的二级分类
      }
    })
    .then(result=>{//拿到二级分类的数据,然后设置state，重新渲染页面
      if(result.code == 0){
        this.setState(()=>({levelTwoCategories:result.data}))
      }
    })
  }
  handleLevelTwoChange(value){
    this.setState(()=>({levelTwoId:value}),()=>{
      this.onValueChange()
    })
  } 
  onValueChange(){ //把一级分类和二级分类的id传给父组件
    const { getCategoryId } = this.props//getCategoryId是从父组件传过来的方法
    const { levelOneId,levelTwoId} = this.state
    //console.log(levelOneId,levelTwoId)
    if(levelTwoId){
      getCategoryId(levelOneId,levelTwoId)//一参指父id,二参指子id
    }else{
      getCategoryId(0,levelOneId)
    }    
  }
    render(){
      //拿到一级分类和二级分类的数据和id
      const { levelOneCategories,levelTwoCategories,levelOneId,levelTwoId } = this.state;
      const { disabled } = this.props
      //用一级分类和二级分类的数据生成option
      const levelOneOptions = levelOneCategories.map(category=><Option key={category._id} value={category._id}>{category.name}</Option>)
      const levelTwoOptions = levelTwoCategories.map(category=><Option key={category._id} value={category._id}>{category.name}</Option>)
        return (
          <div className="CategorySelector">
            <Select 
              style={{width:200,marginRight:10}}
              onChange={this.handleLevelOneChange}
              value={levelOneId}
              disabled={disabled}
            >
              {levelOneOptions}
            </Select>
            {
              levelTwoOptions.length
              ?<Select 
                style={{width:200}}
                onChange={this.handleLevelTwoChange}
                value={levelTwoId}
                disabled={disabled}
               >
                {levelTwoOptions}
              </Select>
              : null 
            }
          </div>
        )
    }
}

export default CategorySelector