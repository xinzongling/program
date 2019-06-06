import React, { Component } from 'react' 
import { connect } from 'react-redux' 
import { Breadcrumb, Button, Table, InputNumber, Divider, Modal, Input,Switch } from 'antd' 
const Search = Input.Search;

import { Link } from "react-router-dom" 
import { actionCreator } from './store' 
import Layout from 'common/layout' 

class ProductList extends Component { 
    componentDidMount() { 
        this.props.handlePage(1); 
    } 
    render(){ 
        const { 
            list, 
            current, 
            pageSize, 
            total, 
            handlePage, 
            isPageFetching, 
            handleUpdateOrder, 
            handleUpdateStatus,
            keyword,
            handleSearch 
        } = this.props; 
        const dataSource = list.map(product => { 
            return { 
                key: product.get('_id'), 
                id: product.get('_id'), 
                name: product.get('name'), 
                order: product.get('order'), 
                status: product.get('status')
            } 
         }).toJS() 
        const columns = [{ 
            title: 'id', 
            dataIndex: 'id', 
            key: 'id', 
        }, { 
            title: '商品名称', 
            dataIndex: 'name', 
            key: 'name',
            render:name=>{ //该方法的目的是当搜索关键词时,让关键词变为红色
                if(keyword){
                    const reg = new RegExp('('+keyword+')','ig'); 
                    //$1指的是keyword(第一个括号中的分组)
                    const html = name.replace(reg,"<b style='color:red'>$1</b>");
                     //dangerouslySetInnerHTML是为了让浏览器以html的格式进行解析 
                    return <span dangerouslySetInnerHTML={{__html:html}}></span>; 
                }else{ 
                    return name; 
                } 
            } 
        }, { 
            title: '排序', 
            dataIndex: 'order', 
            key: 'order', 
            render: (order, record) => <InputNumber  
                    defaultValue={order}  
                    onBlur={(ev)=>{//当鼠标的焦点离开数字输入框时,页面重新排序
                     //order之前的排序, 
//record是一个对象{key: "5cbda3e80a11a158807cfec2", id: "5cbda3e80a11a158807cfec2", name: "test2", order: 8, status: "0"}
                     //record实际上是对原来order的一个包装
                     //render方法会对函数中的第一个参数包装
                     //console.log('order...',order)
                     //console.log('record...',record)
                         handleUpdateOrder(record.id,ev.target.value) 
                    }} 
                /> 
        }, { 
            title: '状态', 
            dataIndex: 'status', 
            key: 'status', 
            render:(status,record)=><Switch  
                checkedChildren="在售"  
                unCheckedChildren="下架"  
                checked={status==0 ? true : false} 
                onChange={(checked)=>{//checked指当前的状态0:选择 1:没有选中
                 handleUpdateStatus(record.id,checked ? '0' : '1') 
                }}  
             /> 
        }, { 
            title: '操作', 
            dataIndex: 'action', 
            key: 'action', 
            render: (text, record) => ( 
                <span> 
                    <Link to={"/product/detail/"+record.id} >查看详情</Link> 
                    <Divider type="vertical" /> 
                    <Link to={"/product/save/"+record.id} >修改</Link>                    
                </span> 
            ), 
        }]; 
        return ( 
            <div className="ProductList"> 
            <Layout> 
                <Breadcrumb style={{ margin: '16px 0' }}> 
                    <Breadcrumb.Item>首页</Breadcrumb.Item> 
                    <Breadcrumb.Item>商品管理</Breadcrumb.Item> 
                    <Breadcrumb.Item>商品列表</Breadcrumb.Item> 
                </Breadcrumb> 
                <div className="clearfix">
                    <Search 
                        placeholder="请输入商品名称关键字"
                        onSearch={value => {
                            handleSearch(value);
                        }}
                        enterButton 
                        style={{ width: 300 }}                   
                    /> 
                    <Link style={{float:'right'}} to="/product/save"> 
                    <Button  type="primary" >添加商品</Button> 
                    </Link> 
                </div> 
                <Table  
                    dataSource={dataSource}  
                    columns={columns}  
                    pagination={{ 
                        current:current, 
                        pageSize:pageSize, 
                        total:total 
                    }} 
                    onChange={(page)=>{//当点击下一页或上一页时(改变页码)触发 
                    //page是一个对象，对象中有current,pageSize,total
                        if(keyword){ 
                            handleSearch(keyword,page.current) 
                        }else{ 
                            handlePage(page.current)  
                        } 
                    }} 
                    loading={{ 
                        spinning:isPageFetching, 
                        tip:'正在加载数据' 
                    }} 
                />                         
            </Layout> 
            </div> 
        ) 
    } 
} 
const mapStateToProps = (state) => { 
    return { //list为一个数组,数组中有每一个产品对象,
        list: state.get('product').get('list'), 
        current: state.get('product').get('current'), //当前第几页
        pageSize: state.get('product').get('pageSize'), //每页有多少条数据
        total: state.get('product').get('total'), //总共有多少条数据
        isPageFetching: state.get('product').get('isPageFetching'), //图标的加载
        keyword: state.get('product').get('keyword')
    } 
} 
 
const mapDispatchToProps = (dispath) => { 
    return { 
        handlePage: (page) => { //page指当前是在哪一页
            const action = actionCreator.getPageAction(page) 
            dispath(action) 
        }, 
        handleUpdateOrder: (id, newOrder) => { 
            const action = actionCreator.getUpdateOrderAction(id, newOrder) 
            dispath(action) 
        }, 
        handleUpdateStatus: (id, newStatus) => { //更新在售和下架
            const action = actionCreator.getUpdateStatusAction(id, newStatus) 
            dispath(action) 
        },
        handleSearch: (keyword,page) => {
            const action = actionCreator.getSearchAction(keyword,page)
            dispath(action)
        }         
    } 
} 

export default connect(mapStateToProps, mapDispatchToProps)(ProductList) 
