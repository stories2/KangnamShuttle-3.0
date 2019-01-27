exports.getMenuListBasedOnRole = function (request, response) {
    var menuManager = require('../../Core/menuManager')
    var responseManager = request.responseManager

    menuManager.getMenuListBasedOnRole(request, response, function (menuList) {
        responseManager.ok(response, menuList)
    })
}

exports.getAllAccountList = function (request, response) {
    var accountManager = require('../../Core/accountManager')
    var responseManager = request.responseManager

    accountManager.getAllAccountList(request, response, function (accountList) {
        responseManager.ok(response, accountList)
    })
}

exports.patchAccount = function (request, response) {
    var accountManager = require('../../Core/accountManager')
    var responseManager = request.responseManager

    accountManager.patchAccount(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}

exports.deleteAccount = function (request, response) {
    var accountManager = require('../../Core/accountManager')
    var responseManager = request.responseManager

    accountManager.deleteAccount(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}