exports.getRawBodyManager = function (request, response, next) {
    var responseManager = require('../Utils/ResponseManager')
    const getRawBody = require('raw-body')
    const contentType = require('content-type')
    try {
        // global.log.debug("RawbodyManager", "getRawBodyManager", "content type: " + request.headers["content-type"] + " include: " + request.headers['content-type'].includes('multipart/form-data') + " property: " + request.headers.hasOwnProperty('content-type'))
        // global.log.debug("RawbodyManager", "getRawBodyManager", "raybody: " + (request.rawBody === undefined) + " method: " + request.method)
        // global.log.debug("RawbodyManager", "getRawBodyManager", "headers: " + JSON.stringify(request.rawBody))
        if (
            request.rawBody === undefined &&
            request.method === 'POST' &&
            request.headers.hasOwnProperty('content-type') &&
            request.headers['content-type'].includes('multipart/form-data')
        ) {
            global.log.info("RawbodyManager", "getRawBodyManager", "multipart/form-data accepted")
            getRawBody(
                request,
                {
                    length: request.headers['content-length'],
                    limit: global.define.UPLOAD_FILE_SIZE_LIMIT_5MB,
                    encoding: contentType.parse(request).parameters.charset,
                },
                function(err, string) {
                    if (err) {
                        global.log.error("RawbodyManager", "getRawBodyManager", "something wrong: " + JSON.stringify(err))
                        responseManager.internalServerError(response, {})
                        return
                    }
                    global.log.info("RawbodyManager", "getRawBodyManager", "raw body converted")
                    request.rawBody = string
                    next()
                }
            )
        } else if(request.headers.hasOwnProperty('content-type')) {
            global.log.info("RawbodyManager", "getRawBodyManager", "just pass raw body")
            next()
        }
        else {
            global.log.info("RawbodyManager", "getRawBodyManager", "content type is undefined, throw away")
            responseManager.badRequest(response, {})
        }
    }
    catch (except) {
        responseManager.internalServerError(response, {})
    }
}