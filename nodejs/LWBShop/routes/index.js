var express = require('express');
var router = express.Router();
var crypto = require("crypto");
var captchapng = require('captchapng');
var Alidayu = require('alidayu-node');
var redis = require("redis");
var registryOrLogin = require("./libs/register-or-login.js");
var shopCar = require("./libs/shopcar-model.js");

var redisClient = redis.createClient(6379, 'localhost', { auth_pass: 'lwba21190' });
redisClient.flushdb();

var registryOrLoginModel = new registryOrLogin();
var shopCarModel = new shopCar();

redisClient.on("ready", function(err) {
    if (!err) {
        console.log("ready");
    }
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.post('/registry', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    if (req.body.imgVerificationCode !== req.session.imgVerifyCode) {
        req.session.imgVerifyCode = "";
        res.end(JSON.stringify({ "result": false, "msg": "图片验证码不正确，请重新获取" }));
        return;
    }

    redisClient.get(req.body.phoneNumber, function(err, reply) {
        if (!reply) {
            res.end(JSON.stringify({ "result": false, "msg": "短信验证码失效，请重新获取" }));
            return;
        }
        if (req.body.smsVerificationCode !== reply.toString()) {
            res.end(JSON.stringify({ "result": false, "msg": "短信验证码不正确，请重新获取" }));
            return;
        }

        registryOrLoginModel.userIsExist(req.body.accountName, req.body.phoneNumber, req.body.email, function(err, isExist, result) {
            if (err) {
                res.end(JSON.stringify({ "result": false, "msg": err }));
                return;
            }
            if (isExist) {
                res.end(JSON.stringify({ "result": false, "msg": "用户名已存在" }));
            } else {
                //密码MD5加密保存数据库
                var encryptPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
                var user = new registryOrLoginModel({
                    accountName: req.body.accountName,
                    phoneNumber: req.body.phoneNumber,
                    email: req.body.email,
                    password: encryptPassword
                });
                user.save(function(err) {
                    if (err) {
                        res.end(JSON.stringify({ "result": false, "msg": err }));
                        return;
                    }
                    res.end(JSON.stringify({ "result": true, "msg": "恭喜您，注册成功" }));
                });
            }
        });
    });
});

router.post('/modifyPassword', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    if (req.body.imgVerificationCode !== req.session.imgVerifyCode) {
        req.session.imgVerifyCode = "";
        res.end(JSON.stringify({ "result": false, "msg": "图片验证码不正确，请重新获取" }));
        return;
    }

    redisClient.get(req.body.phoneNumber, function(err, reply) {
        if (!reply) {
            res.end(JSON.stringify({ "result": false, "msg": "短信验证码失效，请重新获取" }));
            return;
        }
        if (req.body.smsVerificationCode !== reply.toString()) {
            res.end(JSON.stringify({ "result": false, "msg": "短信验证码不正确，请重新获取" }));
            return;
        }
        registryOrLoginModel.findPhoneNumber(req.body.phoneNumber, function(err, result) {
            if (err) {
                res.end(JSON.stringify({ "result": false, "msg": err }));
                return;
            }
            if (result) {
                //密码MD5加密保存数据库
                var encryptPassword = crypto.createHash('md5').update(req.body.password).digest('hex');
                registryOrLoginModel.updatePassword(req.body.phoneNumber, encryptPassword, function(err) {
                    if (err) {
                        res.end(JSON.stringify({ "result": false, "msg": err }));
                        return;
                    }
                    res.end(JSON.stringify({ "result": true, "msg": "密码修改成功，请使用新密码登录！" }));
                });
            } else {
                res.end(JSON.stringify({ "result": false, "msg": "用户不存在" }));
            }
        });
    });
});

router.post('/login', function(req, res) {
    registryOrLoginModel.userIsExist(req.body.userName, req.body.userName, req.body.userName, function(err, isExist, result) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        if (err) {
            res.end(JSON.stringify({ "result": false, "msg": err }));
            return;
        }
        if (isExist) {
            var encryptPassword = crypto.createHash('md5').update(req.body.password).digest('hex')
            if (encryptPassword == result.password) {
                var currentTime = new Date().toUTCString();
                var token = crypto.createHash('md5').update(req.body.userName + req.body.password + currentTime).digest('hex');
                redisClient.set(req.body.userName, token);
                redisClient.expire(req.body.userName, 60 * 60 * 24 * 365);
                res.end(JSON.stringify({ "result": true, "msg": "登录成功", "token": token }));
            } else {
                res.end(JSON.stringify({ "result": false, "msg": "密码错误" }));
            }
        } else {
            res.end(JSON.stringify({ "result": false, "msg": "用户不存在" }));
        }
    });
});

router.post('/logout', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    redisClient.get(req.body.userName, function(err, reply) {
        if (err) {
            res.end(JSON.stringify({ "result": false, "msg": err }));
            return;
        }
        if (reply && req.body.token === reply) {
            redisClient.del(req.body.userName);
            res.end(JSON.stringify({ "result": true, "msg": "注销登录成功" }));
        } else {
            res.end(JSON.stringify({ "result": false, "msg": "未登录或者登陆失效" }));
        }
    });
});


router.get('/smsVerificationCode', function(req, res) {
    var smsVerifyCode = (Math.floor(Math.random() * 900000) + 100000).toString();
    var alidayu = new Alidayu('23514203', '6e271600262adb86286d258aed80e1ac');
    var options = {
        sms_free_sign_name: 'LWB电商',
        sms_param: JSON.stringify({
            "code": smsVerifyCode,
            "project": "LWBShop",
            "time": "1"
        }),
        rec_num: req.query.phoneNumber,
        sms_template_code: 'SMS_25260069',
    };
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    redisClient.set(req.query.phoneNumber, smsVerifyCode);
    redisClient.expire(req.query.phoneNumber, 60);
    //发送短信
    alidayu.smsSend(options);
    res.end(JSON.stringify({ "result": true, "msg": "短信发送成功" }));
});

router.get('/captcha.png', function(req, res) {
    req.session.imgVerifyCode = (Math.floor(Math.random() * 9000) + 1000).toString();
    var p = new captchapng(70, 22, req.session.imgVerifyCode); // width,height,numeric captcha
    p.color(0, 0, 0, 0); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
});

router.post("/updateShopCarData", function(req, res) {
    var accountName = req.body.userName;
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    redisClient.get(accountName, function(err, reply) {
        if (err) {
            res.end(JSON.stringify({ "result": false, "msg": err }));
            return;
        }
        if (reply && (req.body.token === reply)) {
            var info = req.body;
            shopCarModel.findAllCartInfo(accountName, function(err, result) {
                if (err) {
                    res.end(JSON.stringify({ "result": false, "msg": err }));
                    return;
                }
                if (result == null) {
                    var cartInfo = {
                        "vendors": [{
                            "shopId": -1,
                            "shopName": "京东自营",
                            "Num": 0,
                            "vendorPrice": 0,
                            "isSelected": true,
                            "sorted": []
                        }],
                        "Num": 0,
                        "Price": 0,
                        "isSelected": true
                    };
                    var price = parseFloat(info.params.info.jdPrice)
                    cartInfo.Num = 1;
                    cartInfo.Price = price;
                    cartInfo.vendors[0].vendorPrice = price;

                    var itemInfo = {};
                    itemInfo.propertyTags = { "a": null, "b": null }
                    itemInfo.Name = info.params.info.wname;
                    itemInfo.Num = 1;
                    itemInfo.Price = price;
                    itemInfo.ImgUrl = info.params.info.imageurl.substr(info.params.info.imageurl.indexOf("jfs"));
                    itemInfo.cid = parseInt(info.params.info.wareId);
                    itemInfo.isSelected = true;

                    cartInfo.vendors[0].sorted.push(itemInfo);
                    cartInfo.vendors[0].vendorPrice = itemInfo.Price;

                    var newInfo = new shopCarModel({
                        accountName: accountName,
                        cartInfo: cartInfo
                    });

                    newInfo.save(function(err) {
                        console.log(err);
                        if (err) {
                            res.end(JSON.stringify({ "result": false, "msg": err }));
                            return;
                        }
                        res.end(JSON.stringify({ "result": true, "msg": "更新购物车成功" }));
                    });
                } else {
                    shopCarModel.updateCartInfo(accountName, info, function(err, msg) {
                        if (err) {
                            res.end(JSON.stringify({ "result": false, "msg": err }));
                            return;
                        }
                        res.end(JSON.stringify({ "result": true, "msg": msg }));
                    });
                }
            });
        } else {
            res.end(JSON.stringify({ "result": false, "msg": "用户未登录或者登录失效" }));
        }
    });

});

router.post("/synchronizeShopCarInfo", function(req, res) {
    var accountName = req.body.userName;
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    redisClient.get(accountName, function(err, reply) {
        if (err) {
            res.end(JSON.stringify({ "result": false, "msg": err }));
            return;
        }
        if (reply && (req.body.token === reply)) {
            shopCarModel.findAllCartInfo(accountName, function(err, result) {
                if (err) {
                    res.end(JSON.stringify({ "result": false, "msg": err }));
                    return;
                }
                if (result == null) {
                    var newInfo = new shopCarModel({
                        accountName: accountName,
                        cartInfo: req.body.info.cartInfo
                    });

                    newInfo.save(function(err) {
                        console.log(err);
                        if (err) {
                            res.end(JSON.stringify({ "result": false, "msg": err }));
                            return;
                        }
                        res.end(JSON.stringify({ "result": true, "msg": "更新购物车成功" }));
                    });
                } else {
                    shopCarModel.insertCartInfo(accountName, result, req.body.info.cartInfo, function(err) {
                        if (err) {
                            res.end(JSON.stringify({ "result": false, "msg": "同步购物车失败" }));
                        }
                    });
                }

            });

        } else {
            res.end(JSON.stringify({ "result": false, "msg": "用户未登录或者登录失效" }));
        }
    });
});

router.get("/shopCarInfo", function(req, res) {
    var accountName = req.query.userName;
    console.log(req.query.userName);
    redisClient.get(accountName, function(err, reply) {
        if (err) {
            res.end(JSON.stringify({ "result": false, "msg": err }));
            return;
        }
        if (reply && (reply === req.query.token)) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            shopCarModel.findAllCartInfo(accountName, function(err, result) {
                if (err) {
                    console.log(err);
                    res.end(JSON.stringify({ "result": false, "msg": err }));
                    return;
                }
                if (result) {
                    res.end(JSON.stringify({ "result": true, "msg": result.cartInfo }));
                } else {
                    res.end(JSON.stringify({ "result": false, "msg": "购物车是空的" }));
                }
            });
        } else {
            console.log(reply);
            console.log(req.query.token);
            res.end(JSON.stringify({ "result": false, "msg": "用户未登录" }));
        }
    });
});



module.exports = router;