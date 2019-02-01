exports.routineList = function(request, response, callbackFunc) {
    // /shuttle/schedule <- key is station id and /shuttle/schedule/<key>/name is station name
    var admin = global.admin
    var routineList = []

    var shuttleRutineRef = admin.database().ref(global.define.DB_PATH_SHUTTLE_SCHEDULE)
    shuttleRutineRef.once("value", function ( routineSnapshot ) {
        var routineSnapshotData = routineSnapshot.val()

        global.log.debug("shuttleManager", "routineList", "val: " + JSON.stringify(routineSnapshotData))

        for(var key in routineSnapshotData) {
            var routine = routineSnapshotData[key]
            global.log.debug("shuttleManager", "routineList", "key: " + JSON.stringify(key) + " routine: " + JSON.stringify(routine))
            routineList.push({
                "routineKey": key,
                "routineName": routine["name"]
            })
        }

        global.log.debug("shuttleManager", "routineList", "routineList: " + JSON.stringify(routineList))

        callbackFunc(routineList)
    })
}

exports.addRoutine = function(request, response, callbackFunc) {
    // /actions/101/quickReplies/2 ~ 4 <- routine selection for chat bot client
    var admin = global.admin

    var shuttleRutineRef = admin.database().ref(global.define.DB_PATH_SHUTTLE_SCHEDULE)
    shuttleRutineRef.once("value", function ( routineSnapshot ) {
        var routineSnapshotData = routineSnapshot.val()
        var routineKeyList = Object.keys(routineSnapshotData)

        if(routineKeyList.length >= global.define.MAXIMUM_OF_ROUTINE_SIZE) {
            global.log.warn("shuttleManager", "addRoutine", "routine already full")
            callbackFunc(false)
            return
        }

        var newRoutine = shuttleRutineRef.push()
        global.log.debug("shuttleManager", "addRoutine", "new routine: " + JSON.stringify(newRoutine.key))
        var routineName = request.body["name"]
        var newRoutineData = {
            name: routineName,
            Order: [],
            station: []
        }

        var newRoutineButton = {
            action: "message",
            key: newRoutine.key,
            label: routineName,
            messageText: routineName
        }

        global.log.debug("shuttleManager", "addRoutine", "new routine will add: " + JSON.stringify(newRoutineData))

        newRoutine.set(newRoutineData, function (error) {
            if(error) {
                global.log.error("shuttleManager", "addRoutine", "error: " + JSON.stringify(error))
                callbackFunc(false)
            }
            else {
                global.log.info("shuttleManager", "addRoutine", "new routine generated")

                var action101Ref = admin.database().ref(global.define.DB_PATH_ACTIONS_101_QUICK_REPLIES)
                action101Ref.once("value", function (actionSnapshot) {
                    var actionSnapshotData = actionSnapshot.val()
                    actionSnapshotData.push(newRoutineButton)

                    action101Ref.set(actionSnapshotData, function (error) {
                        if(error) {
                            global.log.error("shuttleManager", "addRoutine", "routine not linked to kakao button")
                            callbackFunc(false)
                        }
                        else {
                            global.log.info("shuttleManager", "addRoutine", "new routine linked to kakao button")
                            callbackFunc(true)
                        }
                    })
                })
            }
        })
    })
}

exports.patchRoutine = function(request, response, callbackFunc) {
    const util = require('util')
    var admin = global.admin

    var routineKey = request.body["routineKey"]
    var routineName = request.body["name"]

    var routineDBPath = util.format(global.define.DB_PATH_SHUTTLE_SCHEDULE_ROUTINE, routineKey)
    global.log.debug("shuttleManager", "patchRoutine", "routine path: " + routineDBPath)

    var shuttleRutineRef = admin.database().ref(routineDBPath)
    shuttleRutineRef.once("value", function ( routineSnapshot ) {
        var routineSnapshotData = routineSnapshot.val()
        if(routineSnapshotData === undefined) {
            global.log.warn("shuttleManager", "patchRoutine", "undefined routine accepted: " + routineKey)
            callbackFunc(false)
        }

        routineSnapshotData["name"] = routineName

        global.log.debug("shuttleManager", "patchRoutine", "routine will update to: " + JSON.stringify(routineSnapshotData))

        shuttleRutineRef.set(routineSnapshotData, function (error) {
            if(error) {
                global.log.error("shuttleManager", "patchRoutine", "cannot update routine: " + JSON.stringify(error))
                callbackFunc(false)
            }
            else {
                var action101Ref = admin.database().ref(global.define.DB_PATH_ACTIONS_101_QUICK_REPLIES)
                action101Ref.once("value", function (actionSnapshot) {
                    var actionSnapshotData = actionSnapshot.val()
                    for(var index in actionSnapshotData) {
                        var quickReply = actionSnapshotData[index]
                        if(quickReply["key"] === routineKey) {
                            quickReply["label"] = routineName
                            quickReply["messageText"] = routineName

                            actionSnapshotData[index] = quickReply

                            global.log.debug("shuttleManager", "patchRoutine", "kako quick reply will update to: " + JSON.stringify(actionSnapshotData))

                            action101Ref.set(actionSnapshotData, function (error) {
                                if(error) {
                                    global.log.error("shuttleManager", "patchRoutine", "cannot link updated routine to kakao button: " + JSON.stringify(error))
                                    callbackFunc(false)
                                }
                                else {
                                    global.log.info("shuttleManager", "patchRoutine", "linked updated routine to kakao button: " + JSON.stringify(error))
                                    callbackFunc(true)
                                }
                            })
                            break
                        }
                    }
                })
            }
        })
    })
}

exports.deleteRoutine = function(request, response, callbackFunc) {
    // /actions/101/quickReplies/2 ~ 4 <- routine selection for chat bot client
    const util = require('util')
    var admin = global.admin

    var routineKey = request.body["routineKey"]

    var routineDBPath = util.format(global.define.DB_PATH_SHUTTLE_SCHEDULE_ROUTINE, routineKey)
    global.log.debug("shuttleManager", "deleteRoutine", "routine path: " + routineDBPath)

    var shuttleRutineRef = admin.database().ref(routineDBPath)
    shuttleRutineRef.once("value", function ( routineSnapshot ) {
        var routineSnapshotData = routineSnapshot.val()
        if(routineSnapshotData === undefined) {
            global.log.warn("shuttleManager", "deleteRoutine", "undefined routine accepted: " + routineKey)
            callbackFunc(false)
        }

        routineSnapshotData = null

        global.log.debug("shuttleManager", "deleteRoutine", "routine will delete: " + routineKey)

        shuttleRutineRef.set(routineSnapshotData, function (error) {
            if(error) {
                global.log.error("shuttleManager", "deleteRoutine", "cannot update routine: " + JSON.stringify(error))
                callbackFunc(false)
            }
            else {
                var action101Ref = admin.database().ref(global.define.DB_PATH_ACTIONS_101_QUICK_REPLIES)
                action101Ref.once("value", function (actionSnapshot) {
                    var actionSnapshotData = actionSnapshot.val()
                    for(var index in actionSnapshotData) {
                        var quickReply = actionSnapshotData[index]
                        if(quickReply["key"] === routineKey) {

                            actionSnapshotData[index] = quickReply

                            actionSnapshotData.splice(index, 1)
                            global.log.debug("shuttleManager", "deleteRoutine", "kako quick reply will update to: " + JSON.stringify(actionSnapshotData))

                            action101Ref.set(actionSnapshotData, function (error) {
                                if(error) {
                                    global.log.error("shuttleManager", "deleteRoutine", "cannot link updated routine to kakao button: " + JSON.stringify(error))
                                    callbackFunc(false)
                                }
                                else {
                                    global.log.info("shuttleManager", "deleteRoutine", "linked updated routine to kakao button: " + JSON.stringify(error))
                                    callbackFunc(true)
                                }
                            })
                            break
                        }
                    }
                })
            }
        })
    })
}

exports.stationList = function (request, response, callbackFunc) {
    // /shuttle/schedule/<routine key>/Order <- shuttle station id list, /shuttle/schedule/<routine key>/station <- shuttle station name list
    const util = require('util')
    var admin = global.admin
    var stationList = []
    var routineKey = request.body["routineKey"]

    var routineStationDBPath = util.format(global.define.DB_PATH_SHUTTLE_SCHEDULE_ROUTINE, routineKey)
    global.log.debug("shuttleManager", "stationList", "routine db path: " + routineStationDBPath)

    var stationRef = admin.database().ref(routineStationDBPath)
    stationRef.once("value", function ( stationSnapshot ) {
        var stationSnapshotData = stationSnapshot.val()

        global.log.debug("shuttleManager", "stationList", "stationSnapshotData: " + JSON.stringify(stationSnapshotData))

        for(var stationKey in stationSnapshotData["Order"]) {
            stationList.push({
                "stationKey": stationSnapshotData["Order"][stationKey],
                "stationName": stationSnapshotData["station"][stationKey]
            })
        }

        global.log.debug("shuttleManager", "stationList", "stationList: "  + JSON.stringify(stationList))

        callbackFunc(stationList)
    })
}

exports.addStation = function (request, response, callbackFunc) {

}

exports.patchStation = function (request, response, callbackFunc) {
    
}

exports.deleteStation = function (request, response, callbackFunc) {
    
}

exports.getStationSchedule = function (request, response, callbackFunc) {
    // /shuttle/schedule/<routine key>/<station id> <- shuttle station's schedule list
    const util = require('util')
    var admin = global.admin
    // var scheduleList = []
    var routineKey = request.body["routineKey"]
    var stationKey = request.body["stationKey"]

    var routineStationScheduleDBPath = util.format(global.define.DB_PATH_SHUTTLE_SCHEDULE_ROUTINE_STATION, routineKey, stationKey)
    global.log.debug("shuttleManager", "getStationSchedule", "station db path: " + routineStationScheduleDBPath)

    var scheduleRef = admin.database().ref(routineStationScheduleDBPath)
    scheduleRef.once("value", function ( scheduleSnapshot ) {
        var scheduleSnapshotData = scheduleSnapshot.val()

        global.log.debug("shuttleManager", "getStationSchedule", "station schedule: " + JSON.stringify(scheduleSnapshotData))

        callbackFunc(scheduleSnapshotData)
    })
}

exports.createStationSchedule = function (request, response, callbackFunc) {

}

exports.patchStationSchedule = function (request, response, callbackFunc) {

}

exports.deleteStationSchedule = function (request, response, callbackFunc) {

}

exports.getShuttleRoutine = function (request, response, callbackFunc) {
    var admin = global.admin
    var routineRef = admin.database().ref(global.define.DB_PATH_SHUTTLE_ROUTE)
    routineRef.once("value", function ( routineSnapshot ) {
        var routineSnapshotData = routineSnapshot.val()

        global.log.debug("shuttleManager", "getShuttleRoutine", "routine snapshot data: " + JSON.stringify(routineSnapshotData))
        callbackFunc({
            "routine": routineSnapshotData
        })
    })
}

exports.patchShuttleRoutine = function (request, response, callbackFunc) {
    
}