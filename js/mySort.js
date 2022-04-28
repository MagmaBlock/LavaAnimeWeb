//根据数组子项排序函数, 给出数组和排序的子项，原数组会被自动排序。代码来自网络
function mySort(list, field) {
    var str = list[0][field]
    var pattern = new RegExp("[\u4E00-\u9FA5]+")
    var pattern2 = new RegExp("[A-Za-z]+")
    //验证是否是中文
    if (pattern.test(str) || pattern2.test(str)) {
        list.sort(function (item1, item2) {
            return item1[field].localeCompare(item2[field], "zh-CN")
        })
    }
    //验证是否是数字
    var pattern3 = new RegExp("[0-9]+")
    if (pattern3.test(str)) {
        list.sort(function (a, b) {
            var value1 = a[field]
            var value2 = b[field]
            return value1 - value2
        })
    }
}