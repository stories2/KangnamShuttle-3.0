exports.outputs = []
exports.quickreplise = []
exports.responseTemplate = {
    "version": "2.0",
    "template": {
        "outputs": [],
        "quickReplise": []
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
    var quickRepliesLen = this.quickreplise.length

    if(quickRepliesLen < global.define.MAXIMUM_OF_QUICK_REPLIES_LENGTH) {
        this.quickreplise.push(quickReply)
        global.log.debug("responseManager", "pushQuickReply", "quick reply added: " + JSON.stringify(this.quickreplise))
    }
    else {
        global.log.warn("responseManager", "pushQuickReply", "overflow detected, current length: " + quickRepliesLen + " <-> " + global.define.MAXIMUM_OF_QUICK_REPLIES_LENGTH)
    }
}

exports.flushResponse = function (response) {

    this.responseTemplate["template"]["outputs"] = this.outputs
    this.responseTemplate["template"]["quickReplise"] = this.quickreplise

    global.log.debug("responseManager", "flushResponse", "current response payload: " + JSON.stringify(this.responseTemplate))

    response.setHeader(global.define.HEADERS_CONTENT_TYPE, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON);
    response.status(global.define.HTTP_STATUS_OK).send(JSON.stringify(this.responseTemplate))
}