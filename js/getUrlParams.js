// 网页参数匹配函数。代码来自网络
function getUrlParams() {
    let obj = {};

    if (!window) {
        return;
    }

    let str = window.location.search || '';

    if (str && str.slice(1)) {
        // 去掉 ？ ，然后以 & 分割
        let queryArray = str.slice(1).split('&');
        queryArray.map((query) => {
            // param=value 以 = 分割
            let temp = query.split('=');
            if (temp.length > 1) {
                // 收集参数
                obj[temp[0]] = temp[1];
            }
        })
    }

    return obj;
}