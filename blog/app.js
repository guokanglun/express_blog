const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

// 解析cookie配置
app.use(cookieParser())
    // 获取post数据配置
app.use(bodyParser.urlencoded({
    extended: false
}))

// 配置静态文件
app.use(express.static('public'))
    // 配置ejs
app.set('view engine', 'ejs')


// 访问任何路由都会先访问这个路由，将cookie信息保存在req的对象中
app.use((req, res, next) => {
    if (req.cookies.userInfo) { // 如果有cookie代表用户已经登录了
        req.userInfo = JSON.parse(req.cookies.userInfo)
    }
    next();
})


// 根据不同的模块 划分不同的路由
app.use('/admin', require('./routers/admin'))
app.use('/', require('./routers/main'))
app.use('/api', require('./routers/api'))


// 链接数据库
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('数据库链接失败')
        return
    }
    console.log('数据库连接成功')
    app.listen(3000)
})