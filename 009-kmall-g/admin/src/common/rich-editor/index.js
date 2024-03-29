import React,{ Component } from 'react'
import Simditor from 'simditor'
import $ from 'jquery';
import 'simditor/styles/simditor.css'
class RichEditor extends Component{
  constructor(props){
    super(props);
    this.state = {
      isLoaded:false
    }
    this.toolbar = [
      'title',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'fontScale',
      'color',
      'ol',
      'ul',
      'blockquote',
      'code',
      'table',
      'link',
      'image',
      'hr',
      'indent',
      'outdent',
      'alignment',
    ];
    $.ajaxSetup({
      xhrFields:{
        withCredentials: true
      } 
    })
  }
  componentDidMount(){
    this.simditor = new Simditor({
        textarea: this.textarea,
        toolbar:this.toolbar,
        upload:{
          url: this.props.url,
          fileKey: 'upload'
        }
    });
    this.simditor.on('valuechanged',()=>{
      this.setState(()=>({isLoaded:true}),()=>{
        this.props.getRichEditorValue(this.simditor.getValue())
      })
    })
  }
  componentDidUpdate(){//当组件更新完成后触发该函数
    if(this.props.detail && !this.state.isLoaded){
      this.simditor.setValue(this.props.detail)
      this.setState(()=>({isLoaded:true}))
    }
  }
  render(){
    return(
      <div className="RichEditor"> 
        <textarea ref={(textarea)=>{this.textarea = textarea}}></textarea>
      </div>
    )
  }
}
export default RichEditor