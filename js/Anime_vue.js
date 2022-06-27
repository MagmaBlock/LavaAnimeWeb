function goBack() { window.location.href = document.referrer }
const config = {
    // "api": "https://anime-api.5t5.top",
    "api": "http://192.168.0.102:8090",
    "bangumiApi": "https://bgm-api.5t5.top"
}

const app = Vue.createApp({
    data() {
        return {
            lavaAnime: {
                "year": "某年",
                "type": "某分类",
                "name": "某番剧",
                "views": 1,
                "bgmid": "",
                "title": "正在获取...",
                "poster": ""
            },
            relations: [],
            bangumi: {
                "date": "2022-04-09",
                "platform": "...",
                "name": "正在获取...",
                "name_cn": "正在获取...",
                "tags": [],
                "eps": 12,
            },
            rating: '',
            videoList: [],
            tagedClassMap: {
                "quality": "bg-secondary",
                "source": "bg-success",
                "version": "bg-light text-dark",
                "language": "bg-info text-dark",
                "other": "bg-secondary",
                "format": "bg-dark text-light",
                "unknow": "bg-warning"
            },
            leftViews: 2,
            tagsShowMore: false,
            tags: [{
                name: '正在获取...', count: 0
            }],
            tagsHide: [{
                name: '正在获取...', count: 0
            }],
            loading: false,
            background: { background: '', opacity: 0, height: '40%' },
        }
    },
    async mounted() {
        await this.getLavaAnimeApi();
        this.getRelations();
        this.getBangumiApi();
        this.getVideoList();
    },
    methods: {
        getLavaAnimeApi() {
            return new Promise(async (resolve, reject) => {
                let thisAnime = (await axios(config.api + '/v1/anime/id/' + getUrlParams().la)).data;
                thisAnime = thisAnime.data;
                this.background.background = 'url(' + (thisAnime.poster).replace('/poster', '/bg') + ')';
                setTimeout(() => {
                    this.background.opacity = 1;
                    this.background.height = '100%';
                }, 1000)
                console.log(this);
                console.log('成功取得番剧库后端数据：', thisAnime)
                this.lavaAnime = thisAnime;
                resolve()
            })
        },
        async getRelations() {
            let relations = (await axios(config.api + '/v1/anime/relations/' + this.lavaAnime.bgmid)).data.data;
            console.log('关联番剧数据：', relations);
            this.relations = relations;
        },
        async getBangumiApi() {
            let bangumiData = (await axios(config.api + '/v1/anime/bangumi/subjects/' + this.lavaAnime.bgmid)).data.data;
            console.log('成功取得番剧计划数据(番剧库镜像)：', bangumiData);
            this.bangumi = bangumiData;
            if (this.bangumi.rating.score >= 8) { // 如果评分高于 8 则添加优秀
                this.rating = `评分极佳 ${this.bangumi.rating.score}`
            } else if (this.bangumi.rating.score >= 7 && this.bangumi.rating.score < 8) { // 如果评分在 7-8 之间则添加不错
                this.rating = `评分优秀 ${this.bangumi.rating.score}`
            } else if (this.bangumi.rating.score <= 5) { // 如果评分低于 5 则添加红色提示
                this.rating = `评分较差 ${this.bangumi.rating.score}`
            } else {
                this.rating = `评分 ${this.bangumi.rating.score}`
            }
            this.tags = [], this.tagsHide = [];
            for (let i in this.bangumi.tags) {
                if (i <= this.bangumi.tags.length / 3) {
                    this.tags.push(this.bangumi.tags[i])
                } else {
                    this.tagsHide.push(this.bangumi.tags[i])
                }
            }
        },
        async getVideoList() {
            let videoList = (await axios(config.api + '/v1/anime/list/' + this.lavaAnime.id)).data.data;
            console.log('获取视频列表：', videoList);
            this.videoList = videoList;
        },
        async addView() {
            if (this.leftViews == 0) {
                console.log('本会话观看量已加满');
                return;
            }
            this.lavaAnime.views++
            this.leftViews--;
            let result = (await axios(config.api + '/v1/view/add/' + this.lavaAnime.id)).data;
            console.log('添加观看次数：', result.data);
        },
        hideLoading() {
            this.loading = false;
        },
        showLoading() {
            this.loading = true;
        }
    }
}).mount('#root');
