exports.outputs = []
exports.quickreplies = []
exports.responseTemplate = {
    "version": "2.0",
    "template": {
        "outputs": [],
        "quickReplies": []
    }
}

exports.pushTemplate = function (template) {
    var outputsLen = this.outputs.length

    if(outputsLen < global.define.MAXIMUM_OF_OUTPUTS_LENGTH) {
        this.outputs.push(template)
        global.log.debug("responseManager", "pushTemplate", "template added: " + JSON.stringify(this.outputs))
    }
    else {
        global.log.warn("responseManager", "pushTemplate", "overflow detected, current length: " + outputsLen + " <-> " + global.define.MAXIMUM_OF_OUTPUTS_LENGTH)
    }
}

exports.pushQuickReply = function (quickReply) {
    var quickRepliesLen = this.quickreplies.length

    if(quickRepliesLen < global.define.MAXIMUM_OF_QUICK_REPLIES_LENGTH) {
        this.quickreplies.push(quickReply)
        global.log.debug("responseManager", "pushQuickReply", "quick reply added: " + JSON.stringify(this.quickreplies))
    }
    else {
        global.log.warn("responseManager", "pushQuickReply", "overflow detected, current length: " + quickRepliesLen + " <-> " + global.define.MAXIMUM_OF_QUICK_REPLIES_LENGTH)
    }
}

exports.flushResponse = function (response) {

    var responsePayload = this.responseTemplate

    responsePayload["template"]["outputs"] = this.outputs
    responsePayload["template"]["quickReplies"] = this.quickreplies

    if(responsePayload["template"]["quickReplies"].length <= global.define.ZERO) {
        global.log.info("responseManager", "flushResponse", "quick replies is empty")
        responsePayload["template"]["quickReplies"] = undefined
    }

    var responsePayloadStr = JSON.stringify(responsePayload)

    this.outputs.length = global.define.ZERO
    this.quickreplies.length = global.define.ZERO

    global.log.debug("responseManager", "flushResponse", "current response payload: " + responsePayloadStr)

    this.response(response, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_OK, responsePayloadStr)
}

exports.ok = function(response, msg) {
    this.response(response, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_OK, JSON.stringify(msg))
}

exports.badRequest = function(response, msg) {
    this.response(response, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_BAD_REQUEST, JSON.stringify(msg))
}

exports.unauthorized = function(response, msg) {
    this.response(response, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_UNAUTHORIZED, JSON.stringify(msg))
}

exports.internalServerError = function(response, msg) {
    this.response(response, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR, JSON.stringify(msg))
}

exports.forbidden = function(response, msg) {
    this.response(response, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON, global.define.HTTP_STATUS_CODE_FORBIDDEN, JSON.stringify(msg))
}

exports.response = function(response, type, code, msgStr) {
    response.setHeader(global.define.HEADERS_CONTENT_TYPE, type)
    response.status(code).send(msgStr)
}