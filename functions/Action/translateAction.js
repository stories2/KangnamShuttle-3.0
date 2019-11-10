exports.translateStringToOtherLang = function (request, response, callbackFunc) {
    const action = JSON.parse(JSON.stringify(request.action))
    const reqText = request.body["userRequest"]["utterance"]
    const translate = require('@vitalets/google-translate-api')
    global.log.debug("translateAction", "translateStringToOtherLang", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(action))
    global.log.debug("translateAction", "translateStringToOtherLang", "req text: " + reqText)

    var makeResponseTemplate = function(responseText) {
        const responseManager = request.responseManager
        const util = require('util')
        var actionText = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleText"]["text"]
        actionText = util.format(actionText, responseText)
        action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleText"]["text"] = actionText
        responseManager.pushTemplate(action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
        for(var index in action["quickReplies"]) {
            responseManager.pushQuickReply(action["quickReplies"][index])
        }
    }

    translate(reqText, {to: action.lang})
        .then(result => {
            global.log.debug("translateAction", "translateStringToOtherLang", "translate result: " + JSON.stringify(result))
            makeResponseTemplate(result["text"])
            callbackFunc()
        })
        .catch(error => {
            global.log.error("translateAction", "translateStringToOtherLang", "cannot translate: " + JSON.stringify(error))
            makeResponseTemplate("이런, 번역 요정이 장난을 쳐버렸군요.")
            callbackFunc()
        })
}

exports.hello = function (request, response, callbackFunc) {
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("translateAction", "hello", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    responseManager.pushTemplate(action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
    for(var index in action["quickReplies"]) {
        responseManager.pushQuickReply(action["quickReplies"][index])
    }
    callbackFunc()
}