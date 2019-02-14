exports.date2FormattedDateTimeStr = function (date, format) {
    var dateFormat = require('dateformat')

    return dateFormat(date, format)
}

exports.convertKelvinToCelsius = function (kelvin) {
    return kelvin - 273.15
}

exports.ConvertCurrentDayOfWeekStartAtOne = function () {
    const datetimeManager = require('./datetimeManager')
    var currentTimezoneDate = datetimeManager.getCurrentTime()
    if(currentTimezoneDate.getDay() == global.define.DATE_TIME_SATURDAY) {
        global.log.info("ConvertManager", "ConvertCurrentDayOfWeekStartAtOne", "converted to sat")
        return global.define.SUBWAY_SATURDAY_OF_WEEK
    }
    else if(currentTimezoneDate.getDay() == global.define.DATE_TIME_SUNDAY) {
        global.log.info("ConvertManager", "ConvertCurrentDayOfWeekStartAtOne", "converted to sun")
        return global.define.SUBWAY_SUNDAY_OF_WEEK
    }
    else {
        global.log.info("ConvertManager", "ConvertCurrentDayOfWeekStartAtOne", "converted to normal")
        return global.define.SUBWAY_NORMAL_DAY_OF_WEEK
    }
}