$(() => {
    if (getUrlParams().q) {
        $("#search-label").val(decodeURIComponent(getUrlParams().q))
        if (!bgmSearch(getUrlParams().q) && !nameSearch(getUrlParams().q)) notFound()
    } else if (getUrlParams().name) {
        $("#search-label").val(decodeURIComponent(getUrlParams().name))
        if (!bgmSearch(getUrlParams().name) && !nameSearch(getUrlParams().name)) notFound()
    } else if (getUrlParams().bgm) {
        console.log("使用旧版 Bangumi ID 搜索：", getUrlParams().bgm)
        console.log("注意：此方法将被移除！")
        $("#search-label").val(decodeURIComponent(getUrlParams().bgm))
        if (!bgmSearch(getUrlParams().bgm)) notFound()
    }
})

function goSearch() {
    let text = $('#search-label').val()
    if (text) {
        let url = './search.html?q=' + encodeURIComponent(text)
        if (history.pushState) {
            window.history.pushState(null, null, url)
            // console.log(getUrlParams())
            $("#search-label").val(decodeURIComponent(getUrlParams().q))
            if (!bgmSearch(getUrlParams().q) && !nameSearch(getUrlParams().q)) notFound()
        } else window.location.href = url // 如果不支持，使用旧的解决方案
    }
}

const config = {
    "api": { "url": "https://anime-api.5t5.top" }
}

const containerId = "search-result-container"

function nameSearch(name) {
    let successFlag = false
    $.ajax({
        url: config.api.url + '/v1/search/name/' + name,
        async: false,
        success: function (data) {
            if (data.code == 0) {
                print(data)
                successFlag = true
            }
        }
    })
    return successFlag
}

function bgmSearch(id) {
    if (!(id > 0)) return false
    let successFlag = false
    $.ajax({
        url: config.api.url + '/v1/search/bgm/' + id,
        async: false,
        success: function (data) {
            if (data.code == 0) {
                PrintAnimeList($(`#${containerId}`), data.data)
                // print(data)
                successFlag = true
            }
        }
    })
    return successFlag
}

function print(data) {
    console.log(data)
    PrintAnimeList($(`#${containerId}`), data.data)
}

function notFound() {
    clearAnimeList($(`#${containerId}`)).removeClass()
    $("#search-result-container").append(`
    <div class='alert alert-secondary mx-3'>\\アッカリ～ン!/ <br>没有在番剧库内找到相关的番组...</div>
    `)
}