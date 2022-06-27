$(document).ready(() => {
  const navbarHtml =
    `<!-- 顶栏 -->
        <nav id="topbar" class="navbar navbar-light shadow-sm border-bottom border-1 rounded-bottom"
            style="backdrop-filter: blur(9px) brightness(0.85); background-color: rgba(255, 255, 255, 0.7);">
            <div class="container-fluid px-4" style="max-width: 1320px">
                <!-- 左侧 -->
                <div>
                    <a id="home-top" class="text-decoration-none text-secondary mx-2 d-none d-md-inline" href="/home.html">
                        <i class="bi bi-house fs-5 align-baseline"></i>
                        <span class="d-none d-md-inline mx-1 fw-light align-text-bottom" style="font-size: 14px;">主页</span>
                    </a>
                    <a id="index-top" class="text-decoration-none text-secondary mx-2 d-none d-md-inline"
                        href="/index.html">
                        <i class="bi bi-collection fs-5 align-baseline"></i>
                        <span class="d-none d-md-inline mx-1 fw-light align-text-bottom" style="font-size: 14px;">索引</span>
                    </a>
                    <a id="weekly-top" class="text-decoration-none text-secondary mx-2" href="/weekly.html">
                        <i class="bi bi-calendar-week fs-5 align-baseline"></i>
                        <span class="d-none d-md-inline mx-1 fw-light align-text-bottom" style="font-size: 14px;">放送</span>
                    </a>
                    <a id="help-top" class="text-decoration-none text-secondary mx-2 d-none d-md-inline" href="/help.html">
                        <i class="bi bi-question-circle fs-5 align-baseline"></i>
                        <span class="d-none d-md-inline mx-1 fw-light align-text-bottom" style="font-size: 14px;">帮助</span>
                    </a>
                </div>
                <!-- 搜索框 -->
                <div class="d-flex" style="min-width: 200px; width: 45%; max-width: 550px;">
                    <div class="input-group">
                        <input id="search-label-top" class="form-control form-control-sm border-0"
                            style="font-size: 13px; background: rgba(180, 180, 180, 0.3);"
                            placeholder="搜索 番剧名称 或 Bangumi ID" autocomplete="off">
                        <button id="search-top" class="btn btn-sm btn-secondary border-0 align-middle" type="button"><i
                                class="bi bi-search"></i></button>
                    </div>
                </div>
                <!-- 右侧 -->
                <div>
                    <a id="notice-top" class="text-decoration-none text-secondary mx-2" target="_blank" href="https://wj.qq.com/s2/10287403/f4eb/">
                        <i class="bi bi-bell fs-5 position-relative">
                            <span
                                class="position-absolute top-0 start-100 translate-middle rounded-circle bg-secondary p-1 opacity-75">
                        </i>
    
                    </a>
                </div>
            </div>
        </nav>
    
        <!-- 底栏 -->
        <nav id="navbar" class="navbar navbar-light shadow-lg fixed-bottom border-top border-1 rounded-top p-2 d-md-none"
            style="backdrop-filter: blur(9px) brightness(0.7); background-color: rgba(255, 255, 255, 0.7);">
            <!-- 底栏的容器 -->
            <div class="container-fluid row-cols-5" style="max-width: 1320px">
                <!-- 图标部分 -->
                <a id="home-bottom" class="text-center text-decoration-none col text-secondary" href="/home.html"
                    one-link-mark="yes">
                    <i class="bi bi-house fs-5"></i>
                    <div style="font-size: 10px;">主页</div>
                </a>
                <a id="search-bottom" class="text-center text-decoration-none col text-secondary" href="/search.html"
                    one-link-mark="yes">
                    <i class="bi bi-search fs-5"></i>
                    <div style="font-size: 10px;">搜索</div>
                </a>
                <a id="index-bottom" class="text-center text-decoration-none col text-secondary" href="/index.html"
                    one-link-mark="yes">
                    <i class="bi bi-collection fs-5"></i>
                    <div style="font-size: 10px;">索引</div>
                </a>
                <a id="help-bottom" class="text-center text-decoration-none col text-secondary" href="/help.html"
                    one-link-mark="yes">
                    <i class="bi bi-question-circle fs-5"></i>
                    <div style=" font-size: 10px;">帮助</div>
            </div>
        </nav>`

  const toolBar =
    `<div class="toolbar"><div class="toolButton goTopButton" style="display: none;"><i class="bi bi-arrow-up-circle fs-5"></i></div></div>`
  const icon = {
    home: "bi-house",
    index: "bi-collection",
    weekly: "bi-calendar-week",
    help: "bi-question-circle"
  }
  // 插入顶栏
  $("#navbar").append(navbarHtml, toolBar).css('height', '40')

  // 点亮应用栏图标的函数
  function lightNavbarIcon() {
    // 用 / 把 URL 拆开，取出文档名，剔除参数。
    let documentFileName = location.href.split('/')
    documentFileName = documentFileName[documentFileName.length - 1].split(".html")[0]
    $(`#${documentFileName}-bottom i, #${documentFileName}-top i`).removeClass(icon[documentFileName]).addClass(icon[documentFileName] + '-fill')
    $(`#${documentFileName}-bottom, #${documentFileName}-top`).removeClass("text-secondary").attr("href", "#")
  }
  lightNavbarIcon();
  setTimeout(() => lightNavbarIcon(), 500); // 500ms 后再执行一次因为首页刚加载进来 url 里面没有文档名

  // 检查浏览器是否为 FireFox，然后关掉高斯模糊所需的透明
  if (navigator.userAgent.match('Firefox')) {
    console.log('发现 Firefox，正在禁用顶栏底栏透明...');
    $('#topbar, #navbar').css('background-color', 'rgba(255, 255, 255, 1)');
  }

  // 顶部搜索框的行为
  $('#search-top').click(function () {
    goSearch()
  })

  $('#search-label-top').keydown(function (e) {
    if (e.keyCode == 13) goSearch()
  })

  // 去搜索的函数
  function goSearch() {
    let text = $('#search-label-top').val()
    if (text == '') window.location.href = './search.html'
    else window.location.href = './search.html?q=' + encodeURIComponent(text)
  }

  // 检查是否需要显示回到顶部
  $(window).scroll(function () {
    var s = $(window).scrollTop()
    if (s > 500) $(".goTopButton").show()
    else $(".goTopButton").hide()
  })

  // 回顶部按钮的行为
  $(".goTopButton").click(function () {
    $("body,html").animate({ scrollTop: '0' }, 100)
  })

  const statistics = `
    <img src="https://www.bfcounter.vip/generatepic?userid=ce1d3f3b-ce67-4319-8222-e751f8262b2e"
        alt="Page Counter" class="visually-hidden">
    <script>
        var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?c3b6ee9c2eff1642f7465f8e97766227";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    </script>
    <script async defer 
        data-website-id="5aad3d7c-6372-42aa-957e-ed4c945c0d08"
        src="https://umami.magma.ink/umami.js"></script>
    `
  $("body").append(statistics)
})