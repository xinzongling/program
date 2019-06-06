import React,{ Component,Fragment } from 'react'
import { Card, Col, Row } from 'antd';
import { connect } from 'react-redux';


import Layout from 'common/layout'

import './index.css'
import { actionCreator } from './store' 

class Home extends React.Component {
  constructor(props){
    super(props);
  } 
  componentDidMount(){
    this.props.handleCount();
  }
  render() {
    return (
      <div className='Home'>
          <Layout>
            <div style={{ background: '#ECECEC', padding: '30px' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Card title="用户名" bordered={false}>{this.props.usernum}</Card>
                </Col>
                <Col span={8}>
                  <Card title="产品数量" bordered={false}>{this.props.productnum}</Card>
                </Col>
                <Col span={8}>
                  <Card title="订购数量" bordered={false}>{this.props.ordernum}</Card>
                </Col>
              </Row>
            </div>
          </Layout>
      </div>
    );
  }
}
const mapStateToProps=(state)=>{
  return {
    usernum:state.get('home').get('usernum'),
    productnum:state.get('home').get('productnum'),
    ordernum:state.get('home').get('ordernum'),
  }
}
const mapDispatchToProps=(dispatch)=>{
   return {
      handleCount:(values)=>{
        const action = actionCreator.getCountAction(values);
        dispatch(action);
      }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Home);



