app.service('KSAppService', function ($log, $http, $window, $mdToast) {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyA8fpmwbu3MGmCAHVlYkUEQkDdtg6dS0Vc',
    authDomain: 'kangnamshuttle3.firebaseapp.com',
    databaseURL: 'https://kangnamshuttle3.firebaseio.com',
    projectId: 'kangnamshuttle3',
    storageBucket: 'kangnamshuttle3.appspot.com',
    messagingSenderId: '1098842159621',

    clientId: '1098842159621-j11r4mmc89d8n2a2c3502geri390jfv5.apps.googleusercontent.com',

    scopes: [
      'https://www.googleapis.com/auth/calendar'
    ],
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
    ]
  }
  firebase.initializeApp(config)

  var setToken = function (tokenVal) {
    $window.localStorage.setItem('token', tokenVal)
    printLogMessage('KSAppService', 'setToken', 'update token: ' + tokenVal, LOG_LEVEL_DEBUG)
  }
  var getToken = function () {
    var token = $window.localStorage.getItem('token')
    printLogMessage('KSAppService', 'getToken', 'return token: ' + token, LOG_LEVEL_DEBUG)
    return token == null || token === undefined ? undefined : token
  }
  var removeToken = function () {
    $window.localStorage.removeItem('token')
    printLogMessage('KSAppService', 'removeToken', 'token removed', LOG_LEVEL_INFO)
  }
  var showToast = function (text, delay) {
    $mdToast.show($mdToast.simple()
      .textContent(text)
      .position('top right')
      .hideDelay(delay))
  }

  var verb = function (className, methodName, message) {
    printLogMessage(className, methodName, message, LOG_LEVEL_VERBOSE)
  }

  var info = function (className, methodName, message) {
    printLogMessage(className, methodName, message, LOG_LEVEL_INFO)
  }

  var debug = function (className, methodName, message) {
    printLogMessage(className, methodName, message, LOG_LEVEL_DEBUG)
  }

  var warn = function (className, methodName, message) {
    printLogMessage(className, methodName, message, LOG_LEVEL_WARN)
  }

  var error = function (className, methodName, message) {
    printLogMessage(className, methodName, message, LOG_LEVEL_ERROR)
  }

  var printLogMessage = function (className, methodName, message, logLevel) {
    var logDateTime = new Date().toISOString()
    var logMsg = '' + logDateTime + ' '
    if (logLevel == LOG_LEVEL_VERBOSE) {
      logMsg = logMsg + 'V: '
      logMsg = logMsg + '[' + className + '] {' + methodName + '} (' + message + ')'
      $log.log(logMsg)
    } else if (logLevel == LOG_LEVEL_INFO) {
      logMsg = logMsg + 'I: '
      logMsg = logMsg + '[' + className + '] {' + methodName + '} (' + message + ')'
      $log.log(logMsg)
    } else if (logLevel == LOG_LEVEL_DEBUG) {
      logMsg = logMsg + 'D: '
      logMsg = logMsg + '[' + className + '] {' + methodName + '} (' + message + ')'
      $log.log(logMsg)
    } else if (logLevel == LOG_LEVEL_WARN) {
      logMsg = logMsg + 'W: '
      logMsg = logMsg + '[' + className + '] {' + methodName + '} (' + message + ')'
      $log.log(logMsg)
    } else if (logLevel == LOG_LEVEL_ERROR) {
      logMsg = logMsg + 'E: '
      logMsg = logMsg + '[' + className + '] {' + methodName + '} (' + message + ')'
      $log.warn(logMsg)
    } else {
      logMsg = logMsg + 'W: '
      logMsg = logMsg + '[' + className + '] {' + methodName + '} (' + message + ')'
      $log.error(logMsg)
    }
  }
  var deleteReq = function (url, data, successFunc, failFunc) {
    printLogMessage('KSAppService', 'deleteReq', 'send data to url: ' + url, LOG_LEVEL_INFO)
    // data["seconds"] = this.PreventCache()
    var token = getToken()

    if (token !== undefined) {
      $http.defaults.headers.common['Authorization'] = token
      printLogMessage('KSAppService', 'deleteReq', 'request with token', LOG_LEVEL_INFO)
    }

    $http({
      method: 'DELETE',
      dataType: 'json',
      url: url,
      cache: false,
      contentType: 'application/json',
      data: data,
      crossDomain: true,
      headers: {
        'Content-type': 'application/json;charset=utf-8'
      },
      // headers: {
      //     "Authorization": token
      // },
      xhrFields: {
        withCredentials: false
      },
      beforeSend: function (xhr) {
        if (typeof token !== 'undefined') {
          printLogMessage('KSAppService', 'deleteReq', 'auth: ' + token, LOG_LEVEL_DEBUG)
          xhr.setRequestHeader('Authorization', token)
        } else {
          printLogMessage('KSAppService', 'deleteReq', 'no token sending', LOG_LEVEL_WARN)
        }
      }
    })
      .then(function (receivedData) {
        printLogMessage('KSAppService', 'deleteReq', 'data received successfully', LOG_LEVEL_INFO)
        successFunc(receivedData)
      })
      .catch(function (xhr, textStatus, errorThrown) {
        printLogMessage('KSAppService', 'deleteReq', 'something has problem: ' + textStatus, LOG_LEVEL_ERROR)
        failFunc(xhr.responseText, textStatus)
      })
  }
  var patchReq = function (url, data, successFunc, failFunc) {
    printLogMessage('KSAppService', 'patchReq', 'send data to url: ' + url, LOG_LEVEL_INFO)
    // data["seconds"] = this.PreventCache()
    var token = getToken()

    if (token !== undefined) {
      $http.defaults.headers.common['Authorization'] = token
      printLogMessage('KSAppService', 'patchReq', 'request with token', LOG_LEVEL_INFO)
    }

    $http({
      method: 'PATCH',
      dataType: 'json',
      url: url,
      cache: false,
      contentType: 'application/json',
      data: data,
      crossDomain: true,
      // headers: {
      //     "Authorization": token
      // },
      xhrFields: {
        withCredentials: false
      },
      beforeSend: function (xhr) {
        if (typeof token !== 'undefined') {
          printLogMessage('KSAppService', 'patchReq', 'auth: ' + token, LOG_LEVEL_DEBUG)
          xhr.setRequestHeader('Authorization', token)
        } else {
          printLogMessage('KSAppService', 'patchReq', 'no token sending', LOG_LEVEL_WARN)
        }
      }
    })
      .then(function (receivedData) {
        printLogMessage('KSAppService', 'patchReq', 'data received successfully', LOG_LEVEL_INFO)
        successFunc(receivedData)
      })
      .catch(function (xhr, textStatus, errorThrown) {
        printLogMessage('KSAppService', 'patchReq', 'something has problem: ' + textStatus, LOG_LEVEL_ERROR)
        failFunc(xhr.responseText, textStatus)
      })
  }
  var postReq = function (url, data, successFunc, failFunc) {
    printLogMessage('KSAppService', 'postReq', 'send data to url: ' + url, LOG_LEVEL_INFO)
    // data["seconds"] = this.PreventCache()
    var token = getToken()

    if (token !== undefined) {
      $http.defaults.headers.common['Authorization'] = token
      printLogMessage('KSAppService', 'postReq', 'request with token', LOG_LEVEL_INFO)
    }

    $http({
      method: 'POST',
      dataType: 'json',
      url: url,
      cache: false,
      contentType: 'application/json',
      data: data,
      crossDomain: true,
      // headers: {
      //     "Authorization": token
      // },
      xhrFields: {
        withCredentials: false
      },
      beforeSend: function (xhr) {
        if (typeof token !== 'undefined') {
          printLogMessage('KSAppService', 'postReq', 'auth: ' + token, LOG_LEVEL_DEBUG)
          xhr.setRequestHeader('Authorization', token)
        } else {
          printLogMessage('KSAppService', 'postReq', 'no token sending', LOG_LEVEL_WARN)
        }
      }
    })
      .then(function (receivedData) {
        printLogMessage('KSAppService', 'postReq', 'data received successfully', LOG_LEVEL_INFO)
        successFunc(receivedData)
      })
      .catch(function (xhr, textStatus, errorThrown) {
        printLogMessage('KSAppService', 'postReq', 'something has problem: ' + textStatus, LOG_LEVEL_ERROR)
        failFunc(xhr.responseText, textStatus)
      })
  }
  var getReq = function (url, data, successFunc, failFunc) {
    printLogMessage('KSAppService', 'getReq', 'send data to url: ' + url, LOG_LEVEL_INFO)
    // data["seconds"] = this.PreventCache()
    var token = getToken()

    if (token !== undefined) {
      $http.defaults.headers.common['Authorization'] = token
      printLogMessage('KSAppService', 'getReq', 'request with token', LOG_LEVEL_INFO)
    }

    $http({
      type: 'GET',
      dataType: 'json',
      url: url,
      cache: false,
      contentType: 'application/json',
      params: data,
      async: false,
      crossDomain: true,
      data: '',
      headers: {
        'Content-Type': 'application/json'
      },
      xhrFields: {
        withCredentials: false
      },
      beforeSend: function (xhr) {
        if (typeof token !== 'undefined') {
          printLogMessage('KSAppService', 'getReq', 'auth: ' + token, LOG_LEVEL_DEBUG)
          xhr.setRequestHeader('Authorization', token)
        } else {
          printLogMessage('KSAppService', 'getReq', 'no token sending', LOG_LEVEL_WARN)
        }
      }
    })
      .then(function (receivedData) {
        printLogMessage('KSAppService', 'getReq', 'data received successfully', LOG_LEVEL_INFO)
        successFunc(receivedData)
      })
      .catch(function (xhr, textStatus, errorThrown) {
        printLogMessage('KSAppService', 'getReq', 'something has problem: ' + textStatus, LOG_LEVEL_ERROR)
        failFunc(xhr.responseText, textStatus)
      })
  }
  return {
    'verb': verb,
    'info': info,
    'debug': debug,
    'warn': warn,
    'error': error,
    'printLogMessage': printLogMessage,
    'deleteReq': deleteReq,
    'patchReq': patchReq,
    'postReq': postReq,
    'getReq': getReq,
    'setToken': setToken,
    'getToken': getToken,
    'removeToken': removeToken,
    'showToast': showToast,
    'config': config
  }
})
