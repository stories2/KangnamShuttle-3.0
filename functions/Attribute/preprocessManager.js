exports.addModules = function (request, response, next) {
  const responseManager = require('../Utils/responseManager')
  request.responseManager = responseManager

  global.log.info('preprocessManager', 'addModules', 'module responseManager added')

  var requestData = {
    'header': request.headers,
    'body': request.body
  }

  global.log.pushLogMsg(JSON.stringify(requestData), global.define.LOGGING_TYPE_PREPROCESS_MANAGER)

  return next()
}
