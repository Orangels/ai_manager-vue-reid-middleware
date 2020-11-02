
/**
 * 日期转换到格式化字符串
 * toFormatString("YYYY-MM-DD") : 2019-01-01 
 * toFormatString("YY-M-D") : 19-1-1
 */
Date.prototype.toFormatString = function ($f) {

    let i;

    // 年
    if ((/(Y+)/).test($f))
        $f = $f.replace(RegExp.$1, (i = RegExp.$1.length) > 1 ? String(this.getFullYear()).slice(-i) : String(this.getFullYear()));

    // 月
    if ((/(M+)/).test($f))
        $f = $f.replace(RegExp.$1, (i = RegExp.$1.length) > 1 ? String('0' + (this.getMonth() + 1)).slice(-i) : String(this.getMonth() + 1));

    // 日
    if ((/(D+)/).test($f))
        $f = $f.replace(RegExp.$1, (i = RegExp.$1.length) > 1 ? String('0' + this.getDate()).slice(-i) : String(this.getDate()));

    // 时
    if ((/(h+)/).test($f))
        $f = $f.replace(RegExp.$1, (i = RegExp.$1.length) > 1 ? String('0' + this.getHours()).slice(-i) : String(this.getHours()));

    // 分
    if ((/(m+)/).test($f))
        $f = $f.replace(RegExp.$1, (i = RegExp.$1.length) > 1 ? String('0' + this.getMinutes()).slice(-i) : String(this.getMinutes()));

    // 秒
    if ((/(s+)/).test($f))
        $f = $f.replace(RegExp.$1, (i = RegExp.$1.length) > 1 ? String('0' + this.getSeconds()).slice(-i) : String(this.getSeconds()));

    return $f;

};



/**
 * 数字转换到分隔字符串
 */
Number.prototype.toSeparateString = function () {

    return String(this).replace(/(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,');

};
