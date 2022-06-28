// 首页轮播图
$(document).ready(() => {
    getCarousel()
    getCollections()

    // 获取并渲染首页轮播图的脚本
    async function getCarousel() {
        let element = $('#headerpicture > .carousel-inner')
        let data = (await axios('./assets/data/headerPic.json')).data
        console.log('取得轮播列表: ', data)
        let html = ''
        for (let i in data) {
            let activeClass = (i == 0) ? 'active' : ''
            let href = (data[i].url) ? `href="${data[i].url}"` : ''
            html +=
                `
                <a class="carousel-item ${activeClass}" ${href} style="background-image: url(${data[i].pic});">
                    <img src="${data[i].pic}" class="d-block w-100">
                    <div class="carousel-caption d-block">
                        <h5>${data[i].title}</h5>
                        <p>${data[i].subtitle}</p>
                    </div>
                </a>
                `
        }
        element.append(html)
    }

    async function getCollections() {
        /*
            获取并渲染首页推荐番剧的脚本
        */
        const config = {
            "api": { "url": "https://anime-api.5t5.top" }
        }

        const collections = (await axios('./assets/data/homepage-collections.json')).data;

        /*
            根据 Collections 数据生成推荐番剧列表，思路: 拿到每个 Collection 后，先遍历 content，生成一个骨架
            再把标题等内容填入渲染为 HTML。接着再遍历 content，让异步回调将数据填入骨架。
 
            有够麻烦的 什么时候学 Vue
        */
        for (let i = 0; i < collections.length; i++) { // 遍历全部番剧推荐
            let thisCollection = collections[i] // 当前推荐
            let thisCollectionContentHtml = '' // 当前推荐的正文(即一堆番剧和他们的标题)的 HTML
            for (let j = 0; j < thisCollection.content.length; j++) { // 循环每一个正文块，生成骨架
                let thisCollectionBlock = thisCollection.content[j]; // 当前正文块
                thisCollectionContentHtml = // 这个正文块的 HTML
                    thisCollectionContentHtml +
                    `<h2 class="mb-3">${thisCollectionBlock.title}</h2>
                    <div id="collectionBlock-${thisCollection.id}-${thisCollectionBlock.index}" class="LavaAnimeCollectionBlock mb-3"></div>`
            }
            let thisCollectionHtml = // HTML 骨架
                `<div class="card mb-3">
                    <div class="card-body">
                        <h1 class="display-5">${thisCollection.title}</h1>
                        <p class="text-muted fw-light">${thisCollection.subtitle}</p>
                        <div>${thisCollectionContentHtml}</div>
                    </div>
                </div>`
            $('#collections').append(thisCollectionHtml) // 渲染骨架
        }

        collections.forEach(function(thisCollection,i){ // 第二次遍历，主要是调用 API 填入番剧
            // thisCollection  当前推荐番剧组
            thisCollection.content.forEach(function(thisCollectionBlock){ // 循环每一个正文块，填入番剧
                // thisCollectionBlock // 当前正文块
                axios({ // 调用 API 获取番剧
                    method: 'post',
                    url: config.api.url + '/v1/anime/id',
                    data: thisCollectionBlock.anime
                }).then((result) => {
                    let thisCollectionBlockAnimeData = result.data.data
                    PrintAnimeList($(`#collectionBlock-${thisCollection.id}-${thisCollectionBlock.index}`), thisCollectionBlockAnimeData)
                    $(`#collectionBlock-${thisCollection.id}-${thisCollectionBlock.index}`).removeClass('mx-2')
                    $('.LavaAnimeAnimeCard').css({ "display": "inline-block", "vertical-align": "top" }) // 修改每个番剧卡片，让他们用 inline block 的方式显示以便实现溢出
                    $('.LavaAnimeCollectionBlock').removeClass('row row-cols-auto').addClass('overflow-scroll text-nowrap')
                    $('.LavaAnimeAnimeCardTitle, .LavaAnimeAnimeCardText').addClass('text-wrap')

                    // 鼠标滚轮横向移动
                    document.querySelectorAll(".LavaAnimeCollectionBlock").forEach(function (element) {
                        element.addEventListener("mousewheel", function (e) {
                            let v = -e.wheelDelta / 2 // 计算鼠标滚轮滚动的距离
                            if (v > 0 && element.scrollLeft < element.scrollWidth - element.clientWidth
                                || v < 0 && element.scrollLeft > 0) {
                                element.scrollLeft += v
                                e.preventDefault() // 阻止浏览器默认方法
                            }
                        }, false)
                    })
                })
            })
        })
    }
})

