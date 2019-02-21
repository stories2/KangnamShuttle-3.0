exports.getMenuListBasedOnRole = function (request, response, callbackFunc) {
  const admin = global.admin
  const menuList = []
  global.log.info('menuManager', 'getMenuListBasedOnRole', 'return menu list')

  var menuRef = admin.database().ref(global.define.DB_PATH_MENU)
  menuRef.once('value', function (menuSnapshot) {
    var myRoleLevel = request.roleList[request.accountInfo['role']]['level']

    global.log.debug('menuManager', 'getMenuListBasedOnRole', 'my role level: ' + JSON.stringify(myRoleLevel))

    var menuSnapshotData = menuSnapshot.val()

    for (var index in menuSnapshotData) {
      var menu = menuSnapshotData[index]
      if (request.roleList[menu['role']]['level'] <= myRoleLevel) {
        menuList.push({
          name: menu['name'],
          url: menu['url']
        })
      }
    }

    global.log.debug('menuManager', 'getMenuListBasedOnRole', 'menu list: ' + JSON.stringify(menuList))

    callbackFunc(menuList)
  })
}
