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
}

exports.patchRoutine = function(request, response, callbackFunc) {

}

exports.deleteRoutine = function(request, response, callbackFunc) {
    // /actions/101/quickReplies/2 ~ 4 <- routine selection for chat bot client
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