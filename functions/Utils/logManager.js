exports.info = function (moduleName, methodName, message) {
    var util = require('util')
    logDateTime = this.GetCurrentTime()
    logMsg = util.format(global.define.LOGGING_STRING_FORMAT_INFO, logDateTime, moduleName, methodName, message)
    console.log(logMsg)
}

exports.debug = function (moduleName, methodName, message) {
    var util = require('util')
    logDateTime = this.GetCurrentTime()
    logMsg = util.format(global.define.LOGGING_STRING_FORMAT_DEBUG, logDateTime, moduleName, methodName, message)
    console.log(logMsg)
}

exports.warn = function (moduleName, methodName, message) {
    var util = require('util')
    logDateTime = this.GetCurrentTime()
    logMsg = util.format(global.define.LOGGING_STRING_FORMAT_WARN, logDateTime, moduleName, methodName, message)
    console.warn(logMsg)
}

exports.error = function (moduleName, methodName, message) {
    var util = require('util')
    logDateTime = this.GetCurrentTime()
    logMsg = util.format(global.define.LOGGING_STRING_FORMAT_ERROR, logDateTime, moduleName, methodName, message)
    console.error(logMsg)
}

exports.GetCurrentTime = function () {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

exports.pushLogMsg = function (data, type) {
    var admin = global.admin
    const datetimeManager = require('./datetimeManager')
    var currentDateTime = datetimeManager.getCurrentTime()
    var log = {
        datetime: currentDateTime.toISOString(),
        sec: currentDateTime.getTime(),
        type: type,
        data: JSON.stringify(data)
    }
    global.log.debug("logManager", "pushLogMsg", "log msg: " + JSON.stringify(log))
    var systemLogRef = admin.database().ref(global.define.DB_PATH_SYSTEM_LOG)
    systemLogRef.push().set(log, function (error) {
        if(error) {
            global.log.error("logManager", "pushLogMsg", "cannot save log to db: " + JSON.stringify(error))
        }
        else {
            global.log.info("logManager", "pushLogMsg", "new log added")
        }
    })
}