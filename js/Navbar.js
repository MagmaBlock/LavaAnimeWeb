$(document).ready(() => {

    // 用 / 把 URL 拆开，取出文档名，剔除参数。
    var documentFileName = location.href.split('/')
    documentFileName = documentFileName[documentFileName.length - 1].split(".html")[0]

    // [底栏设置]
    // 底栏图标数：
    var navbarHtmlcols = 5

    var navbarHtml =
        `
<nav class="navbar navbar-light shadow-lg fixed-bottom border-top border-2 rounded-top p-1"
    style=" background-color: #f1f2f6">
    <div class="container-fluid row-cols-${navbarHtmlcols}">
        <a id="home" class="text-center text-decoration-none col text-secondary" href="/home.html">
            <i class="bi bi-house fs-5"></i>
            <div style="font-size: 10px;">主页</div>
        </a>
        <a id="search" class="text-center text-decoration-none col text-secondary" href="/search.html">
            <i class="bi bi-search fs-5"></i>
            <div style="font-size: 10px;">搜索</div>
        </a>
        <a id="weekly" class="text-center text-decoration-none col text-secondary" href="/weekly.html">
            <i class="bi bi-calendar-week fs-5"></i>
            <div style="font-size: 10px;">放送</div>
        </a>
        <a id="index" class="text-center text-decoration-none col text-secondary" href="/index.html">
            <i class="bi bi-collection fs-5"></i>
            <div style="font-size: 10px;">索引</div>
        </a>
        <a id="help" class="text-center text-decoration-none col text-secondary" href="/help.html">
            <i class="bi bi-question-circle-fill fs-5"></i>
            <div style="font-size: 10px;">帮助</div>
        </a>
    </div>
</nav>
`
    $("#navbar").append(navbarHtml)

    $(`#${documentFileName}`).removeClass("text-secondary").attr("href","#")
})