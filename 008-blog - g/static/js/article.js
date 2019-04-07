;(function($){
	ClassicEditor
    .create(document.querySelector('#content'),{
    	language:'zh-cn',  //配置富文本的语言
		ckfinder: {
		    uploadUrl:'/admin/uploadImages'
		}
    })
    .catch(error=>{
        console.error(error);
    });
})(jQuery)