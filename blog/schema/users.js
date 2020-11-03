// 定义数据库数据格式
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

// 暴露用户模型
module.exports = mongoose.model('users', userSchema)