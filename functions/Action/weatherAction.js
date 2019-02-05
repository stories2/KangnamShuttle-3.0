exports.getLatestWeatherInfo = function (request, response, callbackFunc) {
    const functions = require('firebase-functions');
    var weatherApiInfo = global.envManager.getWeatherOpenApiInfo(functions)
    const weatherManager = require('../Core/weatherManager')

    weatherManager.patchCurrentWeather(weatherApiInfo, function (status) {
        if(status) {
            global.log.info("weatherAction", "getLatestWeatherInfo", "ok, latest weather info patched")
        }
        else {
            global.log.warn("weatherAction", "getLatestWeatherInfo", "something gonna wrong while patch latest weather")
        }


    })
}