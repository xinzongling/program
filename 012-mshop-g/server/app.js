





const express = require('express')
const app = express()


app.use('/public',express.static('public'));
var path = require('path');

var products = require('./routes/products');

//跨域设置
app.use((req,res,next)=>{
    res.append("Access-Control-Allow-Origin","*");
    res.append("Access-Control-Allow-Credentials",true);
    res.append("Access-Control-Allow-Methods","GET, POST, PUT,DELETE");
    res.append("Access-Control-Allow-Headers", "Content-Type, X-Requested-With,X-File-Name"); 
    next();
})

app.use('/products', products);

app.listen(3002, () => console.log('Example app listening on port 3002!'))

module.exports = app;