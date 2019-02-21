exports.continue = function (request, response) {
  const actionManager = require('../../Core/actionManager')

  global.log.debug('kakaoRoute', 'continue', 'continue body: ' + JSON.stringify(request.body))

  actionManager.run(request, response, function () {
    request.responseManager.flushResponse(response)
  })
}

exports.action = function (request, response) {
  if (!request.params.hasOwnProperty('index')) {
    global.log.warn('kakaoRoute', 'action', 'action index is empty')
    request.responseManager.badRequest(response, {})
    return
  }
  const actionManager = require('../../Core/actionManager')
  var actionIndex = request.params.index

  global.log.debug('kakaoRoute', 'action', 'action index: ' + actionIndex)
  global.log.debug('kakaoRoute', 'action', 'action body: ' + JSON.stringify(request.body))

  actionManager.run(request, response, function () {
    request.responseManager.flushResponse(response)
  })
}
