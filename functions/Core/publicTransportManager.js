exports.updateSubway = function (platformID, direction, callbackFunc) {
    const admin = global.admin
    const functions = require('firebase-functions');
    const util = require('util')
    const httpRequestManager = require('../Utils/httpRequestManager')
    const convertManager = require('../Utils/convertManager')
    const envManager = require('../Utils/envManager')
    global.log.debug("publicTransportManager", "updateSubway", "platform: " + platformID + " direction: " + direction)

    var publicSubwayApiInfo = envManager.getPublicSubwayOpenApiInfo(functions)
    var todayDayOfWeek = convertManager.ConvertCurrentDayOfWeekStartAtOne()
    var endpointPath = publicSubwayApiInfo["endpoint_path"]

    endpointPath = util.format(endpointPath, publicSubwayApiInfo["key"], platformID, direction, todayDayOfWeek)

    var fakeHeaderOptions = {
        hostname: publicSubwayApiInfo["endpoint"],
        path: endpointPath,
        port: publicSubwayApiInfo["port"]
    }

    global.log.debug("publicTransportManager", "updateSubway", "this is fake header: " + JSON.stringify(fakeHeaderOptions))

    httpRequestManager.request(fakeHeaderOptions,
        function (response, responseStr) {
            global.log.debug("publicTransportManager", "updateSubway", "api response: " + responseStr)
        },
        function (error) {
            global.log.error("publicTransportManager", "updateSubway", "cannot get api response: " + JSON.stringify(error))
        }, undefined)
}

exports.updateBus = function () {
    
}