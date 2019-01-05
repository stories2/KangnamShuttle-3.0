exports.todayPantiesColor = function (request, response, callbackFunc) {
    const util = require('util')
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("thuSuAction", "todayPantiesColor", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(action))


    global.log.debug("thuSuAction", "todayPantiesColor", "response: " + JSON.stringify(action["response"]))
    var currentResponseTemplate = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
    var pantiIndex = Math.floor(Math.random() * (global.define.ZERO + global.define.LIST_OF_PANTIES_COLOR.length))

    currentResponseTemplate["simpleText"]["text"] = util.format(currentResponseTemplate["simpleText"]["text"], global.define.LIST_OF_PANTIES_COLOR[pantiIndex])

    global.log.debug("thuSuAction", "todayPantiesColor", "panti #" + pantiIndex + " generated text: " + currentResponseTemplate["simpleText"]["text"])

    responseManager.pushTemplate(currentResponseTemplate)
    responseManager.pushQuickReply(action["quickReplies"])
    callbackFunc()
}