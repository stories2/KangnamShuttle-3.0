exports.shuttleOrderMenu = function (request, response, callbackFunc) { // 달구지라, 어떤걸 알려줄까요 #100
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleOrderMenu", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    responseManager.pushTemplate(action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
    for(var index in action["quickReplies"]) {
        responseManager.pushQuickReply(action["quickReplies"][index])
    }
    callbackFunc()
}

exports.shuttleSelectDirection = function (request, response, callbackFunc) { // 어디로 갈껀가요 #101
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleSelectDirection", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var template = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
    var templateButtons = template["basicCard"]["buttons"]
    template["basicCard"]["buttons"] = []
    for(var index in templateButtons) {
        template["basicCard"]["buttons"].push(templateButtons[index])
    }

    responseManager.pushTemplate(template)
    for(var index in action["quickReplies"]) {
        responseManager.pushQuickReply(action["quickReplies"][index])
    }
    callbackFunc()
}

exports.shuttleDirectionUp = function (request, response, callbackFunc) { // 상행선 가까운 도착 시간 안내 #102
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleDirectionUp", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var template = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
    var templateItems = template["listCard"]["items"]
    template["listCard"]["items"] = []
    for(var index in templateItems) {
        template["listCard"]["items"].push(templateItems[index])
    }

    responseManager.pushTemplate(template)
    for(var index in action["quickReplies"]) {
        responseManager.pushQuickReply(action["quickReplies"][index])
    }
    callbackFunc()
}

exports.shuttleDirectionDown = function (request, response, callbackFunc) { // 하행선 가까운 도착 시간 안내 #103
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleDirectionDown", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var template = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
    var templateItems = template["listCard"]["items"]
    template["listCard"]["items"] = []
    for(var index in templateItems) {
        template["listCard"]["items"].push(templateItems[index])
    }

    responseManager.pushTemplate(template)
    for(var index in action["quickReplies"]) {
        responseManager.pushQuickReply(action["quickReplies"][index])
    }
    callbackFunc()
}