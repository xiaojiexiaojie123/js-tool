
//  根据字符串获取对应的属性
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var val = window.location.search.substr(1).match(reg);
    if (val != null) {
        return decodeURI(val[2]);
    } else {
        return null;
    }
}
// 添加时间戳到url
function addTimestampToUrl () {
    var url = location.search;
    if (url.indexOf("?") !=- 1) {
        return url + '&time=' + (+new Date());
    }
    return url + '?time=' + (+new Date());
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";Path=/;domain=.61info.cn;" + expires;
    // console.log(cname + "=" + cvalue + ";Path=/;domain=61info.cn;" + expires);
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) ==0 ) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
// 检测某个元素是否出现在屏幕可视区域内
function measureElementInScreen (elem) {
    var elemRect = elem.getBoundingClientRect();
    var elemOffsetTop = elemRect.top;
    var elemHeight = elemRect.height;
    // 由于DOCTYPE并不在第一行，document.compatMode == 'BackCompat', 获取视口高度为document.body.clientHeight
    var clientHeight = document.body.clientHeight;
    return elemOffsetTop > -elemHeight && elemOffsetTop < clientHeight;
}
// 禁止底部滚动
function forbidScroll () {
    var bodyEl = document.body;
    var top = 0;
    return function (isFixed) {
        if (isFixed) {
            top = window.scrollY;

            bodyEl.style.position = 'fixed';
            bodyEl.style.top = -top + 'px';
        } else {
            bodyEl.style.position = '';
            bodyEl.style.top = '';
            window.scrollTo(0, top); // 回到原先的top
        }
    }
}
function checkCookieBeforeShow (cookieName, fn, days) {
    if (getCookie(cookieName) == '') {
        setCookie(cookieName, cookieName, days);
        fn && fn();
    }
}
// 节流
function throttle(fn, delay) {
    var last = 0;
    var timer = null;
    return function () {
        var context = this;
        var now = +new Date();
        if (now - last < delay) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                last = now;
                fn.apply(context);
            }, delay)
        } else {
            last = now;
            fn.apply(context)
        }
    }
}
// 解决toFixed精度不正确
function $tofixed (num, n) {
    var symbol = 1
    if (num < 0) {
        // 符号为负
        symbol = -1
        num *= -1
    }
    var num2 = (Math.round(num * Math.pow(10, n))
        / Math.pow(10, n) + Math.pow(10, -(n + 1)))
        .toString().slice(0, -1)
    return parseFloat(num2 * symbol).toFixed(n)
}
// 处理兼容blob
function toBlob(dataUrl) {
    var binaryString = window.atob(dataUrl.split(',')[1]);
    var arrayBuffer = new ArrayBuffer(binaryString.length);
    var intArray = new Uint8Array(arrayBuffer);
    for (var i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i);
    }

    var data = [intArray],
        blob;

    try {
        blob = new Blob(data);
    } catch (e) {
        window.BlobBuilder = window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder;
        if (e.name === 'TypeError' && window.BlobBuilder) {
            var builder = new BlobBuilder();
            builder.append(arrayBuffer);
            blob = builder.getBlob(imgType); // imgType为上传文件类型，即 file.type
        } else {
            console.log('版本过低，不支持上传图片');
        }
    }
    return blob;
}
//将base64转换为文件
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}
// 倒计时
function NewTimer (totalMilliSec, changeAct, endAct, interval) {
        this.totalMilliSec = totalMilliSec;
        this.changeAct = changeAct;
        this.endAct = endAct;
        this.interval = interval ? interval : (totalMilliSec > 24 * 3600 * 1000 ? 1000 : (interval ? interval : 100));
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.millisecond = 0;
        this.calculate = function () {
            this.day = Math.floor(this.totalMilliSec / (3600 * 1000 * 24));
            this.hour = Math.floor(this.totalMilliSec / 1000 / 60 / 60 % 24);
            this.minute = Math.floor(this.totalMilliSec / 1000 / 60 % 60);
            this.second = Math.floor(this.totalMilliSec / 1000 % 60);
            this.millisecond = Math.floor((this.totalMilliSec % 1000) / 100);

            this.hour = this.hour < 10 ? '0' + this.hour : this.hour;
            this.minute = this.minute < 10 ? '0' + this.minute : this.minute;
            this.second = this.second < 10 ? '0' + this.second : this.second;

            this.changeAct([this.day, this.hour, this.minute, this.second, this.millisecond]);
        }
        this.startCountDown = function () {
            this.calculate();
            var _this = this;
            var timer = setInterval(function () {
                if (_this.totalMilliSec == 24 * 60 * 60 * 1000 && !interval) {
                    window.location.reload();
                }
                if (_this.totalMilliSec < 0) {
                    clearInterval(timer);
                    _this.endAct && _this.endAct();
                } else {
                    _this.calculate();
                    _this.totalMilliSec -= _this.interval;
                }
            }, _this.interval);
            return timer;
        }
    }