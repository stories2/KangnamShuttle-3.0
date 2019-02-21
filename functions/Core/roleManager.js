exports.getAllRoleList = function (request, response, callbackFunc) {
  var admin = global.admin

  var roleRef = admin.database().ref(global.define.DB_PATH_ROLE)
  roleRef.once('value', function (roleSnapshot) {
    callbackFunc(roleSnapshot.val())
  })
}
