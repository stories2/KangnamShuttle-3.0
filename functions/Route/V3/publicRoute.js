exports.hello = function (request, response) {

    console.log("v3 hello world headers: " + JSON.stringify(request.headers))
    console.log("v3 hello world body: " + JSON.stringify(request.body))

    global.response.pushTemplate(
        {
            "simpleText": {
                "text": request.body.userRequest.utterance
            }
        }
    )
    global.response.pushQuickReply(
        {
            "label": "안녕?",
            "action": "message",
            "messageText": "안녕!"
        }
    )
    global.response.flushResponse(response)
}