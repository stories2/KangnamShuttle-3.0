exports.selectPlayType = function(request, response, callbackFunc) {
  const action = JSON.parse(JSON.stringify(request.action))
  const responseManager = request.responseManager
  global.log.debug('playAction', 'selectPlayType', 'user data: ' + JSON.stringify(request.user) + ' action data: ' + JSON.stringify(request.action))

  responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
  for (var index in action['quickReplies']) {
    responseManager.pushQuickReply(action['quickReplies'][index])
  }
  callbackFunc()
}

exports.readyForRockScissorsPapper = function(request, response, callbackFunc) {
  const action = JSON.parse(JSON.stringify(request.action))
  const responseManager = request.responseManager
  global.log.debug('playAction', 'selectPlayType', 'user data: ' + JSON.stringify(request.user) + ' action data: ' + JSON.stringify(request.action))

  responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
  for (var index in action['quickReplies']) {
    responseManager.pushQuickReply(action['quickReplies'][index])
  }
  callbackFunc()
}

exports.rockScissorsPapper = function (request, response, callbackFunc) {
  const util = require('util')
  const action = JSON.parse(JSON.stringify(request.action))
  const responseManager = request.responseManager
  var winningTable = {
    "✌ 가위": [
      2, 1, 3
    ],
    "✊ 바위": [
      3, 2, 1
    ],
    "✋ 보": [
      1, 3, 2
    ]
  }
  var type = ["✌ 가위", "✊ 바위", "✋ 보"]
  var min = 0, max = 2
  var botResponse = Math.floor(Math.random() * (max - min + 1)) + min
  var currentUserText = request.body['userRequest']['utterance']
  global.log.debug('playAction', 'rockScissorsPapper', 'bot response: ' + botResponse + ' text: ' + currentUserText)
  if(winningTable.hasOwnProperty(currentUserText)) {
    var reaction = action['response'][winningTable[currentUserText][botResponse]]
    global.log.debug('playAction', 'rockScissorsPapper', 'user data: ' + JSON.stringify(request.user) + ' action data: ' + JSON.stringify(request.action))
    global.log.debug('playAction', 'rockScissorsPapper', 'bot response' + type[botResponse] + ' user: ' + currentUserText + ' reaction: ' + reaction)
    var responseFormat = action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleText"]["text"]
    var responseText = util.format(responseFormat, type[botResponse], reaction)
  }
  else {
    global.log.warn("playAction", "rockScissorsPapper", "wrong input detected: " + currentUserText)
    responseText = action['response'][4]
  }
  action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleText"]["text"] = responseText

  responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
  for (var index in action['quickReplies']) {
    responseManager.pushQuickReply(action['quickReplies'][index])
  }
  callbackFunc()
}

exports.rollingDie = function (request, response, callbackFunc) {
  const util = require('util')
  const action = JSON.parse(JSON.stringify(request.action))
  const responseManager = request.responseManager
  global.log.debug('playAction', 'rollingDie', 'user data: ' + JSON.stringify(request.user) + ' action data: ' + JSON.stringify(request.action))
  var min = 1, max = 6
  var die = Math.floor(Math.random() * (max - min + 1)) + min

  global.log.debug('playAction', 'rollingDie', 'die: ' + die)

  var responseFormat = action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleText"]["text"]
  var responseText = util.format(responseFormat, die)
  action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleText"]["text"] = responseText

  responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
  for (var index in action['quickReplies']) {
    responseManager.pushQuickReply(action['quickReplies'][index])
  }
  callbackFunc()
}