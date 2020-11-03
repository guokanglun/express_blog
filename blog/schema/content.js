// 定义数据库数据格式
const mongoose = require('mongoose')
const { schema } = require('./users')

const contentSchema = new mongoose.Schema({
    title: String,
    description: String,
    content: String,
    category: String,
    author: String,
    time: {
        type: Date,
        default: new Date,
    },
    views: {
        type: Number,
        default: 0
    },
    comment: {
        type: Array,
        default: [],
    }

})

// 暴露用户模型
module.exports = mongoose.model('contents', contentSchema)