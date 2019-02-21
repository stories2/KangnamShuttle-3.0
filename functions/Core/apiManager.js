exports.getApiList = function (callbackFunc) {
  var admin = global.admin

  var apiRef = admin.database().ref(global.define.DB_PATH_API)
  apiRef.once('value', function (apiSnapshot) {
    var apiData = apiSnapshot.val()
    global.log.debug('apiManager', 'getApiList', 'api list: ' + JSON.stringify(apiData))
    callbackFunc(apiData)
  })
}
