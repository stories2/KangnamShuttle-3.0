exports.shuttleOrderMenu = function (request, response, callbackFunc) { // 달구지라, 어떤걸 알려줄까요 #100
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleOrderMenu", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    responseManager.pushTemplate(action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
    for(var index in action["quickReplies"]) {
        responseManager.pushQuickReply(action["quickReplies"][index])
    }
    callbackFunc()
}

exports.shuttleSelectDirection = function (request, response, callbackFunc) { // 어디로 갈껀가요 #101
    // 퀵 응답은 관리자 페이지에서 수정을 할 수 있으며 DB에 반영이 될 것
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    const admin = global.admin
    global.log.debug("shuttleAction", "shuttleSelectDirection", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var shuttleRef = admin.database().ref(global.define.DB_PATH_SHUTTLE)
    shuttleRef.once("value", function(shuttleSnapshot) {

        var shuttleData = JSON.parse(JSON.stringify(shuttleSnapshot))

        for(var index in action["quickReplies"]) {
            responseManager.pushQuickReply(action["quickReplies"][index])
        }

        var template = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
        template["basicCard"]["description"] = shuttleData["notice"]
        global.log.debug("shuttleAction", "shuttleSelectDirection", "notice data: " + shuttleData["notice"])
        template["basicCard"]["buttons"] = []
        for(var key in shuttleData["schedule"]) {

            var directionName = shuttleData["schedule"][key]["name"]

            var buttonItem = {
                "action": "message",
                "label": directionName,
                "messageText": directionName
            }
            global.log.debug("shuttleAction", "shuttleSelectDirection", "schedule detected: " + key + " direction name: " + directionName)

            template["basicCard"]["buttons"].push(buttonItem)
        }

        responseManager.pushTemplate(template)
        callbackFunc()
    })
}

exports.shuttleDirectionDynamic = function(request, response, callbackFunc) {
    const util = require('util')
    const admin = global.admin
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    var userText = request.body["userRequest"]["utterance"]
    global.log.debug("shuttleAction", "shuttleDirectionDynamic", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var shuttleScheduleRef = admin.database().ref(global.define.DB_PATH_SHUTTLE_SCHEDULE)
    shuttleScheduleRef.once("value", function(shuttleScheduleSnapshot) {

        var allScheduleData = JSON.parse(JSON.stringify(shuttleScheduleSnapshot))
        var scheduleSnapshotData = null
        for(var key in allScheduleData) {
            if(allScheduleData[key]["name"] == userText) {
                scheduleSnapshotData = allScheduleData[key]
                break
            }
        }

        if(scheduleSnapshotData) {
            var currentTimeSec = global.datetime.getCurrentTimeSec(global.datetime.getCurrentTime())
            var template = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]

            var templateItems = []
            template["listCard"]["items"] = []
            for(var index in scheduleSnapshotData["Order"]) {

                var templateItem = {
                    "description": "%s",
                    "title": scheduleSnapshotData["station"][index]
                }

                var station = scheduleSnapshotData["Order"][index]
                var scheduleSize = Object.keys(scheduleSnapshotData[station]).length
                global.log.debug("shuttleAction", "shuttleDirectionDynamic", "search nearest shuttle, station: " + station + " current time sec: " + currentTimeSec + " schedule length: " + scheduleSize)

                var scheduleTimeSecBak = global.define.ZERO

                for(var scheduleIndex in scheduleSnapshotData[station]) {
                    var scheduleTimeSec = scheduleSnapshotData[station][scheduleIndex]

                    global.log.debug("shuttleAction", "shuttleDirectionDynamic", "#" + scheduleIndex + ": " + scheduleTimeSec)
                    if(scheduleIndex == global.define.ZERO) {
                        var nextScheduleTimeSec = scheduleSnapshotData[station][scheduleIndex * 1 + 1]
                        if(currentTimeSec < scheduleTimeSec) { // first schedule action["response"][1]

                            templateItem["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_FIRST],
                                global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec),
                                global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, nextScheduleTimeSec))
                            templateItems.push(templateItem)

                            global.log.debug("shuttleAction", "shuttleDirectionDynamic", "found first #" + scheduleIndex + " -> " + scheduleTimeSec)
                            break;
                        }
                    }
                    else if(scheduleIndex == scheduleSize - 1) {
                        if(scheduleTimeSec < currentTimeSec) { // missed schedule action["response"][4]

                            templateItem["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_MISSED])
                            templateItems.push(templateItem)
                            global.log.debug("shuttleAction", "shuttleDirectionDynamic", "found missed #" + scheduleIndex + " -> " + scheduleTimeSec)
                            break;
                        }
                        else { // same as currentTimeSec <= scheduleTimeSec : last schedule action["response"][3]
                            templateItem["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_LAST],
                                global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec))
                            templateItems.push(templateItem)
                            global.log.debug("shuttleAction", "shuttleDirectionDynamic", "found last #" + scheduleIndex + " -> " + scheduleTimeSec)
                            break;
                        }
                    }
                    else { // normal schedule action["response"][2]
                        var nextScheduleTimeSec = scheduleSnapshotData[station][scheduleIndex * 1 + 1]
                        if(scheduleTimeSecBak <= currentTimeSec && currentTimeSec < scheduleTimeSec) {

                            templateItem["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_NORMAL],
                                global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec),
                                global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, nextScheduleTimeSec))
                            templateItems.push(templateItem)
                            global.log.debug("shuttleAction", "shuttleDirectionDynamic", "found normal #" + scheduleIndex + " -> " + scheduleTimeSec)
                            break;
                        }
                    }
                    scheduleTimeSecBak = scheduleTimeSec
                }
            }
            template["listCard"]["items"] = templateItems
            template["listCard"]["header"]["title"] = util.format(template["listCard"]["header"]["title"], userText)
            responseManager.pushTemplate(template)
            for(var index in action["quickReplies"]) {
                if(index == 2) { // Refresh quick button
                    action["quickReplies"][index]["messageText"] = util.format(action["quickReplies"][index]["messageText"], userText)
                }
                responseManager.pushQuickReply(action["quickReplies"][index])
            }
        }
        callbackFunc()
    })
}

exports.shuttleDirectionUp = function (request, response, callbackFunc) { // 상행선 가까운 도착 시간 안내 #102 <-- Deprecated
    const util = require('util')
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleDirectionUp", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var shuttleScheduleRef = admin.database().ref(global.define.DB_PATH_SHUTTLE_SCHEDULE_DIRECTION_UP)
    shuttleScheduleRef.once("value", function(scheduleSnapshot) {

        var currentTimeSec = global.datetime.getCurrentTimeSec(global.datetime.getCurrentTime())
        var scheduleSnapshotData = JSON.parse(JSON.stringify(scheduleSnapshot))

        var template = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
        var templateItems = template["listCard"]["items"]
        template["listCard"]["items"] = []
        for(var index in templateItems) {

            var station = scheduleSnapshotData["Order"][index]
            var scheduleSize = Object.keys(scheduleSnapshotData[station]).length
            global.log.debug("shuttleAction", "shuttleDirectionUp", "search nearest shuttle, station: " + station + " current time sec: " + currentTimeSec + " schedule length: " + scheduleSize)

            var scheduleTimeSecBak = global.define.ZERO

            for(var scheduleIndex in scheduleSnapshotData[station]) {
                var scheduleTimeSec = scheduleSnapshotData[station][scheduleIndex]

                global.log.debug("shuttleAction", "shuttleDirectionUp", "#" + scheduleIndex + ": " + scheduleTimeSec)
                if(scheduleIndex == global.define.ZERO) {
                    var nextScheduleTimeSec = scheduleSnapshotData[station][scheduleIndex * 1 + 1]
                    if(currentTimeSec < scheduleTimeSec) { // first schedule action["response"][1]

                        templateItems[index]["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_FIRST],
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec),
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, nextScheduleTimeSec))

                        global.log.debug("shuttleAction", "shuttleDirectionUp", "found first #" + scheduleIndex + " -> " + scheduleTimeSec)
                        break;
                    }
                }
                else if(scheduleIndex == scheduleSize - 1) {
                    if(scheduleTimeSec < currentTimeSec) { // missed schedule action["response"][4]

                        templateItems[index]["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_MISSED])

                        global.log.debug("shuttleAction", "shuttleDirectionUp", "found missed #" + scheduleIndex + " -> " + scheduleTimeSec)
                        break;
                    }
                    else { // same as currentTimeSec <= scheduleTimeSec : last schedule action["response"][3]
                        templateItems[index]["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_LAST],
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec))
                        global.log.debug("shuttleAction", "shuttleDirectionUp", "found last #" + scheduleIndex + " -> " + scheduleTimeSec)
                        break;
                    }
                }
                else { // normal schedule action["response"][2]
                    var nextScheduleTimeSec = scheduleSnapshotData[station][scheduleIndex * 1 + 1]
                    if(scheduleTimeSecBak <= currentTimeSec && currentTimeSec < scheduleTimeSec) {

                        templateItems[index]["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_NORMAL],
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec),
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, nextScheduleTimeSec))

                        global.log.debug("shuttleAction", "shuttleDirectionUp", "found normal #" + scheduleIndex + " -> " + scheduleTimeSec)
                        break;
                    }
                }
                scheduleTimeSecBak = scheduleTimeSec
            }
            template["listCard"]["items"].push(templateItems[index])
        }

        responseManager.pushTemplate(template)
        for(var index in action["quickReplies"]) {
            responseManager.pushQuickReply(action["quickReplies"][index])
        }
        callbackFunc()
    })
}

exports.shuttleDirectionDown = function (request, response, callbackFunc) { // 하행선 가까운 도착 시간 안내 #103 <-- Deprecated
    const util = require('util')
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleDirectionDown", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var shuttleScheduleRef = admin.database().ref(global.define.DB_PATH_SHUTTLE_SCHEDULE_DIRECTION_DOWN)
    shuttleScheduleRef.once("value", function(scheduleSnapshot) {

        var currentTimeSec = global.datetime.getCurrentTimeSec(global.datetime.getCurrentTime())
        var scheduleSnapshotData = JSON.parse(JSON.stringify(scheduleSnapshot))

        var template = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
        var templateItems = template["listCard"]["items"]
        template["listCard"]["items"] = []
        for(var index in templateItems) {

            var station = scheduleSnapshotData["Order"][index]
            var scheduleSize = Object.keys(scheduleSnapshotData[station]).length
            global.log.debug("shuttleAction", "shuttleDirectionUp", "search nearest shuttle, station: " + station + " current time sec: " + currentTimeSec + " schedule length: " + scheduleSize)

            var scheduleTimeSecBak = global.define.ZERO

            for(var scheduleIndex in scheduleSnapshotData[station]) {
                var scheduleTimeSec = scheduleSnapshotData[station][scheduleIndex]

                global.log.debug("shuttleAction", "shuttleDirectionUp", "#" + scheduleIndex + ": " + scheduleTimeSec)
                if(scheduleIndex == global.define.ZERO) {
                    var nextScheduleTimeSec = scheduleSnapshotData[station][scheduleIndex * 1 + 1]
                    if(currentTimeSec < scheduleTimeSec) { // first schedule action["response"][1]

                        templateItems[index]["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_FIRST],
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec),
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, nextScheduleTimeSec))

                        global.log.debug("shuttleAction", "shuttleDirectionUp", "found first #" + scheduleIndex + " -> " + scheduleTimeSec)
                        break;
                    }
                }
                else if(scheduleIndex == scheduleSize - 1) {
                    if(scheduleTimeSec < currentTimeSec) { // missed schedule action["response"][4]

                        templateItems[index]["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_MISSED])

                        global.log.debug("shuttleAction", "shuttleDirectionUp", "found missed #" + scheduleIndex + " -> " + scheduleTimeSec)
                        break;
                    }
                    else { // same as currentTimeSec <= scheduleTimeSec : last schedule action["response"][3]
                        templateItems[index]["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_LAST],
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec))
                        global.log.debug("shuttleAction", "shuttleDirectionUp", "found last #" + scheduleIndex + " -> " + scheduleTimeSec)
                        break;
                    }
                }
                else { // normal schedule action["response"][2]
                    var nextScheduleTimeSec = scheduleSnapshotData[station][scheduleIndex * 1 + 1]
                    if(scheduleTimeSecBak <= currentTimeSec && currentTimeSec < scheduleTimeSec) {

                        templateItems[index]["description"] = util.format(action["response"][global.define.RESPONSE_SHUTTLE_SCHEDULE_NORMAL],
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, scheduleTimeSec),
                            global.datetime.convertSecToTimeOrMin(global.define.TIME_SEC_10MIN, currentTimeSec, nextScheduleTimeSec))

                        global.log.debug("shuttleAction", "shuttleDirectionUp", "found normal #" + scheduleIndex + " -> " + scheduleTimeSec)
                        break;
                    }
                }
                scheduleTimeSecBak = scheduleTimeSec
            }
            template["listCard"]["items"].push(templateItems[index])
        }

        responseManager.pushTemplate(template)
        for(var index in action["quickReplies"]) {
            responseManager.pushQuickReply(action["quickReplies"][index])
        }
        callbackFunc()
    })
}

exports.shuttleRoute = function(request, response, callbackFunc) {
    const admin = global.admin
    const util = require('util')
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleRoute", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var routeRef = admin.database().ref(global.define.DB_PATH_SHUTTLE_ROUTE)
    routeRef.once("value", function(routeSnapshot) {

        var routeStringFormat = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleText"]["text"]
        routeStringFormat = util.format(routeStringFormat, routeSnapshot.val())

        global.log.debug("shuttleAction", "shuttleRoute", "current formatted route: " + routeStringFormat)

        action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleText"]["text"] = routeStringFormat
        responseManager.pushTemplate(action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
        for(var index in action["quickReplies"]) {
            responseManager.pushQuickReply(action["quickReplies"][index])
        }
        callbackFunc()
    })
}

exports.shuttleSchedulePic = function (request, response, callbackFunc) {
    const admin = global.admin
    const util = require('util')
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleSchedulePic", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var shuttleSchedulePic = admin.database().ref(global.define.DB_PATH_SHUTTLE_SCHEDULE_PIC)
    shuttleSchedulePic.once("value", function(schedulePicSnapshot) {

        var schedulePicFormat = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleImage"]["imageUrl"]
        schedulePicFormat = util.format(schedulePicFormat, schedulePicSnapshot.val())

        global.log.debug("shuttleAction", "shuttleSchedulePic", "current formatted schedule pic url: " + schedulePicFormat)

        action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]["simpleImage"]["imageUrl"] = schedulePicFormat
        responseManager.pushTemplate(action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO])
        for(var index in action["quickReplies"]) {
            responseManager.pushQuickReply(action["quickReplies"][index])
        }
        callbackFunc()
    })
}

exports.shuttleLocationPage = function (request, response, callbackFunc) {
    const action = JSON.parse(JSON.stringify(request.action))
    const responseManager = request.responseManager
    global.log.debug("shuttleAction", "shuttleSchedulePic", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))

    var responseAction = action["response"][global.define.DEFAULT_RESPONSE_TYPE_ZERO]
    var basicCardButtons = responseAction["basicCard"]["buttons"]
    responseAction["basicCard"]["buttons"] = []

    for(var index in basicCardButtons) {
        responseAction["basicCard"]["buttons"].push(basicCardButtons[index])
    }

    responseManager.pushTemplate(responseAction)
    for(var index in action["quickReplies"]) {
        responseManager.pushQuickReply(action["quickReplies"][index])
    }
    callbackFunc()
}