exports.test = function (request, response) {
    global.log.debug('MessengerRoute', 'test', "request body: " + JSON.stringify(request.body));
    response.setHeader(global.define.HEADERS_CONTENT_TYPE, global.define.HEADERS_CONTENT_TYPE_APPLICATION_JSON)
    response.status(global.define.HTTP_STATUS_CODE_OK).send(JSON.stringify({msg:'ok'}));
  }
  