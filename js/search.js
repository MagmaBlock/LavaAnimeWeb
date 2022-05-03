$(() => {
    if (getUrlParams().name) {
        $("#search-label").val(decodeURIComponent(getUrlParams().name))
        if (!bgmSearch(getUrlParams().name) && !nameSearch(getUrlParams().name)) notFound()
    }
})

function goSearch() {
    let text = $('#search-label').val()
    if (text) {
        let url = './search.html?name=' + encodeURIComponent(text)
        if (history.pushState) {
            window.history.pushState(null, null, url)
            // console.log(getUrlParams())
            $("#search-label").val(decodeURIComponent(getUrlParams().name))
            if (!bgmSearch(getUrlParams().name) && !nameSearch(getUrlParams().name)) notFound()
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
            console.log(data.code)
            if (data.code == 0) {
                print(data)
                successFlag = true
            }
        }
    })
    return successFlag
}

function bgmSearch(id) {
    let successFlag = false
    $.ajax({
        url: config.api.url + '/v1/search/bgm/' + id,
        async: false,
        success: function (data) {
            console.log(data.code)
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
    clearAnimeList($(`#${containerId}`))
    $("#search-result-container").append(`
    <div class='alert alert-secondary mx-3'>\\アッカリ～ン!/ <br>没有在番剧库内找到相关的番组...</div>
    `)
}