exports.addModules = function (request, response, next) {
    const responseManager = require('../Utils/responseManager')
    request.responseManager = responseManager

    global.log.info("preprocessManager", "addModules", "module responseManager added")

    return next()
}