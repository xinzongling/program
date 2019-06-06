import React,{ Component,Fragment } from 'react'
import { Breadcrumb,Form, Icon, Input, Button, Checkbox,message,Select } from 'antd';

import { connect } from 'react-redux';

import Layout from 'common/layout'

import './index.css'
import { actionCreator } from './store' 


class CategoryAdd extends React.Component {
  constructor(props){
    super(props);
  } 
  componentDidMount(){
    this.props.getLevelOneCategories();
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('1:::,,,,',values)
        this.props.handleAdd(values);
      }
    });
  }

  render() {
    console.log('CategoryAdd...')
    const { getFieldDecorator } = this.props.form;
    const { isAddFetching,levelOneCategories } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 8,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 10,
        },
      },
    };
    return (
      <div className='User'>
          <Layout>
            <Breadcrumb>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>分类管理</Breadcrumb.Item>
              <Breadcrumb.Item>分类列表</Breadcrumb.Item>
            </Breadcrumb>
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
              <Form.Item {...formItemLayout} label="分类名称">
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入分类名称!' }],
                })(
                  <Input
                  placeholder="分类名称" />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="父级分类">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请选择父级分类!' }],
                })(
                  <Select style={{ width: 300 }}>
                      <Option value="0">根分类</Option>
                      {
                          levelOneCategories.map(category=>{
                              return <Option key={category.get('_id')} value={category.get('_id')}>根分类/{category.get('name')}</Option>
                          })
                      }
                  </Select>
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>          
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="login-form-button"
                  >
                  提交
                </Button>    
              </Form.Item>
            </Form>
          </Layout>
      </div>
    );
  }
}
CategoryAdd=Form.create({ name: 'normal_login' })(CategoryAdd);
const mapStateToProps = (state)=>{
    return {  
        isAddFetching: state.get('category').get('isAddFetching'),    
        levelOneCategories: state.get('category').get('levelOneCategories'),    
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        handleAdd:(values)=>{
            const action = actionCreator.getAddAction(values);
            dispatch(action)
        },
        getLevelOneCategories:()=>{
            const action = actionCreator.getLevelOneCategoriesAction();
            dispatch(action)
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(CategoryAdd)



