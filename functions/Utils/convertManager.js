exports.date2FormattedDateTimeStr = function (date, format) {
    var dateFormat = require('dateformat')

    return dateFormat(date, format)
}

exports.convertKelvinToCelsius = function (kelvin) {
    return kelvin - 273.15
}