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