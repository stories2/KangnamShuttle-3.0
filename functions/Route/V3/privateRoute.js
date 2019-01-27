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

exports.getStationList = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.stationList(request, response, function (stationList) {
        responseManager.ok(response, stationList)
    })
}

exports.addStation = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.addStation(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}

exports.patchStation = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.patchStation(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}

exports.deleteStation = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.deleteStation(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}

exports.getStationSchedule = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.getStationSchedule(request, response, function (scheduleList) {
        responseManager.ok(response, scheduleList)
    })
}

exports.createStationSchedule = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.createStationSchedule(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}

exports.patchStationSchedule = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.patchStationSchedule(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}

exports.deleteStationSchedule = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.deleteStationSchedule(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}

exports.getShuttleRoutine = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.getShuttleRoutine(request, response, function (shuttleRoutine) {
        responseManager.ok(response, shuttleRoutine)
    })
}

exports.patchShuttleRoutine = function (request, response) {
    var shuttleManager = require('../../Core/shuttleManager')
    var responseManager = request.responseManager

    shuttleManager.patchShuttleRoutine(request, response, function (status) {
        responseManager.ok(response, {
            "success": status
        })
    })
}