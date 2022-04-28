function PrintAnimeList(container, animeList) {
    container.empty().addClass("row row-cols-auto mx-2") // 清空容器

    for (let i = 0; i < animeList.length; i++) {
        let thisAnimeId = animeList[i].id;
        let thisAnimeTitle = animeList[i].title;
        let thisAnimePoster = animeList[i].poster;
        let thisAnimeBgmId = animeList[i].bgmid;
        let thisAnimeViews = animeList[i].views;
        let newAnimeCard =
            `
        <div id="${thisAnimeId}" class="col-4 col-sm-3 col-lg-2 px-2 mb-2">
            <a href="anime.html?la=${thisAnimeId}" class="text-decoration-none text-black">
                <img class="rounded mb-1 shadow-sm" src="${thisAnimePoster}" style="object-fit: cover; width: 100%;">
                <div style="font-size: 13px; line-height: 18px; min-height: 36px"">${thisAnimeTitle}</div>
            </a>
            <div class="text-secondary" style="font-size: 12px; line-height: 18px;">
                <i class="bi bi-play-btn"></i><span> 播放 ${thisAnimeViews} 次</span><br>
                <a class="text-secondary text-decoration-none" target="_blank" href="https://bgm.tv/subject/${thisAnimeBgmId}">
                    <i class="bi bi-link-45deg"></i> 番组计划
                </a>
            </div>
        </div>
        `
        container.append(newAnimeCard);
    }

}