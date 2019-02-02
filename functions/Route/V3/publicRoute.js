exports.hello = function (request, response) {

    console.log("v3 hello world headers: " + JSON.stringify(request.headers))
    console.log("v3 hello world body: " + JSON.stringify(request.body))

    request.responseManager.pushTemplate(
        {
            "simpleText": {
                "text": request.body.userRequest.utterance
            }
        }
    )
    request.responseManager.pushQuickReply(
        {
            "label": "안녕?",
            "action": "message",
            "messageText": "안녕!"
        }
    )
    request.responseManager.flushResponse(response)
}

exports.paramTest = function(request, response) {
    var responseManager = require('../../Utils/responseManager')
    var url = require('url');
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;

    global.log.debug("publicRoute", "paramTest", "request header: " + JSON.stringify(request.headers))
    global.log.debug("publicRoute", "paramTest", "request body: " + JSON.stringify(request.body))
    global.log.debug("publicRoute", "paramTest", "request query: " + JSON.stringify(query))
    global.log.debug("publicRoute", "paramTest", "request param: " + JSON.stringify(request.params))

    responseManager.ok(response, {})
}

exports.realtimeShuttleLocation = function (request, response) {
    var responseManager = require('../../Utils/responseManager')
    const ubikhanManager = require('../../Core/ubikhanManager')

    ubikhanManager.getLocation(request, response, function (data) {
        responseManager.ok(response, data)
    })
}

exports.updateRealtimeShuttleLocation = function (request, response) {
    var responseManager = require('../../Utils/responseManager')
    const ubikhanManager = require('../../Core/ubikhanManager')

    ubikhanManager.updateLocation(request, response, function (status) {
        status ?
            responseManager.ok(response, {
                status: status
            }) :
            responseManager.internalServerError(response, {
                status: status
            })
    })
}

exports.authSignUp = function (request, response) {
    var responseManager = require('../../Utils/responseManager')
    const accountManager = require('../../Core/accountManager')

    accountManager.createUserRoutine(request, response, function (responseData) {
        responseData["success"] ?
            responseManager.ok(response, responseData) : responseManager.unauthorized(response, responseData)
    })
}

exports.getShuttleSchedulePic = function (request, response) {
    var responseManager = require('../../Utils/responseManager')
    var shuttleManager = require('../../Core/shuttleManager')

    shuttleManager.getShuttleSchedulePic(request, response, function (imageBinary) {
        responseManager.binary(response, imageBinary)
    })
}