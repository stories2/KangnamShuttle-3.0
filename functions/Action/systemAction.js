exports.showSystemInfo = function(request, response, callbackFunc) { // 시스템 정보 안내 #9000
    const util = require('util')
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    const admin = global.admin
    global.log.debug("systemAction", "showSystemInfo", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(action))

    global.log.debug("systemAction", "showSystemInfo", "find action from: " + global.define.DB_PATH_SYSTEM_VERSION)
    var systemRef = admin.database().ref(global.define.DB_PATH_SYSTEM_VERSION)
    systemRef.orderByChild("time").limitToLast(global.define.ONE).once("value", function(systemSnapshot) {

        systemSnapshot = JSON.parse(JSON.stringify(systemSnapshot))
        global.log.debug("systemAction", "showSystemInfo", "latest system snapshot info: " + JSON.stringify(systemSnapshot))

        var responseTemplate = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
        for(var versionName in systemSnapshot) {
            responseTemplate["listCard"]["items"]["2"]["description"] = util.format(responseTemplate["listCard"]["items"]["2"]["description"], versionName)
        }

        var listItems = responseTemplate["listCard"]["items"]
        responseTemplate["listCard"]["items"] = []

        var listButtons = responseTemplate["listCard"]["buttons"]
        responseTemplate["listCard"]["buttons"] = []

        for(var index in listItems) {
            responseTemplate["listCard"]["items"].push(listItems[index])
        }
        for(var index in listButtons) {
            responseTemplate["listCard"]["buttons"].push(listButtons[index])
        }
        responseManager.pushTemplate(responseTemplate)
        for(var index in action["quickReplies"]) {
            responseManager.pushQuickReply(action["quickReplies"][index])
        }
        callbackFunc()
    })
}