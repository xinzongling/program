var express = require('express');
var router = express.Router();

const data = [
    {
        "title": "电器",
        "products": [{
                "image": "http://127.0.0.1:3002/public/images/d1.jpg",
                "name": "戴森(Dyson) 吸尘器",
                "price": "2690.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/d2.jpg",
                "name": "美的（Midea）电饭煲电饭锅",
                "price": "268.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/d3.jpg",
                "name": "美的（Midea）电水壶",
                "price": "99.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/d4.jpg",
                "name": "德尔玛（Deerma）DX700小型家用立式吸尘器",
                "price": "178.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/d5.jpg",
                "name": "格兰仕（Galanz）家用小型迷你机械旋钮微波炉",
                "price": "309.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/d6.jpg",
                "name": "美的（Midea）电磁炉",
                "price": "179.00"
            },
        ]
    },
    {
        "title": "男装",
        "products": [{
                "image": "http://127.0.0.1:3002/public/images/n1.jpg",
                "name": "杉杉（FIRS）夹克男 商务时尚",
                "price": "388.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/n2.jpg",
                "name": "2018春秋新款夹克男",
                "price": "168.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/n3.jpg",
                "name": "Markless 男士夹克修身潮流",
                "price": "239.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/n4.jpg",
                "name": "三弦 牛仔裤男修身小脚裤",
                "price": "109.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/n5.jpg",
                "name": "太子龙 牛仔裤",
                "price": "109.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/n6.jpg",
                "name": "【型徒】长袖衬衫男",
                "price": "108.00"
            },
        ]
    },
    {
        "title": "家具",
        "products": [{
                "image": "http://127.0.0.1:3002/public/images/j1.jpg",
                "name": "中派 布艺沙发",
                "price": "1899.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/j2.jpg",
                "name": "雅之神 茶几",
                "price": "268.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/j3.jpg",
                "name": "格宜古（GEYIGU) 电视柜",
                "price": "298.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/j4.jpg",
                "name": "蔓斯菲尔（MSFE）电脑桌 ",
                "price": "159.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/j5.jpg",
                "name": "四季沐歌（MICOE）鞋架",
                "price": "69.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/j6.jpg",
                "name": "欧倍丝 儿童床",
                "price": "3899.00"
            },
        ]
    },
    {
        "title": "食品",
        "products": [{
                "image": "http://127.0.0.1:3002/public/images/s1.jpg",
                "name": "德国DMK进口牛奶",
                "price": "65.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/s2.jpg",
                "name": "新西兰原装进口牛奶",
                "price": "89.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/s3.jpg",
                "name": "良品铺子高端零食",
                "price": "59.90"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/s4.jpg",
                "name": "雀巢(Nestle) 脆脆鲨休闲零食",
                "price": "28.80"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/s5.jpg",
                "name": "卢正浩 茶叶绿茶",
                "price": "95.00"
            },
            {
                "image": "http://127.0.0.1:3002/public/images/s6.jpg",
                "name": "500g赛君王碧螺春",
                "price": "119.00"
            },
        ]
    },
]

router.get('/homeProducts', function(req, res, next) {
    res.json({
        code: 0,
        data:data
    })
});

module.exports = router;