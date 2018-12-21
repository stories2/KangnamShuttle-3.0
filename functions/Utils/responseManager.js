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

    this.outputs.clear()
    this.quickreplies.clear()

    global.log.debug("responseManager", "flushResponse", "current response payload: " + JSON.stringify(responsePayload))

    response.setHeader(global.define.HEADERS_CONTENT_TYPE, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON);
    response.status(global.define.HTTP_STATUS_OK).send(JSON.stringify(responsePayload))
}