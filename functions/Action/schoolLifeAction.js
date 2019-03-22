exports.selectSchoolLifeService = function(request, response, callbackFunc) {
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug('schoolLifeAction', 'selectSchoolLifeService', 'user data: ' + JSON.stringify(request.user) + ' action data: ' + JSON.stringify(request.action))
  
    responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
    for (var index in action['quickReplies']) {
      responseManager.pushQuickReply(action['quickReplies'][index])
    }
    callbackFunc()
}

exports.syncLatestSchoolLifeSchedule = function(request, response, callbackFunc) {
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug('schoolLifeAction', 'syncLatestSchoolLifeSchedule', 'user data: ' + JSON.stringify(request.user) + ' action data: ' + JSON.stringify(request.action))

    const buttonsList = action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["basicCard"]["buttons"]
    action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["basicCard"]["buttons"] = []
    
    for(var index in buttonsList) {
        action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["basicCard"]["buttons"].push(buttonsList[index])
    }

    responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
    for (var index in action['quickReplies']) {
      responseManager.pushQuickReply(action['quickReplies'][index])
    }
    callbackFunc()
}

exports.latestLibrarySeatStatus = function(request, response, callbackFunc) {
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug('schoolLifeAction', 'latestLibrarySeatStatus', 'user data: ' + JSON.stringify(request.user) + ' action data: ' + JSON.stringify(request.action))

    const buttonsList = action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["listCard"]["buttons"]
    action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["listCard"]["buttons"] = []

    const itemList = action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["listCard"]["items"] || []
    action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["listCard"]["items"] = []
    
    for(var index in buttonsList) {
        action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["listCard"]["buttons"].push(buttonsList[index])
    }

    responseManager.pushTemplate(action['response'][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
    for (var index in action['quickReplies']) {
      responseManager.pushQuickReply(action['quickReplies'][index])
    }
    callbackFunc()
}