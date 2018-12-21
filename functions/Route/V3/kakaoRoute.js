exports.continue = function (request, response) {
    const scenarioManager = require('../../Core/scenarioManager')

    global.log.debug("kakaoRoute", "continue", "continue body: " + JSON.stringify(request.body))

    request.responseManager.pushTemplate(
        {
            "simpleText": {
                "text": request.body.userRequest.utterance
            }
        }
    )
    request.responseManager.pushQuickReply(
        {
            "label": "안녕?",
            "action": "message",
            "messageText": "안녕!"
        }
    )
    request.responseManager.flushResponse(response)
}

exports.action = function (request, response) {

    if(!request.params.hasOwnProperty("index")) {
        global.log.warn("kakaoRoute", "action", "action index is empty")
        request.responseManager.badRequest(response, {})
        return
    }
    var actionIndex = request.params.index

    global.log.debug("kakaoRoute", "action", "action index: " + actionIndex)
    global.log.debug("kakaoRoute", "action", "action body: " + JSON.stringify(request.body))

    request.responseManager.pushTemplate(
        {
            "simpleText": {
                "text": "#" + actionIndex + ", " + request.body.userRequest.utterance
            }
        }
    )
    request.responseManager.pushQuickReply(
        {
            "label": "안녕?",
            "action": "message",
            "messageText": "안녕!"
        }
    )
    request.responseManager.flushResponse(response)
}