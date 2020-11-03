// 定义数据库数据格式
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: String,

})

// 暴露用户模型
module.exports = mongoose.model('categorys', categorySchema)