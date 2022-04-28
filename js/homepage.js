// 首页轮播图
axios('./assets/headerPic.json')
    .then((result) => {
        dict = result.data
        console.log('成功取得词典：', dict);
        $(".carousel-indicators").append(`<li data-bs-target="#headerPic" data-bs-slide-to="0" class="active"></li>`)
        for (let i = 1; i < dict.length; i++) 
            $(".carousel-indicators").append(`<li data-bs-target="#headerPic" data-bs-slide-to="${i}"></li>`)
        
        $(".carousel-inner").append(
            `<div class="carousel-item active">
                <img src="${dict[0].pic}" class="d-block w-100 head-pic" alt="${dict[0].title}">
                <div class="carousel-caption">
                    <h5>${dict[0].title}</h5><p>${dict[0].subtitle}</p>
                </div>
            </div>`) // 手机隐藏文字在class加d-none d-md-block
        for (let i = 1; i < dict.length; i++) {
            $(".carousel-inner").append(
                `<div class="carousel-item">
                    <a href=${dict[i].url}>
                        <img src="${dict[i].pic}" class="d-block w-100 head-pic" alt="${dict[i].title}">
                        <div class="carousel-caption">
                            <h5>${dict[i].title}</h5><p>${dict[i].subtitle}</p>
                        </div>
                    </a>
                </div>`)
        }
    })