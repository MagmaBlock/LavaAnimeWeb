const config = {
  "api": { "url": "https://anime-api.5t5.top" },
  "agefansDomain": "www.agemys.com",
  "bangumiApi": "https://api.bgm.tv/v0/subjects/"
}

var thisPageId, thisPageAnimeData, thisPageBangumiData

$(document).ready(async function () {

  // 特效
  $("#la-list-container").hide()
  $('#la-anime-header').hide()

  console.log('地址栏参数数据: ', getUrlParams())
  if (getUrlParams().la != undefined) { // 如果有 la ID, 则获取该界面的数据
    thisPageId = getUrlParams().la // 此界面的 ID
    thisPageAnimeDataRaw = (await axios(config.api.url + '/v1/anime/id/' + thisPageId)).data;
    thisPageAnimeData = thisPageAnimeDataRaw.data
    console.log('成功取得 API Data：', thisPageAnimeData);
    if (thisPageAnimeDataRaw.code == 0) { // 如果获取成功
      // 填充路径
      let arrowIcon = '<i class="bi bi-arrow-right-short"></i>'
      let pathHtml = thisPageAnimeData.year + arrowIcon + thisPageAnimeData.type + arrowIcon + thisPageAnimeData.name
      $("#la-path").empty().append(pathHtml)
      // 修改网页标题
      $('title').text($('title').text().replace("熔岩番剧库", thisPageAnimeData.title))
      // 修改背景图
      if (thisPageAnimeData.poster != undefined) {
        backgroundUrl = thisPageAnimeData.poster.replace('/poster', '/bg')
        $("#bg").css("background-image", "url(" + backgroundUrl + ")")
      }
      // 填充播放量
      $("#views").empty().append(` 播放 ${thisPageAnimeData.views} 次`)
      // 特效，渐变展示头部卡片
      $('#la-anime-header').fadeIn()

      if (thisPageAnimeData.bgmid != '000000') { // 如果这个番剧是一个 Bangumi 番剧
        getBangumiApi() // 获取 Bangumi 番剧的 API 数据并显示在页面上
        getAgefans() // 获取 Agefans 番剧的数据并显示在页面上
        getRelatins() // 获取相关番剧的数据并显示在页面上
      } else { // 如果这个番剧不是一个 Bangumi 番剧
        $('#name_cn').append(thisPageAnimeData.title)
        $('#rating-box, #eps-box, #show-more').hide()
        $('#more-link').empty().append('<span class="fw-lighter text-secondary">本作是 Bangumi 未收录番剧 （或者可能根本不是一个影视作品！）</span>')
        $('#bg').css('background-image', 'url(https://anime-img.5t5.top/assets/no-bgm-bg.jpg/bg)')
      }
      getFileList() // 打印文件列表
    } else { // code != 0
      AnimePath = '未找到番组'
      thisId = ''
      $(`#views`).empty().append(` 没人观看过此番组, 因为它不存在. 😢`)
      $('#rating-box, #show-more, #more-link').hide()
      $("#la-list-container").append("<div style='opacity: 85%;' class='alert alert-warning'><span>错误: 未取得番组信息。<a class='alert-link' href='./index.html'>返回主页</a></span></div>")
      $("#loading").fadeOut()

      $("#la-list-container").fadeIn()
      $('#la-anime-header').fadeIn()
    }

  } else if (getUrlParams().bgm != undefined) {
    var thisPageBgmId = getUrlParams().bgm // 此界面的 ID
    axios(config.api.url + '/v1/anime/bgm/' + thisPageBgmId)
      .then((result) => {
        if (result.data.code == 0) {
          thisPageAnimeData = result.data.data[0]
          thisPageId = thisPageAnimeData.id
          console.log('成功取得番剧库 API 数据：', thisPageAnimeData)
          // 填充路径
          let arrowIcon = '<i class="bi bi-arrow-right-short"></i>'
          let pathHtml = thisPageAnimeData.year + arrowIcon + thisPageAnimeData.type + arrowIcon + thisPageAnimeData.name
          $("#la-path").empty().append(pathHtml)
          // 修改背景图
          backgroundUrl = thisPageAnimeData.poster.replace('/poster', '/bg')
          $("#bg").css("background-image", "url(" + backgroundUrl + ")")
          // 填充播放量
          $("#views").empty().append(` 播放 ${thisPageAnimeData.views} 次`)
          // 特效，渐变展示头部卡片
          $('#la-anime-header').fadeIn()

          if (thisPageAnimeData.bgmid != '000000') { // 如果这个番剧是一个 Bangumi 番剧
            getBangumiApi() // 获取 Bangumi 番剧的 API 数据并显示在页面上
            getAgefans() // 获取 Agefans 番剧的数据并显示在页面上
            getRelatins() // 获取相关番剧的数据并显示在页面上
          } else { // 如果这个番剧不是一个 Bangumi 番剧
            $('#name_cn').append(thisPageAnimeData.title)
            $('#rating-box, #eps-box, #show-more').hide()
            $('#more-link').empty().append('<span class="fw-lighter text-secondary">本作是 Bangumi 未收录番剧 （或者可能根本不是一个影视作品！）</span>')
            $('#bg').css('background-image', 'url(https://anime-img.5t5.top/assets/no-bgm-bg.jpg/bg)')
          }
          getFileList() // 打印文件列表
        } else {
          AnimePath = '未找到番组'
          thisId = ''
          $(`#views`).empty().append(` 没人观看过此番组, 因为它不存在. 😢`)
          $('#rating-box, #show-more, #more-link').hide()
          $("#la-list-container").append("<div style='opacity: 85%;' class='alert alert-warning'><span>错误: 未取得番组信息。<a class='alert-link' href='./index.html'>返回主页</a></span></div>")
          $("#loading").fadeOut()

          $("#la-list-container").fadeIn()
          $('#la-anime-header').fadeIn()
        }
      })
  } else {
    backParams = ''
    AnimePath = '未找到番组'
    thisId = ''
    $(`#views`).empty().append(` 没人观看过此番组, 因为它不存在. 😢`)
    $('#rating-box, #show-more, #more-link').hide()
    $("#la-list-container").append("<div style='opacity: 85%;' class='alert alert-warning'><span>错误: 未取得番组信息。<a class='alert-link' href='./index.html'>返回主页</a></span></div>")
    $("#loading").fadeOut()

    $("#la-list-container").fadeIn()
    $('#la-anime-header').fadeIn()
  }

})

function getBangumiApi() {
  // 获取 Bangumi API 然后填充数据
  axios(config.bangumiApi + thisPageAnimeData.bgmid)
    .then((result) => {
      thisPageBangumiData = result.data; // 此界面的 Bangumi 数据
      console.log('成功取得 Bangumi API Data：', thisPageBangumiData)

      $("#bangumi").attr("href", "https://bgm.tv/subject/" + thisPageBangumiData.id) // 设置番组计划链接
      if (thisPageBangumiData.name_cn == undefined || thisPageBangumiData.name_cn == '') { // 如果没有中文名, 则使用原名
        thisPageBangumiData.name_cn = thisPageBangumiData.name
      }
      $('#name_cn').append(`${thisPageBangumiData.name_cn}`) // 填充中文名
      $('#name').append(`${thisPageBangumiData.name}`) // 填充原名
      $('#platform').append(`${thisPageBangumiData.platform}`) // 填充番组放送平台
      $('#rating').append(` 评分 ${thisPageBangumiData.rating.score}`) // 填充评分
      if (thisPageBangumiData.rating.score <= 5) { // 如果评分低于 5 则添加红色提示
        $('#rating').empty().append(` 评分较差 ${thisPageBangumiData.rating.score}`).css('color', 'red')
      }
      if (thisPageBangumiData.rating.score >= 8) { // 如果评分高于 8 则添加优秀
        $('#rating').empty().append(` 评分极佳 ${thisPageBangumiData.rating.score}`)
      }
      if (thisPageBangumiData.rating.score >= 7 && thisPageBangumiData.rating.score < 8) { // 如果评分在 7-8 之间则添加不错
        $('#rating').empty().append(` 评分优秀 ${thisPageBangumiData.rating.score}`)
      }
      if (thisPageBangumiData.eps == undefined || thisPageBangumiData.eps == 0) {
        $('#eps').append(` 总 ${thisPageBangumiData.total_episodes} 话`)
      }
      else { $('#eps').append(` 总 ${thisPageBangumiData.eps} 话`) }
      $('#tags-hide').hide() // 隐藏标记量较少的标签
      $('#show-more').on('click', function () { // 点击显示更多标签
        $('#tags-hide').fadeIn()
        $('#show-more').hide()
      })
      for (let i = 0; i < thisPageBangumiData.tags.length; i++) { // 填充标签
        if (i <= thisPageBangumiData.tags.length / 3) {
          $('#tags').append(`<span class="badge bg-secondary text-wrap">${thisPageBangumiData.tags[i].name} ${thisPageBangumiData.tags[i].count}</span> `)
        } else {
          $('#tags-hide').append(`<span class="badge bg-secondary">${thisPageBangumiData.tags[i].name} ${thisPageBangumiData.tags[i].count}</span> `)
        }
      }
      if ($('#tags')[0].innerHTML == '') { // 如果已有的标签实在太少了，则显示所有标签
        $('#tags-hide').show()
        $('#show-more').hide()
      }
    })
}

function getAgefans() {
  // 获取 Agefans 数据, 数据来自 https://github.com/czy0729/Bangumi-Static/
  $("#agefans").empty().append('<div class="spinner-grow spinner-grow-sm" role="status"></div> 正在加载 Agefans 番剧列表...')
  axios("https://anime-img.5t5.top/api/agefans/anime.min.json")
    .then((result) => {
      let agefansData = result.data
      console.log('成功取得 Agefans Data：', agefansData)
      let agefansId = ''
      for (var i = 0; i < agefansData.length; i++) {
        if (agefansData[i].id == thisPageAnimeData.bgmid) {
          console.log('解析到当前 Bangumi ID 对应的 Agefans 数据: ', agefansData[i])
          $("#agefans").empty().append('<i class="bi bi-link-45deg"></i> 去 Agefans 观看')
          $("#agefans").attr("href", `https://${config.agefansDomain}/detail/${agefansData[i].a}`)
          agefansId = agefansData[i].a
        }
      }
      if (agefansId == '') {
        $("#agefans").empty().append('<i class="bi bi-slash-circle"></i> 暂未在 Agefans 找到此番剧')
      }
    })
    .catch((error) => {
      console.log(error)
      if (error) $("#agefans").empty().append('<i class="bi bi-slash-circle"></i> Agefans API 故障')
    })
}

function getRelatins() { // 获取相关番剧
  axios(config.api.url + '/v1/anime/relations/' + thisPageAnimeData.bgmid)
    .then((result) => {
      let relationsData = result.data.data
      console.log('成功取得关联数据：', relationsData)
      for (let i = 0; i < relationsData.length; i++) {
        axios(config.api.url + '/v1/anime/bgm/' + relationsData[i].id)
          .then((result) => {
            let thisRelationAnimeData = result.data.data
            if (thisRelationAnimeData.length == 1) { // 如果只有一个番剧，则直接跳转
              let thisRelationAnime = thisRelationAnimeData[0]
              let html = `
                            <a class="mb-2 me-1 mt-1 btn btn-outline-primary" href="/anime.html?la=${thisRelationAnime.id}">
                                <span class="lead" style="font-size: 16px;">${thisRelationAnime.title}</span>
                            <div class="fw-light text-secondary" style="font-size: 12px;">${relationsData[i].relation}</div></a>
                            `
              $('#relations').append(html)
            }
            else {
              console.log('本作关联的番剧 Bangumi ID 在数据库中有多个：', thisRelationAnimeData);
              for (let j = 0; j < thisRelationAnimeData.length; j++) {
                let thisRelationAnime = thisRelationAnimeData[j]
                let html = `
                                <a class="mb-2 me-1 mt-1 btn btn-outline-primary" href="/anime.html?la=${thisRelationAnime.id}">
                                    <span class="lead" style="font-size: 16px;">${thisRelationAnime.title}</span>
                                <div class="fw-light text-secondary" style="font-size: 12px;">${relationsData[i].relation}</div></a>
                                `
                $('#relations').append(html)
              }
            }
          })
      }
    }).catch((error) => { console.error(error) })
}

var leftViews = 2 // 一次打开页面后, 可以增加的播放量上限
function addView() {
  if (leftViews > 0) {
    axios(config.api.url + '/v1/view/add/' + getUrlParams().la)
      .then((result) => {
        let data = result.data
        console.log('成功增加播放量: ', data, ' 剩余播放量: ', leftViews - 1)
        if (data.code == 200) {
          $(`#views`).empty().append(` 播放 ${data.data} 次`)
          leftViews--
        } else {
          console.log('更新播放量失败: ', data)
          $(`#views`).empty().append(` 获取失败`)
        }
      })
  }
}

function getFileList() {
  axios(config.api.url + '/v1/anime/list/' + thisPageId)
    .then((result) => {
      let fileList = result.data.data
      console.log('成功取得文件列表：', fileList)
      if (fileList.length == 0) { // 如果没有文件列表
        console.log('文件列表为空!')
        let airDate = thisPageAnimeData.type ? thisPageAnimeData.year + thisPageAnimeData.type : '未知 / 暂未定档' // 如果有提供放送日期, 则提取放送日期
        setTimeout(() => {
          $("#la-list-container")
            .append(
              `<div style="opacity: 85%;" class="alert alert-info">
                <span>
                  暂时还未在此番剧 / 作品下找到资源，可能的原因是：<br>
                  此作品尚未上映、尚无资源或番剧库尚未入库。<br>
                  请确认此作品已经上映, 根据 Bangumi Wiki, 本作的开始放送日期为: ${airDate}<br>
                  <a class='alert-link' href='./index.html'>返回主页</a>
                </span>
              </div>`
            ).fadeIn()
          $("#loading").fadeOut()
          $('#rating-box').hide() // 如果没有资源(通常是未开播), 则隐藏评分框
        }, 1500);
      } else {
        // 获取字典并开始生成列表
        axios('./assets/dict.json')
          .then((result) => {
            dict = result.data
            // console.log('成功取得词典：', dict)
            fileList.forEach((thisFile, i) => {
              printAnimeList(thisFile, i)
            })
          })
      }
    })
}

function printAnimeList(thisFile, thisFileId) { // i 用作 HTML ID
  // console.log('开始生成番剧列表: ', thisFile)

  let thisFileName = thisFile.name
  let thisFileSize = thisFile.size
  let thisFileUrl = thisFile.url
  let thisFileTempUrl = thisFile.tempUrl
  let thisFileType
  if (thisFile.type == 'dir') thisFileType = 'dir' // 如果是目录, 则设置为 dir
  if (thisFile.type == 'file') { // 如果是文件, 则设置为后缀名
    if (thisFileName.match('.')) thisFileType = thisFileName.split('.').pop() // 提取文件后缀名

    // 对文件名进行标签化
    function tagName(fileName, dict) {

      // 先进行简单拆分，只用 [ ] & + 拆开文件名
      let splitedFileName = fileName.split(/\[|\]|&|\+/); // 拆分
      for (let i = 0; i < splitedFileName.length; i++) { // 对文件名中的每个词进行判断
        splitedFileName[i] = splitedFileName[i].trim() // 去除首尾空格
        if (splitedFileName[i] == '') {
          splitedFileName.splice(i, 1) // 去除空元素
          i = i - 1;
        }
      }

      // 判断前三个词是否是发布组名
      let groupNames = new Array(); // 找到的发布组名会存在此内
      let forTimes = splitedFileName.length >= 3 ? 3 : splitedFileName.length - 1; // 如果文件名长度大于等于3, 则只判断前三个词
      for (let i = 0; i < forTimes; i++) { // 把数组的前三个元素和发布组的词典进行比对，这已是发布组名可能出现位置的极限
        for (let j = 0; j < dict.length; j++) { // 遍历词典
          // 如果词典中的词是发布组词，且匹配成功
          if (dict[j].class == 'group' && splitedFileName[i].match(new RegExp(dict[j].from, 'i'))) {
            groupNames.push(dict[j].to) // 将发布组词添加到 groupNames 中
            splitedFileName.splice(i, 1) // 删除匹配成功的词
            i = i - 1; // 因为删除了一个元素, 所以 i 减 1
            break;
          }
        }
      }

      // 将文件名拼回来，然后拆的更散
      let reformedFileName = ''
      for (let i = 0; i < splitedFileName.length; i++) {
        if (i < splitedFileName.length) reformedFileName = reformedFileName + splitedFileName[i] + "|";
        if (i == splitedFileName.length) reformedFileName = reformedFileName + splitedFileName[i];
      }
      reformedFileName = reformedFileName.split(/\||\(|\)|-|_|,| /) // 这次用 | ( ) - _ , 还有空格拆开
      for (let i = 0; i < reformedFileName.length; i++) { // 对文件名中的每个词进行判断
        reformedFileName[i] = reformedFileName[i].trim() // 去除首尾空格
        if (reformedFileName[i] == '') {
          reformedFileName.splice(i, 1) // 去除空元素
          i = i - 1;
        }
      }

      // 开始用词典进行标签化
      for (let i = 0; i < reformedFileName.length; i++) {
        for (let j = 0; j < dict.length; j++) {
          let thisRegExp = new RegExp(dict[j].from, 'i')
          if (reformedFileName[i].replace(thisRegExp, '').trim() == '') {
            // console.log('原文: ', reformedFileName[i]);
            // console.log("正则: ", dict[j].from, "匹配: ", match)
            reformedFileName[i] = {
              tag: dict[j].to,
              from: reformedFileName[i],
              type: dict[j].class,
              regExp: thisRegExp
            };
            break;
          }
        }
      }

      // 开始识别文件集数
      let thisFileEpisode // 此处是 undefined，如果后面匹配失败，则是 null

      for (let i = reformedFileName.length; i > 0; i--) { // 习惯情况下均为集数在后，所以从后往前匹配
        if (typeof reformedFileName[i] == 'string') { // 如果是字符串
          // ↓ 这里是当前遍历的，被上面的算法识别完成后仍然为字符串的元素，顺带删除 S02 / S2 这种季度标
          let thisString = reformedFileName[i].replace(/S\d{1,2}/i, '');
          // 集数匹配算法，匹配 1-2 位数字
          thisFileEpisode = thisString.match(/(EP|E|P|)\d{1,2}(END|v2|v3|.5|)/i);
          if (thisFileEpisode) { // 如果匹配成功
            if (thisFileEpisode[0] != thisFileEpisode.input) {
              console.log('丢弃非全匹配', ` ${thisFileEpisode[0]} => ${thisFileEpisode.input}`);
              thisFileEpisode = null; // 如果不是全匹配，丢弃
              continue;
            }
            thisFileEpisode = thisFileEpisode[0];
            thisFileEpisode = thisFileEpisode.replace(/v2|v3|END|EP|E|P/gi, '')
            break;
          }
        }
      }

      if (thisFileEpisode == undefined || thisFileEpisode == null) { // Failed
        thisFileEpisode = '';
      }
      let noEpisode = !(thisFileName.endsWith('.mkv') || thisFileName.endsWith('.mp4')); // 仅 mkv 或 mp4 文件识别集数才有意义
      if (noEpisode) thisFileEpisode = ''

      return { groupNames, reformedFileName, thisFileEpisode }; // 返回发布组名和标签化的文件名
    }

    let tagedNameObject = tagName(thisFileName, dict); // 标签化文件名，是包含两个对象的数组
    console.log('匹配结果: ', tagedNameObject);
    let tagedName = '' // 根据上面内容生成的HTML
    for (let i in tagedNameObject.groupNames) { // 生成组名
      tagedName = tagedName + `<span class="badge bg-primary">${tagedNameObject.groupNames[i]}</span> `;
    }
    for (let i in tagedNameObject.reformedFileName) { // 生成文件名
      let thisElement = tagedNameObject.reformedFileName[i];
      if (typeof thisElement == 'string') {
        tagedName = tagedName + thisElement + ' ';
      }
      if (typeof thisElement == 'object') {
        let className = {
          "quality": "bg-secondary",
          "source": "bg-success",
          "version": "bg-light text-dark",
          "language": "bg-info text-dark",
          "other": "bg-secondary",
          "format": "bg-dark text-light",
          "unknow": "bg-warning"
        }
        className = className[thisElement.type] || className.unknow;
        tagedName = tagedName + `<span class="badge ${className}">${thisElement.tag}</span> `;
      }

    }

    // 生成文件列表的 HTML
    let thisFileHTML = $('#file-element-template').html();
    thisFileHTML = thisFileHTML.replace(/\{\{id\}\}/g, thisFileId);
    thisFileHTML = thisFileHTML.replace(/\{\{tagedName\}\}/g, tagedName);
    thisFileHTML = thisFileHTML.replace(/\{\{rawName\}\}/g, thisFileName);
    thisFileHTML = thisFileHTML.replace(/\{\{ep\}\}/g, tagedNameObject.thisFileEpisode);
    $("#la-list-container").append(thisFileHTML)
    $(`#${thisFileId}`).on('click', () => {
      onFileClick(thisFileName, thisFileType, thisFileUrl, thisFileTempUrl)
    }) // 每个文件点击时的事件
    $('#loading').fadeOut()
    $("#la-list-container").fadeIn()
  }
}

function onFileClick(thisFileName, thisFileType, thisFileUrl, thisFileTempUrl) { // 需要将参数传递过来
  $(`#la-player-header`).empty().append(thisFileName) // 更新标题
  // 模板
  var mp4HelpMessage =
    `
        <p id="mp4HelpMessage" class="mb-0"><p class="text-secondary fw-light" style="font-size: 14px">
            黑屏 / 无法播放？可能是浏览器不支持 HEVC 编码, <br>请使用下方的按钮调用外部播放器。
        </p></p>
        `
  var mkvHelpMessage =
    `
        <div id="mkvHelpMessage" class="mb-1 fw-light">
            浏览器不支持当前格式 (MKV), 请使用外部播放器来播放。
            <div class="text-secondary" style="font-size: 14px">
                这是由于大部分浏览器均无法支持 HEVC 格式及 MKV 格式内封的字幕。
                <br>需要调用您设备上的播放软件播放。
            </div>
            <a class="text-decoration-none" href="./help.html">查看外部播放器安装使用帮助<a/>
        </div>
        <a id="mkvPlayerBtn" class="btn btn-sm btn-outline-secondary mb-4 mt-0">强制用浏览器打开（不支持内封字幕和 HEVC）</a>
        `
  var otherPlayers =
    `
        <h5 class="mb-2">外部播放</h5>
        <div class="container-fluid p-0" id="otherPlayers">
            <!-- 列表 -->
            <ul class="list-group list-group-flush">
                <!-- 弹弹 -->
                <li class="list-group-item px-0 d-flex">
                    <span class="text-decoration-none w-50">
                        <img src="../assets/dandanplay.webp" style="height: 30px;" class="mx-1">
                        <span class="text-secondary fw-light align-middle mx-1">弹弹Play<span class="badge bg-secondary ms-2">弹幕</span>
                        </span>
                    </span>
                    <a class="text-decoration-none fw-light my-auto mx-1 w-25 text-center" href="ddplay:${encodeURIComponent(thisFileUrl + "|filePath=" + thisFileName)}" >Windows 端</a>
                    <a class="text-decoration-none fw-light my-auto mx-1 w-25 text-center" href="intent:${thisFileUrl}#Intent;package=com.xyoye.dandanplay;end">Android 端</a>
                </li>
                <!-- Pot / VLC -->
                <li class="list-group-item px-0 d-flex">
                    <a href="potplayer://${thisFileUrl}" class="text-decoration-none w-50">
                        <img src="../assets/PotPlayer.svg" style="height: 30px;" class="mx-1">
                        <span class="text-secondary fw-light align-middle mx-1">PotPlayer</span>
                    </a>
                    <a href="vlc://${thisFileUrl}" class="text-decoration-none w-50">
                        <img src="../assets/vlc.svg" style="height: 30px;" class="mx-1">
                        <span class="text-secondary fw-light align-middle mx-1">VLC</span>
                    </a>
                </li>
                <!-- IINA / Download -->
                <li class="list-group-item px-0 d-flex">
                    <a href="iina://weblink?url=${thisFileUrl}" class="text-decoration-none w-50">
                        <img src="../assets/iina.svg" style="height: 30px;" class="mx-1">
                        <span class="text-secondary fw-light align-middle mx-1">IINA</span>
                    </a>
                    <a href="${thisFileUrl}" class="text-decoration-none w-50">
                        <img src="../assets/download.svg" style="height: 30px;" class="mx-1">
                        <span class="text-secondary fw-light align-middle mx-1">下载</span>
                    </a>
                </li>
                <!-- 复制直链 -->
                <li class="list-group-item px-0" style="cursor:pointer" id="urlLabel">
                    <div class="text-decoration-none">
                        <img src="../assets/link.svg" style="height: 30px;" class="mx-1">
                        <span class="text-secondary fw-light align-middle mx-1 copy" data-clipboard-text="${thisFileUrl}">复制直链 <span
                            id="copy-info" class="badge bg-secondary ms-2">点击复制</span></span>
                    </div>
                </li>
            </ul>
        </div>
        `

  var urlLabel =
    `
        <!-- 复制直链 -->
        <ul class="list-group list-group-flush" >
            <li class="list-group-item px-0" style="cursor:pointer" id="urlLabel">
                <div class="text-decoration-none">
                    <img src="../assets/link.svg" style="height: 30px;" class="mx-1">
                    <span class="text-secondary fw-light align-middle mx-1 copy" data-clipboard-text="${thisFileUrl}">复制直链 <span
                        id="copy-info" class="badge bg-secondary ms-2">点击复制</span></span>
                </div>
            </li>
        </ul>
        `
  var downloadBtn =
    `
        <div class="row row-cols-3 mt-3">
            <div> </div>
            <a class="text-decoration-none text-secondary" href="${thisFileUrl}">
                <img class="img-fluid mx-auto d-block" style="width: 60%;" src="./assets/download.svg" alt="IINA"/>
                <div class="text-center" style="font-size: 12px;">
                    下载
                </div>
            </a>
            <div> </div>
        </div>
        `

  const dp = new DPlayer({
    container: document.getElementById('dplayer'),
    theme: '#2878ef',
    video: {
      url: thisFileUrl,
      screenshot: true,
      autoplay: true,
    },
  })

  dp.on('play', function () {
    addView();
  });

  if (thisFileType == 'mp4') {
    $("#la-player-body").empty().append(mp4HelpMessage + otherPlayers) // 加入操作按钮
  }
  if (thisFileType == 'mkv') {
    dp.destroy()
    $("#la-player-body").empty().append(mkvHelpMessage + otherPlayers)
    $('#otherPlayers > ul > li > a, #urlLabel').click(() => { // 点击第三方播放器
      addView()
    })
    $("#mkvPlayerBtn").click(() => { // 强制用浏览器打开
      $("#mkvHelpMessage").empty() // 清空提示
      $('#mkvPlayerBtn').remove()
      addView()
      const dp = new DPlayer({
        container: document.getElementById('dplayer'),
        video: { url: thisFileUrl, screenshot: true, autoplay: true, hotkey: true },
      })
    })
  }
  if (thisFileType == 'torrent') {
    dp.destroy()
    $("#la-player-body").empty().append("您打开了一个种子文件, 若有需要, 可点击下方按钮下载。" + "<br>" + urlLabel)
  }
  if (thisFileType == 'zip' || thisFileType == '7z' || thisFileType == 'rar') {
    dp.destroy()
    $("#la-player-body").empty().append(`您打开了一个压缩包, 若有需要, 可点击下方按钮下载。<br>${downloadBtn}${urlLabel}`)
  }
  if (thisFileType == 'png' || thisFileType == 'jpg' || thisFileType == 'jpeg' || thisFileType == 'gif' || thisFileType == 'webp') {
    dp.destroy()
    $("#la-img-view").empty().append('<img class="img-fluid " src="' + thisFileUrl + '">')
    $("#la-player-body").empty().append(thisFileName)
  }
  if (thisFileType == 'txt') {
    dp.destroy()
    $("#la-player-body").empty().append("您打开了一个文本文档, 若有需要, 可点击下方按钮下载。" + "<br>" + downloadBtn + urlLabel)
  }
  if (thisFileType == 'ass') {
    dp.destroy()
    $("#la-player-body").empty().append("您打开了一个外挂字幕, 若有需要, 可点击下方按钮下载。" + "<br>" + downloadBtn + urlLabel)
  }
  if (thisFileType == undefined) {
    dp.destroy()
    $("#la-player-body").empty().append("您打开了一个未知文件, 若有需要, 可点击下方按钮下载。" + "<br>" + downloadBtn + urlLabel)
  }

  // 为播放器增加关闭时销毁事件
  var lavaAnimeModalPlayer = document.getElementById('la-player')
  lavaAnimeModalPlayer.addEventListener('hide.bs.modal', function (event) {
    dp.destroy()
    $("#la-img-view").empty()
  })

  // 增加剪贴板复制
  var clipboard = new ClipboardJS('.copy', {
    container: document.getElementById('la-player')
  })

  // 复制成功提示
  clipboard.on('success', function (e) {
    console.info('复制操作:', e.action)
    console.info('文本:', e.text)
    console.info('触发器:', e.trigger)
    $("#copy-info").empty().append("复制成功").removeClass("bg-secondary").addClass('bg-success')

  })

  // 复制失败提示
  clipboard.on('error', function (e) {
    console.error('复制操作失败:', e.action)
    console.error('触发器:', e.trigger)
    $("#copy-info").empty().append("复制失败，请右键上方 [下载] 按钮选择复制链接").removeClass("bg-secondary").addClass('bg-danger')
  })

}