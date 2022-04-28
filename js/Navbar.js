$(document).ready(() => {

    // 用 / 把 URL 拆开，取出文档名，剔除参数。
    var documentFileName = location.href.split('/')
    documentFileName = documentFileName[documentFileName.length - 1].split(".html")[0]

    // [底栏设置]
    // 底栏图标数：
    var navbarHtmlcols = 5

    var navbarHtml =
        `
<div class="toolbar">
    <div class="toolButton goTopButton" style="opacity: 0;"><i class="bi bi-arrow-up-circle fs-5"></i></div>
    <div class="toolButton searchButton"><span><i class="bi bi-search fs-5"></i></span><input class="form-control" placeholder="以 番剧名称 搜索"></div>
</div>

<nav class="navbar navbar-light shadow-lg fixed-bottom border-top border-1 rounded-top p-2"
    style="backdrop-filter: blur(9px) brightness(0.7); background-color: rgba(250, 250, 250, 0.7);">
    <div class="container-fluid row-cols-${navbarHtmlcols}" style="max-width: 1320px">
        <a id="home" class="text-center text-decoration-none col text-secondary" href="/home.html">
            <i class="bi ${location.href.indexOf("home.html") != -1 ? "bi-house-fill" : "bi-house"} fs-5"></i>
            <div style="font-size: 10px;">主页</div>
        </a>
        <a id="search" class="text-center text-decoration-none col text-secondary" href="/search.html">
            <i class="bi ${location.href.indexOf("search.html") != -1 ? "bi-search" : "bi-search"} fs-5"></i>
            <div style="font-size: 10px;">搜索</div>
        </a>
        <a id="weekly" class="text-center text-decoration-none col text-secondary" href="/weekly.html">
            <i class="bi ${location.href.indexOf("weekly.html") != -1 ? "bi-calendar-week-fill" : "bi-calendar-week"} fs-5"></i>
            <div style="font-size: 10px;">放送</div>
        </a>
        <a id="index" class="text-center text-decoration-none col text-secondary" href="/index.html">
            <i class="bi ${location.href.indexOf("index.html") != -1 ? "bi-collection-fill" : "bi-collection"} fs-5"></i>
            <div style="font-size: 10px;">索引</div>
        </a>
        <a id="help" class="text-center text-decoration-none col text-secondary" href="/help.html">
        <i class="bi ${location.href.indexOf("help.html") != -1 ? "bi-question-circle-fill" : "bi-question-circle"} fs-5""></i>
            <div style="font-size: 10px;">帮助</div>
        </a>
    </div>
</nav>
`
    $("#navbar").append(navbarHtml)

    $(`#${documentFileName}`).removeClass("text-secondary").attr("href", "#")

    $(window).scroll(function () {
        var s = $(window).scrollTop()
        if (s > 110) document.querySelector(".goTopButton").style.opacity = "1"
        else document.querySelector(".goTopButton").style.opacity = "0"
    })

    $(".goTopButton").click(function () {
        $("body,html").animate({ scrollTop: '0' }, 100)
    })

    $(".searchButton input").keydown(function (e) {
        if (e.keyCode == 13) {
            if (document.querySelector(".searchButton input").value != "")
                window.location.href = 'https://anime.magmablock.top/search.html?name=' + document.querySelector(".searchButton input").value
        }
    })

    $(".searchButton span").click(function () {
        if (document.querySelector(".searchButton").clientWidth > 180)
            if (document.querySelector(".searchButton input").value != "")
                window.location.href = 'https://anime.magmablock.top/search.html?name=' + document.querySelector(".searchButton input").value
    })

    $(".toolbar").css("display", localStorage.getItem("hideToolBar") == "true" ? "none" : "")
})