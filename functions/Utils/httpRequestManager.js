exports.request = function (headerOptions, successFunc, errorFunc, data) {
    const httpManager = require('http')
    global.log.debug("httpRequestManager", "request", "header: " + JSON.stringify(headerOptions))

    var callbackController = function(response) {
        global.log.debug("httpRequestManager", "callbackController", "response code: " + response.statusCode + " headers: " + JSON.stringify(response.headers))

        var responseStr = ""
        response.on("data", function (chunk) {
            responseStr += chunk
        })

        response.on("end", function () {
            global.log.debug("httpRequestManager", "callbackController-end", "response: " + responseStr)

            successFunc(response, responseStr)
        })

        response.on("error", function (error) {
            global.log.error("httpRequestManager", "callbackController-error", "error accepted: " + JSON.stringify(error))
            errorFunc(error)
        })
    }

    var currentRequest = httpManager.request(headerOptions, callbackController)
    if(data != null) {
        currentRequest.write(data)
    }
    currentRequest.end()
}