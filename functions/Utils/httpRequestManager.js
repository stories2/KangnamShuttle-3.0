exports.request = function (headerOptions, callbackFunc, data) {
    const httpManager = require('http')
    global.log.debug("httpRequestManager", "request", "header: " + JSON.stringify(headerOptions))

    httpManager.request(headerOptions, callbackFunc)
    httpManager.write(data)
    httpManager.end()
}

exports.callback = function (response) {
    
}