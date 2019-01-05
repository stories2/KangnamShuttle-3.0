exports.run = function (request, response, callbackFunc) {

    global.log.info("actionManager", "run", "init action runner")
    const getCurrentActionIndex = this.getCurrentActionIndex
    const getCurrentActionBox = this.getCurrentActionBox
    const executeOrder = this.executeOrder

    getCurrentActionIndex(request, function (actionIndex) {
        getCurrentActionBox(actionIndex, function (action) {
            request.action = action
            executeOrder(request, response, actionIndex)

            callbackFunc()
        })
    })
}

exports.getCurrentActionIndex = function (request, callbackFunc) {

    const util = require('util')
    const admin = global.admin
    var userDbPath = util.format(global.define.DB_PATH_USERS_USER_KEY, request.body["userRequest"]["user"]["type"])
    var userText = request.body["userRequest"]["utterance"]

    global.log.debug("actionManager", "getCurrentActionIndex", "current user text: " + userText + " user db path: " + userDbPath)

    userRef = admin.database().ref(userDbPath)
    userRef.once("value", function (userSnapshot) {
        var userSnapshotData = JSON.parse(JSON.stringify(userSnapshot))
        if(userSnapshotData !== undefined && userSnapshotData != null) {

            request.user = userSnapshotData
            global.log.debug("actionManager", "getCurrentActionIndex", "user info: " + JSON.stringify(userSnapshotData))
            if(request.params.hasOwnProperty("index")) {
                userSnapshotData["action"] = request.params.index
                global.log.debug("actionManager", "getCurrentActionIndex", "request action param exist: " + userSnapshotData.action)

                var userSnapshotDataStr = JSON.stringify(userSnapshotData)
                global.log.debug("actionManager", "getCurrentActionIndex", "path: " + userDbPath + " update: " + userSnapshotDataStr)
                admin.database().ref(userDbPath).set(userSnapshotData, function (error) {
                    if(error) {
                        global.log.error("actionManager", "getCurrentActionIndex", "cannot save data: " + JSON.stringify(error))
                    }
                    else {
                        global.log.info("actionManager", "getCurrentActionIndex", "data updated successfully")
                    }
                })

                callbackFunc(userSnapshotData.action)
            }
            else {
                var actionDbPath = util.format(global.define.DB_PATH_ACTIONS_ACTION_INDEX, userSnapshotData.action)

                global.log.debug("actionManager", "getCurrentActionIndex", "find action from: " + actionDbPath)

                actionRef = admin.database().ref(actionDbPath)
                actionRef.once("value", function(actionSnapshot) {

                    var actionSnapshotData = JSON.parse(JSON.stringify(actionSnapshot))

                    global.log.debug("actionManager", "getCurrentActionIndex", "action: " + JSON.stringify(actionSnapshotData))

                    for(var index in actionSnapshotData.quickReplies) {
                        var reply = actionSnapshotData.quickReplies[index]
                        global.log.debug("actionManager", "getCurrentActionIndex", "reply #" + index + " data: " + JSON.stringify(reply))
                        if(reply.messageText == userText) {
                            userSnapshotData.action = actionSnapshotData.nextAction[index]

                            global.log.debug("actionManager", "getCurrentActionIndex", "user action detected at #" + index + " action updated: " + userSnapshotData.action)
                            break;
                        }
                    }

                    var userSnapshotDataStr = JSON.stringify(userSnapshotData)
                    global.log.debug("actionManager", "getCurrentActionIndex", "path: " + userDbPath + " update: " + userSnapshotDataStr)
                    admin.database().ref(userDbPath).set(userSnapshotData, function (error) {
                        if(error) {
                            global.log.error("actionManager", "getCurrentActionIndex", "cannot save data: " + JSON.stringify(error))
                        }
                        else {
                            global.log.info("actionManager", "getCurrentActionIndex", "data updated successfully")
                        }
                    })

                    callbackFunc(userSnapshotData.action)
                })
            }
        }
        else {
            global.log.warn("actionManager", "getCurrentActionIndex", "user not registered")
        }
    })

}

exports.getCurrentActionBox = function(actionIndex, callbackFunc) {
    const util = require('util')
    const admin = global.admin
    var actionDbPath = util.format(global.define.DB_PATH_ACTIONS_ACTION_INDEX, actionIndex)

    global.log.debug("actionManager", "getCurrentActionBox", "find action from: " + actionDbPath)
    actionRef = admin.database().ref(actionDbPath)
    actionRef.once("value", function(actionSnapshot) {
        if(actionSnapshot !== undefined || actionSnapshot != null) {
            global.log.debug("actionManager", "getCurrentActionBox", "action founded: " + JSON.stringify(actionSnapshot))
        }
        else {
            global.log.warn("actionManager", "getCurrentActionBox", "action not founded")
        }
        callbackFunc(actionSnapshot)
    })
}

exports.executeOrder = function (request, response, actionIndex) {
    const basicAction = require('../Action/basicAction')
    const thuSuAction = require('../Action/thuSuAction')

    const actionTable = {
        "1": basicAction.hello,
        "10000": thuSuAction.todayPantiesColor
    }

    global.log.debug("actionManager", "executeOrder", "execute action #" + actionIndex)

    actionTable[actionIndex](request, response)
}