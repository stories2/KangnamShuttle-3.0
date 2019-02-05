exports.patchCurrentWeather = function (apiParams, callbackFunc) {
    const util = require('util')
    var httpReqManager = require('../Utils/httpRequestManager')
    var setWeatherData2DB = this.setWeatherData2DB
    global.log.debug("weatherManager", "patchCurrentWeather", "api data: " + JSON.stringify(apiParams))

    var httpHeadersOptions = {
        hostname: "api.openweathermap.org",
        path: "/data/2.5/weather",
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'text/html',
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Referer": "http://web.kangnam.ac.kr/",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
            // "Cookie": sessionId
        }
    }


    var endpoint = "%s?q=%s&appid=%s&lang=%s"
    httpHeadersOptions["path"] = util.format(endpoint, httpHeadersOptions["path"], apiParams["local_name"], apiParams["key"], apiParams["lang"])
    global.log.debug("weatherManager", "patchCurrentWeather", "fake header option: " + JSON.stringify(httpHeadersOptions))

    httpReqManager.request(httpHeadersOptions, function (weatherResult, weatherResultStr) {
        var weatherData = JSON.parse(weatherResultStr)
        if(weatherData["cod"] == global.define.HTTP_STATUS_CODE_OK) {
            global.log.debug("weatherManager", "patchCurrentWeather", "weather req result received: " + weatherResultStr)
            setWeatherData2DB(weatherData, function (status) {
                callbackFunc(status)
            })
        }
        else {
            global.log.warn("weatherManager", "patchCurrentWeather", "weather api server returns wrong code: " + weatherResultStr)
            callbackFunc(false)
        }
    }, function (error) {
        global.log.error("weatherManager", "patchCurrentWeather", "cannot get weather req result: " + JSON.stringify(error))
        callbackFunc(false)
    }, null)
}

exports.setWeatherData2DB = function (weatherData, callbackFunc) {
    var admin = global.admin
    var datetimeManager = require('../Utils/datetimeManager')
    var currentDateTime = datetimeManager.getCurrentTime()
    weatherData["updateDateTime"] = currentDateTime.toISOString()
    weatherData["updateDateTimeSec"] = currentDateTime.getTime()

    var weatherRef = admin.database().ref(global.define.DB_PATH_OPEN_API_WEATHER)
    weatherRef.set(weatherData, function (error) {
        if(error) {
            global.log.error("weatherManager", "setWeatherData2DB", "cannot save weather info: " + JSON.stringify(error))
            callbackFunc(false)
        }
        else {
            global.log.info("weatherManager", "setWeatherData2DB", "weather data saved")
            callbackFunc(true)
        }
    })
}