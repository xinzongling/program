const fs=require('fs');
let filePath='./data.json';
const util=require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);//promise对象


const colorArr=['red','pink','potato','blue','skyblue','gray','green'];
function getRandom(min,max){
	return Math.round(min+(max-min)*Math.random());
};


async function add(options){
	//获取原数据
	let data=await readFile(filePath);//执行完为数组，返回的是Promise
	let arr=JSON.parse(data);
	let obj={//2添加数据
		id:Date.now().toString()+parseInt(Math.random()*10000).toString().padStart(4,0),
		color:colorArr[getRandom(0,colorArr.length-1)],
		content:options.content
	};		
	arr.push(obj);
	let strArr=JSON.stringify(arr);
	//3保存
	await writeFile(filePath,strArr);
	return obj;
};

async function get(){
	//获取原数据
	let data=await readFile(filePath);//执行完为数组，返回的是Promise
	let arr=JSON.parse(data);			
	let result=arr.map(n=>{//2查找数据
		return n;
	});
	return result
};
async function remove(id){
	//获取原数据
	let data=await readFile(filePath);//执行完为数组，返回的是Promise
	let arr=JSON.parse(data);	
	let result=arr.filter(n=>{//2删除数据
		return n['id']!==id;
	});
	console.log('result',result)
	let strArr=JSON.stringify(result);
	//3保存
	await writeFile(filePath,strArr);
	return result;
};

module.exports={
	add,
	get,
	remove
}