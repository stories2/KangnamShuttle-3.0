exports.test = function (request, response) {
    global.log.debug('MessengerRoute', 'test', "request body: " + JSON.stringify(request.body));

    if (request.body.object === 'page') {
        request.body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            const sender = webhookEvent.sender.id;
            if (webhookEvent.message) {
                global.log.debug('MessengerRoute', 'test', 'sender: ' + sender + ' sended text: ' + webhookEvent.message.text);
            }
        });;
    } else {
        global.log.warn('MessengerRoute', 'test', 'undefined object: ' + request.body.object)
    }

    response.setHeader(global.define.HEADERS_CONTENT_TYPE, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON)
    response.status(global.define.HTTP_STATUS_CODE_OK).send(JSON.stringify({message: {
        text: "hello, world!"
      }}));
  }
  
exports.verify = function (request, response) {
    if (request.query['hub.verify_token'] === 'VERIFY_TOKEN_STORIES2') {
        response.send(request.query['hub.challenge']);
    }
    response.send('Error, wrong token');
  }