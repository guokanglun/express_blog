const Category = require('../../schema/category')
const Content = require('../../schema/content')


exports.showIndex = function(req, res) {
        // 数据库读取所有信息  -1 逆序
        Category.find().sort({ _id: -1 }).then(msg => {
            res.render('admin/category/index', {
                msg
            })
        })

    }
    // 修改category
exports.updateCategory = function(req, res) {
    // 获取分类的名字
    let category = req.query.category;
    // console.log(category, 333)
    res.render('admin/category/update', {
        category
    })
}

exports.updateData = function(req, res) {
    // 表单数据
    let category = req.body.category
        // 当前分类
    let cate = req.query.category
        // console.log(cate, 333333)

    // 分类为空提示信息
    if (category == '') {
        res.render('admin/error', {
            optionMessage: {
                location: '分类首页',
                option: '分类修改',
                message: '修改数据不能为空'
            }
        })
        return
    }

    // 数据库查询当前分类是否存在
    Category.findOne({ name: category }).then(result => {
        if (result) {
            res.render('admin/error', {
                optionMessage: {
                    location: '分类首页',
                    option: '分类修改',
                    message: '该分类已存在'
                }
            })
            return
        }

        // 修改逻辑
        Category.updateOne({ name: cate }, { $set: { name: category } }).then(() => {
            res.render('admin/success', {
                optionMessage: {
                    location: '分类首页',
                    option: '分类修改',
                    message: '修改成功'
                }
            })
        })
    })

}

// 删除category
exports.deleteCategory = function(req, res) {
    let category = req.query.category
    res.render('admin/category/delete', {
        category
    })
}

exports.deleteData = function(req, res) {
    let category = req.query.category;

    Category.deleteOne({ name: category }).then(() => {
        res.render('admin/success', {
            category,

            optionMessage: {
                location: '删除首页',
                option: '分类删除',
                message: '删除成功'
            }

        })
    })

}

exports.addContent = function(req, res) {
    // 数据库获取分类信息
    Category.find().then(result => {
        res.render('admin/content/add', {
            userInfo: req.userInfo,
            result
        })
    })
}

exports.add = function(req, res) {
    let { category, title, jianjie, content } = req.body

    if (title == '') {
        res.render('admin/error', {
            optionMessage: {
                location: '内容首页',
                option: '内容添加',
                message: '标题不能为空'
            }
        })
        return
    }

    if (jianjie == '') {
        res.render('admin/error', {
            optionMessage: {
                location: '内容首页',
                option: '内容添加',
                message: '标简介不能为空'
            }
        })
        return
    }

    if (content == '') {
        if (content == '') {
            res.render('admin/error', {
                optionMessage: {
                    location: '内容首页',
                    option: '内容添加',
                    message: '内容不能为空'
                }
            })
            return
        }
        return
    }

    // 查询数据库标题重复
    Content.findOne({ title }).then(result => {
        if (!result) {
            // 保存数据
            // console.log(1111)
            new Content({
                title,
                description: jianjie,
                content,
                category,
                author: req.userInfo.username,
            }).save().then((result) => {
                res.render('admin/success', {
                    optionMessage: {
                        location: '内容首页',
                        option: '内容添加',
                        message: '成功添加'
                    }
                })

            })
        }
    })


}

exports.content = function(req, res) {

    let page = +req.query.page || 1; // 当前页数

    let limit = 2; // 每页限制数量

    Content.count().then(count => {
        // 计算最大页数
        let maxPage = Math.ceil(count / 2)
        page = Math.min(maxPage, page)
        let skip = (page - 1) * limit; // 每页跳过的数量
        Content.find().limit(limit).skip(skip).then((msg) => {
            // console.log(msg)
            res.render('admin/content/index', {
                msg,
                userInfo: req.userInfo,
                page,
                maxPage,

            })
        })

    })

}

exports.showUpdate = function(req, res) {

    let id = req.query.id;
    // console.log(id)

    Content.findOne({ _id: id }).then(result => {
        // console.log(result)
        res.render('admin/content/update', {
            result
        })
    })



}

exports.showUpdateData = function(req, res) {
    // 当前内容的id
    let id = req.query.id;

    let { title, description, content } = req.body
    if (title == '') {
        res.render('admin/error', {
            optionMessage: {
                location: '内容首页',
                option: '内容修改',
                message: '标题不能为空'
            }
        })
        return
    }

    if (description == '') {
        res.render('admin/error', {
            optionMessage: {
                location: '内容首页',
                option: '内容修改',
                message: '描述信息不能为空'
            }
        })
        return
    }

    if (content == '') {
        res.render('admin/error', {
            optionMessage: {
                location: '内容首页',
                option: '内容修改',
                message: '内容不能为空'
            }
        })
        return
    }

    Content.updateOne({ _id: id }, {
        $set: {
            title,
            description,
            content,
            time: new Date()
        }
    }).then(result => {
        res.render('admin/success', {
            optionMessage: {
                location: '内容首页',
                option: '内容修改',
                message: '修改成功'
            }
        })
    })

}

exports.showDelete = function(req, res) {
    let id = req.query.id

    Content.findOne({ _id: id }).then(result => {
        let { title, description, content, category } = result
        res.render('admin/content/delete', {
            title,
            description,
            content,
            category
        })
    })

}

exports.showDeleteData = function(req, res) {
    let id = req.query.id
    Content.deleteOne({ _id: id }).then(result => {
        res.render('admin/success', {
            optionMessage: {
                location: '删除首页',
                option: '内容删除',
                message: '删除成功'
            }
        })
    })
}