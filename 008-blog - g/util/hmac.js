
const crypto = require('crypto');

//1.根据算法生成hash对象

//const hash = crypto.createHash('md5');
//const hash = crypto.createHash('sha256');
//const hash = crypto.createHash('sha512');
//2.添加明文
// hash.update('test');
//3.生成密文
// console.log(hash.digest('hex'));



//1.根据算法生成hash对象
//const hmac = crypto.createHmac('sha512', 'asdbsd');
//2.添加明文
//hmac.update('test');
//3.生成密文
//console.log(hmac.digest('hex'));

module.exports=(str)=>{
	const hmac = crypto.createHmac('sha512', 'asdbsd');
	hmac.update(str);
	return hmac.digest('hex');
}