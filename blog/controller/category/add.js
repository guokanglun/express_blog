const Category = require('../../schema/category')

exports.showAdd = function(req, res) {
    res.render('admin/category/add')
}

exports.add = function(req, res) {
    // console.log(req.body, 111)
    // 获取提交的类名
    let category = req.body.category;

    // 分类为空
    if (category.trim() == '') {
        res.render('admin/error', {
            optionMessage: {
                location: '分类首页',
                option: '分类添加',
                message: '分类名称不能为空'
            }
        })
    }

    // 查找数据库是否有该分类
    Category.findOne({
        name: category
    }).then(result => {
        if (result) {
            res.render('admin/error', {
                optionMessage: {
                    location: '分类首页',
                    option: '分类添加',
                    message: '该分类已经存在，不可重复添加'
                }
            })
            return
        }

        // 保存category
        new Category({
            name: category
        }).save().then(() => {
            res.render('admin/success', {
                optionMessage: {
                    location: '分类首页',
                    option: '分类添加',
                    message: '保存成功'
                }
            })
        })

    })




    // res.render('admin/category/add', {
    //     userInfo: req.userInfo
    // })
}