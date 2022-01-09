// 总函数，向指定容器打印番组卡片
function printAnimeList(containerId, year, month, backParams) {
    // 从云盘取目录列表
    animeList = getAnimeList(year, month)

    console.log('成功从熔岩云盘取得 ' + year + '年 ' + month + ' 的番组列表：', animeList)

    // 新建一个数组，方便后面的生成
    var animeListNameAndId = new Array()
    // 把 animeList 里面的所有 name 拆开填进数组
    for (var i = 0; i < animeList.length; i++) {
        animeListNameAndId[i] = getBgmId(animeList[i].name)
    }
    console.log(animeListNameAndId)

    // 清空容器
    $("#" + containerId).empty()
    // 循环生成卡片
    for (var i = 0; i < animeList.length; i++) {
        // 生成番剧卡骨架, 传入目标容器、番剧名、番剧路径、番组计划ID、文件夹ID
        printAnimeCardTable(containerId, animeListNameAndId[i].animeName, animeList[i].path + '/' + animeList[i].name, animeListNameAndId[i].bgmId, animeList[i].id, backParams)
        printAnimeCardDetail(animeList[i].id, animeListNameAndId[i].bgmId)
    }


}


// 取得 API 番剧列表数据, 需要传入年月信息
function getAnimeList(year, month) {
    var animeList = 'error'
    $("#loading").fadeIn()
    $("#anime-container").empty()
    $.ajax({
        beforeSend: () => { $("#loading").fadeIn() },
        async: false,
        url: "https://dav.5t5.top/api/v3/share/list/jqMFl/" + year + "年/" + month,  //默认当前页
        success: response => {
            animeList = response.data.objects
            mySort(animeList, "name")
        },
        error: function (e) {
            console.log('取得番组列表时熔岩云盘发生错误：', e)
        },
        complete: setTimeout(() => { $("#loading").fadeOut() }, 1000)
    })
    return animeList
}

// 提供番剧文件夹名，取得番组计划 ID
// 返回数组 {bgmId:ID,animeName:番剧名}
function getBgmId(str) {
    // 匹配此文件夹末尾的 BgmId
    var bgmId = str.match("\\d+$")[0]
    var animeName = str.replace(str.match("\\d+$"), "").substr(0, str.replace(str.match("\\d+$"), "").length - 1);
    // 如果匹配失败
    if (bgmId == null) {
        console.log("提供的字符串 \"" + str + "\" 不是一个合法的番剧库番组名！")
    }
    // console.log('剥出番组ID和名称', { 'bgmId': bgmId, 'animeName': animeName })
    return { 'bgmId': bgmId, 'animeName': animeName }
}

// 生成一个番剧卡骨架, 传入目标容器、番剧名、番剧路径、番组计划ID、文件夹ID、回主页的参数
function printAnimeCardTable(containerId, animeName, animePath, bgmId, dirId, backParams) {
    $("#" + containerId).addClass("row row-cols-auto mx-2")
    var newAnimeCard = '<div id="' + dirId + '" class="col-4 col-sm-3 col-lg-2 px-2 mb-2"><a href="anime.html?path=' + animePath + '&' + backParams + '" class="text-decoration-none text-black"><img class="rounded mb-1 img-fluid shadow-sm" src="./assets/loading.png"><br><div style="font-size: small;">' + animeName + '</div></a><a class="text-decoration-none text-secondary" style="font-size: 12px;" target="_blank" href="https://bgm.tv/subject/' + bgmId + '"><i class="bi bi-link-45deg"></i> 番组计划</a></div>'
    $("#" + containerId).append(newAnimeCard);
}


// 提供文件夹ID, 同时提供番组计划ID，即可向卡片内填充番组信息。
function printAnimeCardDetail(dirId, bgmId) {
    $.ajax({
        url: "https://bgm-api.5t5.top/v0/subjects/" + bgmId,  //默认当前页
        success: function (response) {
            $("#" + dirId + "> a > img" ).attr("src", response.images.large.replace("lain.bgm.tv", "anime-img.5t5.top")+'/poster')
        },
        error: function (e) {  //请求超时回调
            if (e.statusText == "timeout") {
                alert("请求超时")
            }
        },
        complete: function () { }, //无论请求是成功还是失败都会执行的回调，常用全局成员的释放，或者页面状态的重置
    })
}