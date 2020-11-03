// 输入框
let ipt = document.querySelectorAll('#content .bottom .inp')[0]

// 提交
let commitBtn = document.querySelectorAll('#content .bottom .btn')[0]

// 当前用户
let user = document.getElementById('username')

// 当前文章id
let contentId = document.getElementById('contentId')

// 评论
let allComment = document.querySelectorAll('#content .bottom .allcomments')[0]

// 上一页
let pre = document.querySelectorAll('#content .bottom .page span.pre')[0]

// 下一页
let next = document.querySelectorAll('#content .bottom .page span.next')[0]

// 页码
let center = document.querySelectorAll('#content .bottom .page span.center')[0]

// 是否登录提示
let tips = document.querySelectorAll('#content .bottom .tips')[0]


if (user) {
    commitBtn.onclick = function() {
        $.ajax({
            url: '/commit',
            type: 'post',
            data: {
                // 评论数据
                comment: ipt.value,
                // 评论人
                author: user.innerText,
                // 当前文章的id
                contentId: contentId.innerText.trim()

            },
            success(msg) {
                // console.log(msg)
                comment = msg;
                renderComment(comment.reverse(), page, limit)
            }
        })
    }
    tips.innerHTML = '你已经登录，可以评论了'
} else {
    tips.innerHTML = '你还没有登录，暂时无法评论'
}


// 文章加载  自动发起一次ajax请求获取评论内容
$.ajax({
    url: '/commit',
    type: 'get',
    data: {
        // 当前文章的id
        contentId: contentId.innerText.trim()

    },
    success(msg) {
        // console.log(msg)
        comment = msg;
        renderComment(comment.reverse(), page, limit)
    }
})

// 当前页数
let page = 1;
// 每页显示条数
let limit = 2;
let comment = [];

next.onclick = function() {
    page++
    renderComment(comment, page, limit)
}
pre.onclick = function() {
    page--;
    if (page <= 1) page = 1;
    renderComment(comment, page, limit)
}

function renderComment(comment, page, limit) {
    let html = ''

    // 最大页数
    let maxPage = Math.ceil(comment.length / limit);
    // 每页的起点
    let start = (page - 1) * limit;
    start = Math.max(start, 0)
        // 每页的终点
    let end = Math.min(start + limit, comment.length)


    for (let i = start; i < end; i++) {
        html += `
        <li>
        <span class='name'> ${comment[i].author}</span> <span class='time'>发表于  ${new Date(comment[i].time).toLocaleString()}</span>
        <p class='content'> ${comment[i].comment} </p>
    </li>
        `
    }
    allComment.innerHTML = html;
    page = Math.min(page, maxPage)

    center.innerHTML = page + '/' + maxPage

    // console.log(html)
}