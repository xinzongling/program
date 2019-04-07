//page,model,query,projection,sort,populates
async  function pagination(options){
	let { page,model,query,projection,sort,populates } =options; //let定义的变量值可以改变,但是const一旦定义了就不可更改
	page=parseInt(page);
	if(!page){ //第一次进入用户列表,page没有输入,值为undefined
		page=1;
	}
	let limit=2;//每页显示多少条数据
	const count=await model.countDocuments(query);
	//拿到总页数
	let pages=Math.ceil(count/limit);
	if(page>=pages){
		page=pages;
	}
	if(pages==0){
		page=1;
	}
	//生成页码
	let arr=[];
	for(var i=1;i<=pages;i++){
		arr.push(i);
	}
	//分页显示
	let skip=limit*(page-1);
	let result =model.find(query,'-password -__v');

	if(populates){
		populates.forEach(populate=>{
			result=result.populate(populate);
		})
	}

	const docs = await result.sort(sort).skip(skip).limit(limit);

	return {
		docs,//从数据库中查到的数据
		page,//当前的页码
		arr,//生成页码的列表
		pages//总页数
	}
	console.log('pages::',pages)
}
module.exports=pagination;