exports.selectEmergencyType = function (request, response, callbackFunc) {
  const action = JSON.parse(JSON.stringify(request.action))
  const responseManager = request.responseManager
  global.log.debug('emergencyAction', 'selectEmergencyType', 'user data: ' + JSON.stringify(request.user) + ' action data: ' + JSON.stringify(request.action))

  var buttonsList = action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]['basicCard']['buttons']
  action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]['basicCard']['buttons'] = []

  for (var key in buttonsList) {
    action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]['basicCard']['buttons'].push(buttonsList[key])
  }

  responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
  for (var index in action['quickReplies']) {
    responseManager.pushQuickReply(action['quickReplies'][index])
  }
  callbackFunc()
}
