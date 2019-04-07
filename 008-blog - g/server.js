const express = require('express')
const app = express()

const Cookies=require('cookies');

const session = require('express-session');

const MongoStore = require("connect-mongo")(session);



const userRouter=require('./routers/user.js');

const bodyParser = require('body-parser');

app.use('/static',express.static('static'));
app.use('/view',express.static('static'));



//连接数据库
const mongoose = require('mongoose');

const UserModel=require('./models/user.js');
mongoose.connect('mongodb://localhost/blog',{ useNewUrlParser: true });
const db = mongoose.connection;
db.on('error',(err)=>{
	console.log('connect error::',err);
	throw (err)
});
db.once('open',()=>{
	console.log('connect success::');
});



const swig =require('swig');//http://127.0.0.1:3000/进入博客页面,swig在起作用
swig.setDefaults({
  cache: false
});
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');

//处理post请求的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
//设置cookies中间件
app.use((req,res,next)=>{
	req.cookies=new Cookies(req,res);
	req.userInfo={};
	let userInfo=req.cookies.get('userInfo');
	if(userInfo){
		req.userInfo=JSON.parse(userInfo);
	}
	console.log(req.userInfo);
	next();
});*/


app.use(session({
    //设置cookie名称
    name:'kzid',
    //用它来对session cookie签名，防止篡改
    secret:'abc',
    //强制保存session即使它并没有变化
    resave: true,
    //强制将未初始化的session存储
    saveUninitialized: true, 
    //如果为true,则每次请求都更新cookie的过期时间
    rolling:true,
    //cookie过期时间 1天
    cookie:{maxAge:1000*60*60*24},
    //设置session存储在数据库中
    store:new MongoStore({ mongooseConnection: mongoose.connection })   
}));

app.use((req,res,next)=>{
	req.userInfo=req.session.userInfo || {};
	console.log('req.userInfo::',req.userInfo);
	next();
});


app.use('/',require('./routers/index.js')); 
app.use('/user',userRouter); //注意是use,而不是post
app.use('/admin',require('./routers/admin.js'));
app.use('/home',require('./routers/home.js'));
app.use('/category',require('./routers/category.js'));
app.use('/article',require('./routers/article.js'));
app.use('/comment',require('./routers/comment.js'));


app.listen(3000, () => console.log('Example app listening on port 3000!'))