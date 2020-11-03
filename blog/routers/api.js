// 登录注册分路由

const express = require('express');
const { models } = require('mongoose');

const User = require('../schema/users')

// 子服务
const router = express.Router();

// 统一后台返回的格式
let responseData = {};

// 注册的后台处理
router.post('/register', (req, res) => {
    let { username, password, repassword } = req.body;

    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.send(responseData)
        return
    }
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.send(responseData)
        return
    }
    if (password !== repassword) {
        responseData.code = 3;
        responseData.message = '两次密码不一致';
        res.send(responseData)
        return
    }

    // 从数据库中查询用户是否被注册了
    User.findOne({ username }).then(sombody => {
        if (sombody) {
            responseData.code = 4;
            responseData.message = '该用户已注册'
            res.send(responseData)
            return
        }
        // 保存用户数据到数据库
        new User({
            username,
            password
        }).save().then((msg) => {
            responseData.code = 0;
            responseData.message = '注册成功,请登录';
            res.send(responseData)
        })
    })



})

// 登录的后台处理
router.post('/login', (req, res) => {
    let { username, password } = req.body;
    if (username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.send(responseData)
        return
    }
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.send(responseData)
        return
    }

    User.findOne({ username, password }).then((msg) => {
        if (msg) {
            responseData.code = 0;
            responseData.message = '登录成功'
                // 设置cookie信息
            responseData.userInfo = {
                id: msg._id,
                username: msg.username,
                isAdmin: msg.isAdmin
            }

            // 登录成功设置cookie
            res.cookie('userInfo', JSON.stringify(responseData.userInfo), {
                maxAge: 360000 * 1000
            })

            res.send(responseData)

        } else {
            responseData.code = 3;
            responseData.message = '用户名或密码错误'
            res.send(responseData)
        }
    })

})

// 退出登录
router.get('/logout', (req, res) => {
    // cookie设置为空即可
    res.cookie('userInfo', '')
    res.send('')
})


module.exports = router;