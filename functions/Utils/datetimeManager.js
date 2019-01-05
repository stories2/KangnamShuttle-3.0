exports.getCurrentTime = function() {
    date = new Date()
    var currentDate = date
    date = new Date(currentDate.valueOf() + global.define.GMT_KOREA_TIME_MIN * global.define.HOUR_TO_MILE)
    global.log.debug("datetimeManager", "getCurrentTime", "set timezone: " + currentDate.toISOString() + " -> " + date.toISOString())
    return date
}