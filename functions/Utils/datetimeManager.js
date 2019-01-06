exports.getCurrentTime = function() {
    date = new Date()
    var currentDate = date
    date = new Date(currentDate.valueOf() + global.define.GMT_KOREA_TIME_MIN * global.define.HOUR_TO_MILE)
    global.log.debug("datetimeManager", "getCurrentTime", "set timezone: " + currentDate.toISOString() + " -> " + date.toISOString())
    return date
}

exports.getCurrentTimeSec = function (date) {

    var hour = date.getHours()
    var min = date.getMinutes()
    var sec = date.getSeconds()
    global.log.debug("datetimeManager", "getCurrentTimeSec", "time: " + date.toISOString() + " hour: " + hour + " min: " + min + " sec: " + sec)
    return hour * 3600 + min * 60 + sec * 1
}

exports.convertSecToTimeOrMin = function (comparison, sec1, sec2) { // must sec 2 is bigger
    var gap = sec2 - sec1
    if(gap > comparison) {
        var hour = Math.floor(sec2 / 3600)
        sec2 = sec2 - hour * 3600
        var min = Math.floor(sec2 / 60)
        sec2 = sec2 - min * 60
        var sec = sec2

        return "" + hour + ":" + min + ":" + sec
    }
    else {
        var min = Math.floor(gap / 60)
        return "" + min + "분 후"
    }
}