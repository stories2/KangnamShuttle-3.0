exports.run = function (request, response, callbackFunc) {

    global.log.info("actionManager", "run", "init action runner")
    const isUserRegistered = this.isUserRegistered
    const getCurrentActionIndex = this.getCurrentActionIndex
    const getCurrentActionBox = this.getCurrentActionBox
    const executeOrder = this.executeOrder
    const updateLastRequestDateTime = this.updateLastRequestDateTime

    isUserRegistered(request, function (passed) { // <-- check user is registered
        if(passed) {
            updateLastRequestDateTime(request)
            getCurrentActionIndex(request, function (actionIndex) { // get user last or current action index
                getCurrentActionBox(actionIndex, function (action) { // get action info
                    request.action = action
                    executeOrder(request, response, actionIndex, callbackFunc) // execute order
                })
            })
        }
        else {
            callbackFunc() // <-- user not detected and cannot register it
        }
    })
}

exports.updateLastRequestDateTime = function(request) {
    const util = require('util')
    const admin = global.admin
    var userDbPath = util.format(global.define.DB_PATH_USERS_USER_KEY_UPDATE, request.body["userRequest"]["user"]["properties"]["plusfriendUserKey"])

    global.log.debug("actionManager", "updateLastRequestDateTime", "user db path: " + userDbPath)

    var userRef = admin.database().ref(userDbPath)
    userRef.once("value", function (userSnapshot) {
        var userSnapshotData = userSnapshot.val()

        userSnapshotData = global.datetime.getCurrentTime().toISOString()

        admin.database().ref(userDbPath).set(userSnapshotData)
    })
}

exports.isUserRegistered = function(request, callbackFunc) {
    const util = require('util')
    const admin = global.admin
    var userDbPath = util.format(global.define.DB_PATH_USERS_USER_KEY, request.body["userRequest"]["user"]["properties"]["plusfriendUserKey"])

    global.log.debug("actionManager", "isUserRegistered", "user db path: " + userDbPath)

    var userRef = admin.database().ref(userDbPath)
    userRef.once("value", function (userSnapshot) {
        var userSnapshotData = JSON.parse(JSON.stringify(userSnapshot))
        if(userSnapshotData === undefined || userSnapshotData == null) {
            global.log.warn("actionManager", "isUserRegistered", "user not registered")

            var defaultUserData = global.define.DEFAULT_USER_DATA
            defaultUserData["register"] = global.datetime.getCurrentTime().toISOString()
            defaultUserData["update"] = global.datetime.getCurrentTime().toISOString()

            admin.database().ref(userDbPath).set(global.define.DEFAULT_USER_DATA, function (error) {
                if(error) {
                    global.log.error("actionManager", "isUserRegistered", "cannot set user default data: " + JSON.stringify(error))
                    callbackFunc(false) // return with fail value
                }
                else {
                    global.log.info("actionManager", "isUserRegistered", "set user default data successfully")
                    callbackFunc(true) // return with success value
                }
            })
        }
        else { // <-- user already registered
            global.log.info("actionManager", "isUserRegistered", "user already registered")
            callbackFunc(true) // return with success value
        }
    })
}

exports.getCurrentActionIndex = function (request, callbackFunc) {

    const util = require('util')
    const admin = global.admin
    var userDbPath = util.format(global.define.DB_PATH_USERS_USER_KEY, request.body["userRequest"]["user"]["properties"]["plusfriendUserKey"])
    var userText = request.body["userRequest"]["utterance"]

    global.log.debug("actionManager", "getCurrentActionIndex", "current user text: " + userText + " user db path: " + userDbPath)

    var userRef = admin.database().ref(userDbPath)
    userRef.once("value", function (userSnapshot) {
        var userSnapshotData = JSON.parse(JSON.stringify(userSnapshot))

        request.user = userSnapshotData
        global.log.debug("actionManager", "getCurrentActionIndex", "user info: " + JSON.stringify(userSnapshotData))
        if(request.params.hasOwnProperty("index")) {
            userSnapshotData.action = request.params.index
            global.log.debug("actionManager", "getCurrentActionIndex", "request action param exist: " + userSnapshotData.action)

            var userSnapshotDataStr = JSON.stringify(userSnapshotData)
            global.log.debug("actionManager", "getCurrentActionIndex", "path: " + userDbPath + " update: " + userSnapshotDataStr)
            userRef.set(userSnapshotData, function (error) {
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

            var actionRef = admin.database().ref(actionDbPath)
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

exports.executeOrder = function (request, response, actionIndex, callbackFunc) {
    const basicAction = require('../Action/basicAction')
    const thuSuAction = require('../Action/thuSuAction')
    const shuttleAction = require('../Action/shuttleAction')
    const systemAction = require('../Action/systemAction')

    const actionTable = {
        "1": basicAction.hello,

        "100": shuttleAction.shuttleOrderMenu,
        "101": shuttleAction.shuttleSelectDirection,
        "102": shuttleAction.shuttleDirectionUp,
        "103": shuttleAction.shuttleDirectionDown,
        "120": shuttleAction.shuttleLocationPage,
        "130": shuttleAction.shuttleSchedulePic,
        "140": shuttleAction.shuttleRoute,

        "9000": systemAction.showSystemInfo,

        "10000": thuSuAction.todayPantiesColor
    }

    global.log.debug("actionManager", "executeOrder", "execute action #" + actionIndex)

    actionTable[actionIndex](request, response, callbackFunc) // <-- pass request, response, callbackFunc(flush response data)
}