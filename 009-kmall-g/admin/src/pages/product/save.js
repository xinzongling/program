import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Form,
    Input,
    Breadcrumb,
    InputNumber,
    Row,
    Col,
    Button,
} from 'antd';

import CategorySelector from './category-selector.js'
import UploadImage from 'common/upload-image'
import RichEditor from 'common/rich-editor'

import { UPLOAD_PRODUCT_IMAGE,UPLOAD_PRODUCT_DETAIL_IMAGE } from 'api'
import { actionCreator } from './store'

import Layout from 'common/layout'

//指的是修改页面
//validateStatus提示信息的颜色
//help提示信息(文字)
class ProductSave extends Component {
    constructor(props) {
        super(props);
        this.state = {///productId指的是product/save/:productId地址上的参数
            productId:this.props.match.params.productId
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount(){
    	if(this.state.productId){
            this.props.handleProductDetail(this.state.productId)
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        //console.log('submit-value:::',values)
		//value是一个对象{name: "bvbc", description: "vcc", price: 5, stock: 5}
            values.id = this.state.productId; 
            this.props.handleSave(err,values)
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            handleCategoryId,
            handleImages,
            handleDetail,
            categoryIdValidateStatus,
            categoryIdHelp,
            imagesValidateStatus,
            imagesHelp,
            isSaveFetching,
            
            parentCategoryId,
            categoryId,
            images,
            detail,
            description,
            name,
            price,
            stock     
        } = this.props;

        const formItemLayout = {
            labelcol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrappercol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        let fileList = [];
        if(images){
        //images指的是上传网络后的图片(以逗号分隔的字符串,拿到每张图片的参数)
        //把images发送给子组件
            fileList = images.split(',').map((url,index)=>({
                uid:index,
                status: 'done',
                url:url,
                response:url
            }))
        }
        return (
            <div className="ProductSave">
                <Layout>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>商品管理</Breadcrumb.Item>
                        <Breadcrumb.Item>添加商品</Breadcrumb.Item>
                    </Breadcrumb>
                    <Form {...formItemLayout}>
                        <Form.Item label="商品名称">
                          {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入商品名称!' }],
                            initialValue:name
                          })(
                            <Input placeholder="商品名称" />
                          )}
                        </Form.Item>
                        <Form.Item label="商品描述">
                          {getFieldDecorator('description', {
                            rules: [{ required: true, message: '请输入商品描述!' }],
                            initialValue:description
                          })(
                            <Input placeholder="商品描述" />
                          )}
                        </Form.Item>
                        <Form.Item 
                            label="商品分类"
                            required={true}
                            validateStatus={categoryIdValidateStatus}
                            help={categoryIdHelp}
                        >
                            <CategorySelector 
                                getCategoryId={(pid,id)=>{
                                    handleCategoryId(pid,id)
                                }}
                                parentCategoryId={parentCategoryId}
                                categoryId={categoryId}  
                            />
                        </Form.Item>
                        <Form.Item label="商品价格">
                          {getFieldDecorator('price', {
                            rules: [{ required: true, message: '请输入商品价格!' }],
                            initialValue:price
                          })(
                            <InputNumber  
                                min={0}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="商品库存">
                          {getFieldDecorator('stock', {
                            rules: [{ required: true, message: '请输入商品库存!' }],
                            initialValue:stock
                          })(
                            <InputNumber  
                                min={0}
                            />
                          )}
                        </Form.Item>
                        <Form.Item 
                            label="商品图片"
                            required={true}
                            validateStatus={imagesValidateStatus}
                            help={imagesHelp}                            
                        >
                            <UploadImage 
                                action={UPLOAD_PRODUCT_IMAGE}
                                max={3}
                                getFileList={(fileList)=>{
                                    handleImages(fileList)
                                }}//父组件拿到子组件的图片后再传给子组件
                                fileList={fileList}
                            />
                        </Form.Item>
                        <Form.Item label="商品描述">
                            <RichEditor 
                                url={UPLOAD_PRODUCT_DETAIL_IMAGE}
                                getRichEditorValue={(value)=>{
                                    handleDetail(value)
                                }}
                                detail={detail}
                            />
                        </Form.Item>                                                                                                                                                                     
                        <Form.Item {...tailFormItemLayout}>
                          <Button 
                            type="primary"
                            onClick={this.handleSubmit}
                            loading={isSaveFetching}
                          >
                            提交
                          </Button>
                        </Form.Item>
                    </Form>                  
                </Layout>
            </div>
        )
    }
}
const WrappedProductSave = Form.create()(ProductSave);

const mapStateToProps = (state) => {
    return {
        categoryIdValidateStatus:state.get('product').get('categoryIdValidateStatus'),
        categoryIdHelp:state.get('product').get('categoryIdHelp'),
        imagesValidateStatus:state.get('product').get('imagesValidateStatus'),
        imagesHelp:state.get('product').get('imagesHelp'),        
        isSaveFetching:state.get('product').get('isSaveFetching'),//加载的图标

        parentCategoryId:state.get('product').get('parentCategoryId'),
        categoryId:state.get('product').get('categoryId'),
        images:state.get('product').get('images'),
        detail:state.get('product').get('detail'),
        description:state.get('product').get('description'),
        name: state.get('product').get('name'),
        price: state.get('product').get('price'),
        stock: state.get('product').get('stock'),         
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleCategoryId:(pid,id)=>{
            const action = actionCreator.getSetCategoryIdAction(pid,id)
            dispatch(action)   
        },
        handleImages:(fileList)=>{
            const action = actionCreator.getSetImagesAction(fileList)
            dispatch(action)   
        },
        handleDetail:(value)=>{
            const action = actionCreator.getSetDetailAction(value)
            dispatch(action)   
        },
        handleSave:(err,values)=>{ //点击提交时,
            const action = actionCreator.getSaveAction(err,values)
            dispatch(action)              
        },
        handleProductDetail:(productId)=>{
            const action = actionCreator.getProductDetailAction(productId)
            dispatch(action)               
        }                
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WrappedProductSave)

