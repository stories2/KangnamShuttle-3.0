exports.routineList = function(request, response, callbackFunc) {
    // /shuttle/schedule <- key is station id and /shuttle/schedule/<key>/name is station name
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

}

exports.addStation = function (request, response, callbackFunc) {

}

exports.patchStation = function (request, response, callbackFunc) {
    
}

exports.deleteStation = function (request, response, callbackFunc) {
    
}

exports.getStationSchedule = function (request, response, callbackFunc) {
    // /shuttle/schedule/<routine key>/<station id> <- shuttle station's schedule list
}

exports.createStationSchedule = function (request, response, callbackFunc) {

}

exports.patchStationSchedule = function (request, response, callbackFunc) {

}

exports.deleteStationSchedule = function (request, response, callbackFunc) {

}

exports.getShuttleRoutine = function (request, response, callbackFunc) {
    
}

exports.patchShuttleRoutine = function (request, response, callbackFunc) {
    
}