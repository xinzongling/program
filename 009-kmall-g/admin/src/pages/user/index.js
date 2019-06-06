import React,{ Component,Fragment } from 'react'
import { Table, Divider, Tag } from 'antd';
import { connect } from 'react-redux';
//在引入react时,moment会自动安装
import moment from 'moment'

import Layout from 'common/layout'

import './index.css'
import { actionCreator } from './store' 


//用户名，是否是管理员，email,phone,时间

/*
const dataSource = [{
  key: '1',
  username: '胡彦斌11',
  isAdmin: false,
  email: '3083483323.@qq.com',
  phone:'15649820287',
  creatAt:'2019-4-18 15:15:20'

}, {
  key: '2',
  username: '胡彦祖',
  isAdmin: false,
  email: '3083483323.@qq.com',
  phone:'15649820287',
  creatAt:'2019-4-18 15:15:20'
}];
*/


const columns = [{
  title: '用户名',
  dataIndex: 'username',
  key: 'username',
}, {
  title: '是否是管理员',
  dataIndex: 'isAdmin',
  key: 'isAdmin',
  render:(isAdmin)=>{
    if(isAdmin){
      return <span>是</span>  
    }else{
      return <span>否</span>  
    }
  }
}, {
  title: '电子邮箱',
  dataIndex: 'email',
  key: 'email',
}, {
  title: '电话号码',
  dataIndex: 'phone',
  key: 'phone',
}, {
  title: '创建日期',
  dataIndex: 'creatAt',
  key: 'creatAt',
}];


class User extends React.Component {
  constructor(props){
    super(props);
  } 
  componentDidMount(){
    this.props.handlePage();
  }
  render() {
    const {list,total,current,pageSize,handlePage,isFetching} =this.props;
      const dataSource=list.map((user)=>{
        return {
          key:user.get('_id'),
          username:user.get('username'),
          isAdmin:user.get('isAdmin'),
          email:user.get('email'),
          phone:user.get('phone'),
          creatAt:moment(user.get('creatAt')).format('YYYY-MM-DD HH:mm:ss')
        };
      }).toJS();
    return (
      <div className='User'>
          <Layout>
            <Table 
              dataSource={dataSource} 
              columns={columns}
              pagination={{total:total,current:current,pageSize:pageSize}}
              onChange={(page)=>{
                handlePage(page.current)
              }}
              loading={{
                  spinning:isFetching,
                  tip:'正在加载数据'
              }}
            />
          </Layout>
      </div>
    );
  }
}
const mapStateToProps=(state)=>{
  return {
    list:state.get('user').get('list'),
    total:state.get('user').get('total'),
    current:state.get('user').get('current'),
    pageSize:state.get('user').get('pageSize'),
    isFetching: state.get('user').get('isFetching')
  }
}
const mapDispatchToProps=(dispatch)=>{
   return {
      handlePage:(page)=>{
        const action=actionCreator.getPageAction(page);
        dispatch(action);
      }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(User);