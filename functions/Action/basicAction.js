exports.hello = function (request, response, callbackFunc) {
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("basicAction", "hello", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    responseManager.pushTemplate(action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
    for(var index in action["quickReplies"]) {
        responseManager.pushQuickReply(action["quickReplies"][index])
    }
    callbackFunc()
}