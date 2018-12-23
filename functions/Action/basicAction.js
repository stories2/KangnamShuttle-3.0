exports.hello = function (request, response) {
    global.log.debug("basicAction", "hello", "user data: " + JSON.stringify(request.user) + " action data: " + JSON.stringify(request.action))
}