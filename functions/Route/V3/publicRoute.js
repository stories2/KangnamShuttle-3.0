exports.hello = function (request, response) {
  console.log('v3 hello world headers: ' + JSON.stringify(request.headers))
  console.log('v3 hello world body: ' + JSON.stringify(request.body))

  request.responseManager.pushTemplate(
    {
      'simpleText': {
        'text': request.body.userRequest.utterance
      }
    }
  )
  request.responseManager.pushQuickReply(
    {
      'label': '안녕?',
      'action': 'message',
      'messageText': '안녕!'
    }
  )
  request.responseManager.flushResponse(response)
}

exports.paramTest = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  var url = require('url')
  var url_parts = url.parse(request.url, true)
  var query = url_parts.query

  global.log.debug('publicRoute', 'paramTest', 'request header: ' + JSON.stringify(request.headers))
  global.log.debug('publicRoute', 'paramTest', 'request body: ' + JSON.stringify(request.body))
  global.log.debug('publicRoute', 'paramTest', 'request query: ' + JSON.stringify(query))
  global.log.debug('publicRoute', 'paramTest', 'request param: ' + JSON.stringify(request.params))

  responseManager.ok(response, {})
}

exports.realtimeShuttleLocation = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  const ubikhanManager = require('../../Core/ubikhanManager')

  ubikhanManager.getLocation(request, response, function (data) {
    responseManager.ok(response, data)
  })
}

exports.updateRealtimeShuttleLocation = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  const ubikhanManager = require('../../Core/ubikhanManager')

  ubikhanManager.updateLocation(request, response, function (status) {
    status
      ? responseManager.ok(response, {
        status: status
      })
      : responseManager.internalServerError(response, {
        status: status
      })
  })
}

exports.authSignUp = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  const accountManager = require('../../Core/accountManager')

  accountManager.createUserRoutine(request, response, function (responseData) {
    responseData['success']
      ? responseManager.ok(response, responseData) : responseManager.unauthorized(response, responseData)
  })
}

exports.getShuttleSchedulePic = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  var shuttleManager = require('../../Core/shuttleManager')

  shuttleManager.getShuttleSchedulePic(request, response, function (imageBinary) {
    if (imageBinary) {
      response.set('Cache-Control', 'public, max-age=600, s-maxage=600')
      responseManager.binary(response, imageBinary)
    } else {
      responseManager.internalServerError(response, {})
    }
  })
}

exports.registerGoogleAccount = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  var accountManager = require('../../Core/accountManager')

  accountManager.registerGoogleAccount(request, response, function (status) {
    responseManager.ok(response, {
      'success': status
    })
  })
}

exports.getPublicSubway = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  var publicTransportManager = require('../../Core/publicTransportManager')

  var platformID = request.query['platform']
  var direction = request.query['direction']

  publicTransportManager.getSubway(platformID, direction, function (subwayArriveData) {
    responseManager.ok(response, subwayArriveData)
  })
}

exports.patchPublicSubway = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  var publicTransportManager = require('../../Core/publicTransportManager')

  var platformID = request.body['platform']
  var direction = request.body['direction']

  publicTransportManager.updateSubway(platformID, direction, function (status) {
    responseManager.ok(response, {
      'success': status
    })
  })
}

exports.getPublicBus = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  var publicTransportManager = require('../../Core/publicTransportManager')

  var routeID = request.query['route']
  var platformID = request.query['platform']

  publicTransportManager.getBus(routeID, platformID, function (busArriveData) {
    responseManager.ok(response, busArriveData)
  })
}

exports.patchPublicBus = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  var publicTransportManager = require('../../Core/publicTransportManager')

  var routeID = request.body['route']
  var platformID = request.body['platform']

  publicTransportManager.updateBus(routeID, platformID, function (status) {
    responseManager.ok(response, {
      'success': status
    })
  })
}

exports.routineOfCrawlSchoolLifeSchedule = function (request, response) {
  var responseManager = require('../../Utils/responseManager')
  const schoolManager = require('../../Core/schoolManager')

  schoolManager.routineOfCrawlSchoolLifeSchedule(request, response, function (scheduleList) {
    responseManager.ok(response, scheduleList)
  })
}
