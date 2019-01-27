exports.getMenuListBasedOnRole = function (request, response) {
    var menuManager = require('../../Core/menuManager')
    var responseManager = request.responseManager

    menuManager.getMenuListBasedOnRole(request, response, function (menuList) {
        responseManager.ok(response, menuList)
    })
}