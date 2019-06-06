import React,{ Component } from 'react'
import { Upload, Icon, Modal } from 'antd';
class UploadImage extends Component{
  constructor(props){
    super(props);
    this.state =  {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
    this.handleCancel = this.handleCancel.bind(this)
    this.handlePreview = this.handlePreview.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  //当state或props发生改变时触发该函数
  static getDerivedStateFromProps(props, state){
    //表示有图片
    if(props.fileList.length > 0 && state.fileList == 0){
      return {
        fileList:props.fileList
      }
    }
    return null;
  }
  handleCancel(){
    this.setState({ previewVisible: false })
  }
  handlePreview(file){
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  } 
  handleChange({ fileList }){
    this.setState({ fileList },()=>{//当添加完成图片后,把图片变成字符串给父组件
      this.props.getFileList(fileList.map(file=>file.response).join(','))
    })
  }
  render(){
    const { previewVisible, previewImage, fileList } = this.state;
    const { action,max } = this.props
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );    
    return(
      <div className="UploadImage">
        <Upload
          action={action}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          withCredentials={true}
        >
          {fileList.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
export default UploadImage