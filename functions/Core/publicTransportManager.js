exports.updateSubway = function (platformID, direction, callbackFunc) {
    const admin = global.admin
    const functions = require('firebase-functions');
    const util = require('util')
    const httpRequestManager = require('../Utils/httpRequestManager')
    const convertManager = require('../Utils/convertManager')
    const envManager = require('../Utils/envManager')
    const datetimeManager = require('../Utils/datetimeManager')
    global.log.debug("publicTransportManager", "updateSubway", "platform: " + platformID + " direction: " + direction)

    var publicSubwayApiInfo = envManager.getPublicSubwayOpenApiInfo(functions)
    var todayDayOfWeek = convertManager.ConvertCurrentDayOfWeekStartAtOne()
    var endpointPath = publicSubwayApiInfo["endpoint_path"]
    var currentDateTime = datetimeManager.getCurrentTime()

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
            var subwayData = JSON.parse(responseStr)
            var apiResultCode = subwayData["SearchArrivalTimeOfLine2SubwayByIDService"]["RESULT"]["CODE"]
            if(apiResultCode == global.define.SUBWAY_OPEN_API_RESULT_OK) {
                var subwayArriveData = subwayData["SearchArrivalTimeOfLine2SubwayByIDService"]["row"]
                subwayArriveData["lastUpdateDatetime"] = currentDateTime.toISOString()
                var dbPath = util.format(global.define.DB_PATH_OPEN_API_PUBLIC_SUBWAY_PLATFORM_DIR, platformID, direction)
                global.log.debug("publicTransportManager", "updateSubway", "save subway arrive data to: " + dbPath)
                admin.database().ref(dbPath).set(subwayArriveData, function (error) {
                    if(error) {
                        global.log.error("publicTransportManager", "updateSubway", "cannot save subway arrive data: " + JSON.stringify(error))
                        callbackFunc(false)
                    }
                    else {
                        global.log.info("publicTransportManager", "updateSubway", "subway arrive data saved")
                        callbackFunc(true)
                    }
                })
            }
            else {
                global.log.error("publicTransportManager", "updateSubway", "api return code error: " + apiResultCode)
                callbackFunc(false)
            }
        },
        function (error) {
            global.log.error("publicTransportManager", "updateSubway", "cannot get api response: " + JSON.stringify(error))
            callbackFunc(false)
        }, undefined)
}

exports.updateBus = function () {
    
}