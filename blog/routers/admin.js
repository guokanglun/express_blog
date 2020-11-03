const express = require('express');
const { models } = require('mongoose');
const { userInfo } = require('os');
const User = require('../schema/users')
const addCategory = require('../controller/category/add')
const category = require('../controller/category/index')
    // 子服务
const router = express.Router();

// 设置后台访问权限
router.use((req, res, next) => {
    // console.log(req.userInfo)
    if (!req.userInfo.isAdmin) {
        res.send('你不是管理员，无法访问该页面')
    } else {
        next();
    }
})


router.get('/', (req, res) => {
    res.render('admin/index')
})

// 用户管理列表
router.get('/user', (req, res) => {

    let page = +req.query.page || 1; // 当前页数

    let limit = 2; // 每页限制数量

    User.count().then(count => {
        // 计算最大页数
        let maxPage = Math.ceil(count / 2)
        page = Math.min(maxPage, page)
        let skip = (page - 1) * limit; // 每页跳过的数量
        User.find().limit(limit).skip(skip).then((msg) => {
            // console.log(msg)
            res.render('admin/user/user', {
                msg,
                userInfo: req.userInfo,
                page,
                maxPage
            })
        })

    })



})

// 分类添加
router.get('/category/add', addCategory.showAdd)
router.post('/category/add', addCategory.add)

// 渲染分类列表
router.get('/category', category.showIndex)

// 修改分类
router.get('/category/update', category.updateCategory)
router.post('/category/update', category.updateData)

// 删除分类
router.get('/category/delete', category.deleteCategory)
router.post('/category/delete', category.deleteData)

// 内容添加页面
router.get('/content/add', category.addContent)
router.post('/content/add', category.add)

// 内容列表
router.get('/content', category.content)

// 内容修改
router.get('/content/update', category.showUpdate)
router.post('/content/update', category.showUpdateData)

// 内容删除
router.get('/content/delete', category.showDelete)
router.post('/content/delete', category.showDeleteData)

module.exports = router;