// main.js  首页的路由

const express = require('express');
const { models } = require('mongoose');
const Category = require('../schema/category')
const Content = require('../schema/content')
    // 子服务
const router = express.Router();

// 渲染首页
router.get('/', (req, res) => {
    Category.find().then(result => {
        Content.count().then(count => {
            // let category = req.query.category;
            let page = +req.query.page || 1; // 当前页数
            let limit = 2; // 每页限制数量
            let maxPage = Math.ceil(count / limit)
                // page = Math.min(maxPage, page)
            if (page >= maxPage) {
                page = maxPage
            }
            // console.log(page)
            let skip = (page - 1) * limit; // 每页跳过的数量
            let cate = {};
            if (req.query.category) {
                cate.category = req.query.category
            } else {
                cate = {}
            }
            // console.log(cate)
            Content.find(cate).limit(limit).skip(skip).then(content => {
                res.render('main/index', {
                    userInfo: req.userInfo,
                    result,
                    content,
                    page,
                    maxPage,
                    category: req.query.category
                })
            })
        })


    })
})

// 首页内容全文
router.get('/view', (req, res) => {

    let categoryId = req.query.contentId;

    Category.find().then(result => {
        Content.findOne({ _id: categoryId }).then(contentData => {
            let views = ++contentData.views;
            Content.updateOne({ _id: categoryId }, { $set: { views } }).then(() => {})
                // console.log(contentData)
            res.render('main/index2', {
                userInfo: req.userInfo,
                contentData,
                result
            })
        })
    })



})

router.post('/commit', (req, res) => {

    if (!req.userInfo) {
        res.send('还没有登录，请先登录~~')
        return
    }

    // 评论 作者 文章id
    let { comment, author, contentId } = req.body;

    // 评论的格式
    let commentData = {
        comment,
        time: new Date(),
        author,
    }

    Content.findOne({ _id: contentId }).then(result => {
        result.comment.push(commentData)

        Content.updateOne({ _id: contentId }, { $set: { comment: result.comment } }).then(msg => {
            Content.findOne({ _id: contentId }).then(result2 => {

                res.send(result2.comment)
            })
        })

    })
})

router.get('/commit', (req, res) => {
    let commentId = req.query.contentId;
    Content.findById(commentId).then(content => {
        res.send(content.comment)
    })
})

module.exports = router;