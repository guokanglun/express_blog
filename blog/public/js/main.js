// 前台的JS代码


// 登录切换按钮
let loginTab = document.querySelectorAll('#content .right .top div.login')[0]
    // 注册切换按钮
let regTab = document.querySelectorAll('#content .right .top div.register')[0]
    // 登录盒子
let loginBox = document.getElementsByClassName('box1')[0]
    // 注册盒子
let regBox = document.getElementsByClassName('box2')[0]
    // 登录成功盒子
let loginSuccess = document.getElementsByClassName('box3')[0]
    // 登录按钮
let loginBtn = document.querySelectorAll('#content .right .box1 input.bottom')[0]
    // 注册按钮
let regBtn = document.querySelectorAll('#content .right .box2 input.bottom')[0]
    // 注册用户名input
let regUsername = document.querySelectorAll('#content .right .box2 input')[0]
    // 注册密码input
let regPassword = document.querySelectorAll('#content .right .box2 input')[1]
    // 注册确认密码
let regRepeatPassword = document.querySelectorAll('#content .right .box2 input')[2]
    // 是否注册成功
let isRegSuccess = document.querySelectorAll('#content .right .box2 span')[0]
    // 登录用户名input
let loginUsernmae = document.querySelectorAll('#content .right .box1 input')[0]
    // 登录密码input
let loginPasword = document.querySelectorAll('#content .right .box1 input')[1]
    // 是否登录成功
let isLoginSuccess = document.querySelectorAll('#content .right .box1 span')[0]
    // 退出
let logout = document.getElementById('logout')

// 点击登录切换按钮
loginTab.onclick = function() {
    this.classList.add('cur');
    regTab.classList.remove('cur')
    loginBox.style.display = 'block'
    regBox.style.display = 'none'
}

// 点击注册切换按钮
regTab.onclick = function() {
    this.classList.add('cur');
    loginTab.classList.remove('cur')
    loginBox.style.display = 'none'
    regBox.style.display = 'block'
}

// 点击注册按钮提交ajax请求
if (regBtn) {
    regBtn.onclick = function() {
        $.ajax({
            url: '/api/register',
            type: 'post',
            data: {
                username: regUsername.value,
                password: regPassword.value,
                repassword: regRepeatPassword.value
            },
            success(msg) {
                // 注册是否成功提示内容
                isRegSuccess.innerHTML = msg.message

                // 注册成功之后跳转到登录框
                setTimeout(() => {
                    // code值为0 代表注册成功
                    if (msg.code == 0) {
                        regTab.classList.remove('cur');
                        loginTab.classList.add('cur')
                        loginBox.style.display = 'block'
                        regBox.style.display = 'none'
                    }
                }, 1000)
            },
            error(err) {
                console.log(err)
            }
        })
    }

}


if (loginBtn) {
    // 登录ajax请求
    loginBtn.onclick = function() {
        $.ajax({
            url: '/api/login',
            type: 'post',
            data: {
                username: loginUsernmae.value,
                password: loginPasword.value
            },
            success(msg) {
                isLoginSuccess.innerHTML = msg.message;

                setTimeout(() => {
                    // code值为0 代表登录成功
                    if (msg.code == 0) {
                        // 登录成功重载页面
                        window.location.reload();
                    }
                }, 1000)
            },
            error(err) {
                console.log(err)
            }
        })
    }
}


if (logout) {
    logout.onclick = function() {
        $.ajax({
            url: '/api/logout',
            type: 'get',
            success(msg) {
                window.location.reload()
            },
            error(err) {

            }
        })
    }
}