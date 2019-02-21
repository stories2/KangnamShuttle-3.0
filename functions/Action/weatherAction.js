exports.getLatestWeatherInfo = function (request, response, callbackFunc) {
  const util = require('util')
  const convertManager = require('../Utils/convertManager')
  const action = JSON.parse(JSON.stringify(request.action))
  const responseManager = request.responseManager
  const functions = require('firebase-functions')
  var weatherApiInfo = global.envManager.getWeatherOpenApiInfo(functions)
  const weatherManager = require('../Core/weatherManager')
  var patchCurrentWeather = weatherManager.patchCurrentWeather
  var getWeatherDataFromDB = weatherManager.getWeatherDataFromDB

  patchCurrentWeather(weatherApiInfo, function (status) {
    if (status) {
      global.log.info('weatherAction', 'getLatestWeatherInfo', 'ok, latest weather info patched')
    } else {
      global.log.warn('weatherAction', 'getLatestWeatherInfo', 'something gonna wrong while patch latest weather')
    }

    getWeatherDataFromDB(function (weatherData) {
      var listTemplateItems = action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]['listCard']['items']
      action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]['listCard']['items'] = []

      listTemplateItems['0']['description'] = util.format(listTemplateItems['0']['description'], weatherData['weather'][0]['description'])
      listTemplateItems['1']['description'] = util.format(listTemplateItems['1']['description'], Math.floor(convertManager.convertKelvinToCelsius(weatherData['main']['temp'])))
      listTemplateItems['2']['description'] = util.format(listTemplateItems['2']['description'], Math.floor(convertManager.convertKelvinToCelsius(weatherData['main']['temp_min'])), Math.floor(convertManager.convertKelvinToCelsius(weatherData['main']['temp_max'])))
      listTemplateItems['3']['description'] = util.format(listTemplateItems['3']['description'], Math.floor(weatherData['wind']['speed']))
      listTemplateItems['4']['description'] = util.format(listTemplateItems['4']['description'], Math.floor(weatherData['main']['humidity']))

      for (var index in listTemplateItems) {
        action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]['listCard']['items'].push(listTemplateItems[index])
      }

      responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
      for (var index in action['quickReplies']) {
        responseManager.pushQuickReply(action['quickReplies'][index])
      }

      callbackFunc()
    })
  })
}
