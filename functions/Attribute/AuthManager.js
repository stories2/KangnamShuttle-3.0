// exports.verifyAuthToken = function(request, response, next) {
//     var responseManager = require('../Utils/ResponseManager')
//     const admin = global.admin
//     const checkAccountRole = this.checkAccountRole
//
//     global.log.debug("AuthManager", "verifyAuthToken", "request header: " + JSON.stringify(request.headers))
//     global.log.debug("AuthManager", "verifyAuthToken", "request url: " + request.url + " method: " + request.method)
//
//     try {
//         token = request.get('Authorization')
//         admin.auth().verifyIdToken(token)
//             .then(function (decodedToken) {
//                 global.log.debug("AuthManager", "verifyAuthToken", "token verified uid: " + decodedToken.uid)
//                 request.user = decodedToken
//                 admin.auth().getUser(decodedToken.uid)
//                     .then(function (userRecord) {
//                         global.log.info("AuthManager", "verifyAuthToken", "we found user info")
//                         userRecordData = userRecord.toJSON()
//                         userRecordDataStr = JSON.stringify(userRecordData)
//                         request.userRecordData = userRecordData
//                         global.log.debug("AuthManager", "verifyAuthToken", "user info decoded : " + userRecordDataStr)
//
//                         checkAccountRole(responseManager, decodedToken.uid, request, function (grantted) {
//                             if(grantted) {
//                                 return next();
//                             }
//                             else {
//                                 responseManager.forbidden(response, {})
//                             }
//                         })
//                     })
//                     .catch(function (error) {
//                         global.log.error("AuthManager", "verifyAuthToken", "cannot verify user: " + JSON.stringify(error))
//
//                         responseManager.unauthorized(response, {})
//                     })
//             })
//             .catch(function (error) {
//                 global.log.error("AuthManager", "verifyAuthToken", "cannot verify token: " + JSON.stringify(error))
//
//                 responseManager.unauthorized(response, {})
//             })
//     }
//     catch (exception) {
//         global.log.error("AuthManager", "verifyAuthToken", "server crashed: " + JSON.stringify(exception))
//
//         responseManager.internalServerError(response, {})
//     }
// }
//
// exports.checkAccountRole = function (responseManager, uid, request, callbackFunc) {
//     const admin = global.admin
//     var url = request.url
//     var method = request.method
//
//     var roleRef = admin.database().ref(global.define.DB_PATH_ROLE)
//     roleRef.once("value", function ( roleSnapshot ) {
//         var
//     })
// }

exports.authRoutine = function (request, response, next) {
    const responseManager = require('../Utils/responseManager')
    const authManager = require('./AuthManager')

    const requestUrl = request.url
    const requestMethod = request.method

    global.log.debug("AuthManager", "authRoutine", "request header: " + JSON.stringify(request.headers))
    global.log.debug("AuthManager", "authRoutine", "request url: " + requestUrl + " method: " + requestMethod)

    const getAuthToken = authManager.getAuthToken
    const verifyToken = authManager.verifyToken
    const getUserInfoFromUID = authManager.getUserInfoFromUID
    const getUrlInfoFromDB = authManager.getUrlInfoFromDB
    const getRoleListFromDB = authManager.getRoleListFromDB
    const getAccountInfoFromDB = authManager.getAccountInfoFromDB
    const checkThisAccountHasPermission = authManager.checkThisAccountHasPermission

    getAuthToken(request, function (token) {
        if(token) {
            //----------------------------
            global.log.debug("AuthManager", "authRoutine", "token: " + token)
            verifyToken(token, function (decodedToken) {
                if(decodedToken) {
                    //----------------------------
                    global.log.debug("AuthManager", "authRoutine", "decodedToken: " + JSON.stringify(decodedToken))
                    getUserInfoFromUID(decodedToken.uid, function (userInfo) {
                        if(userInfo && userInfo.emailVerified) {
                            //----------------------------
                            global.log.debug("AuthManager", "authRoutine", "userInfo: " + JSON.stringify(userInfo))
                            getUrlInfoFromDB(requestUrl, requestMethod, function (api) {
                                if(api) {
                                    //----------------------------
                                    global.log.debug("AuthManager", "authRoutine", "api: " + JSON.stringify(api))
                                    getRoleListFromDB(function (roleList) {
                                        if(roleList) {
                                            //----------------------------
                                            global.log.debug("AuthManager", "authRoutine", "role list: " + JSON.stringify(roleList))
                                            getAccountInfoFromDB(decodedToken.uid, function (accountInfo) {
                                                if(accountInfo) {
                                                    //----------------------------
                                                    global.log.debug("AuthManager", "authRoutine", "accountInfo: " + JSON.stringify(accountInfo))
                                                    checkThisAccountHasPermission(accountInfo, roleList, api, function (granted) {
                                                        if(granted) {
                                                            //----------------------------
                                                            request.accountInfo = accountInfo
                                                            request.roleList = roleList
                                                            global.log.info("AuthManager", "authRoutine", "permission granted")
                                                            next()
                                                            //----------------------------
                                                        }
                                                        else {
                                                            global.log.error("AuthManager", "authRoutine", "Permission not granted")
                                                            responseManager.forbidden(response, {
                                                                "message": "Permission not granted"
                                                            })
                                                        }
                                                    })
                                                    //----------------------------
                                                }
                                                else {
                                                    global.log.error("AuthManager", "authRoutine", "Unrecognized account")
                                                    responseManager.unauthorized(response, {
                                                        "message": "Unrecognized account"
                                                    })
                                                }
                                            })
                                            //----------------------------
                                        }
                                        else {
                                            global.log.error("AuthManager", "authRoutine", "Failed to get role list")
                                            responseManager.internalServerError(response, {
                                                "message": "Failed to get role list"
                                            })
                                        }
                                    })
                                    //----------------------------
                                }
                                else {
                                    global.log.error("AuthManager", "authRoutine", "Undefined API request")
                                    responseManager.badRequest(response, {
                                        "message": "Undefined API request"
                                    })
                                }
                            })
                            //----------------------------
                        }
                        else {
                            global.log.error("AuthManager", "authRoutine", "Undefined user")
                            responseManager.unauthorized(response, {
                                "message": "Undefined user or Unverified user"
                            })
                        }
                    })
                    //----------------------------
                }
                else {
                    global.log.error("AuthManager", "authRoutine", "Token not verified")
                    responseManager.unauthorized(response, {
                        "message": "Token not verified"
                    })
                }
            })
            //----------------------------
        }
        else {
            global.log.error("AuthManager", "authRoutine", "Empty token")
            responseManager.badRequest(response, {
                "message": "Empty token"
            })
        }
    })
}

exports.getUrlInfoFromDB = function (url, method, callbackFunc) {
    const admin = global.admin

    var apiRef = admin.database().ref(global.define.DB_PATH_API)
    apiRef.once("value", function (apiSnapshot) {
        var apiSnapshotData = apiSnapshot.val()
        for(var index in apiSnapshotData) {
            var api = apiSnapshotData[index]
            // global.log.debug("AuthManager", "getUrlInfoFromDB", "api: " + JSON.stringify(api) + " index: " + index)
            if(api["endpoint"].includes(url) && api["method"] == method) {
                callbackFunc(api)
                return
            }
        }

        callbackFunc(undefined)
    })
}

exports.getRoleListFromDB = function (callbackFunc) {
    const admin = global.admin
    var roleRef = admin.database().ref(global.define.DB_PATH_ROLE)
    roleRef.once("value", function ( roleSnapshot ) {
        var roleSnapshotData = roleSnapshot.val()
        callbackFunc(roleSnapshotData)
    })
}

exports.getAccountInfoFromDB = function (uid, callbackFunc) {
    const admin = global.admin
    const util = require('util')
    const accountDBPath = util.format(global.define.DB_PATH_ACCOUNTS_UID, uid)

    var accountRef = admin.database().ref(accountDBPath)
    accountRef.once("value", function ( accountSnapshot ) {
        var accountSnapshotData = accountSnapshot.val()
        callbackFunc(accountSnapshotData)
    })
}

exports.getAuthToken = function (request, callbackFunc) {
    var token = request.get('Authorization')
    callbackFunc(token)
}

exports.verifyToken = function (token, callbackFunc) {
    const admin = global.admin
    admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
            callbackFunc(decodedToken)
        })
        .catch(function (error) {
            global.log.error("AuthManager", "verifyToken", "cannot decode token: " + JSON.stringify(error))
            callbackFunc(undefined)
        })
}

exports.getUserInfoFromUID = function (uid, callbackFunc) {
    const admin = global.admin
    admin.auth().getUser(uid)
        .then(function (userRecord) {
            callbackFunc(userRecord)
        })
        .catch(function (error) {
            global.log.error("AuthManager", "getUserInfoFromUID", "cannot get user info from uid: " + JSON.stringify(error))
        })
}

exports.checkThisAccountHasPermission = function(accountInfo, roleList, api, callbackFunc) {
    var apiRequireRole = roleList[api["role"]]
    var accountRole = roleList[accountInfo["role"]]

    global.log.debug("AuthManager", "checkThisAccountHasPermission", "api role: " + JSON.stringify(apiRequireRole) + " account role: " + JSON.stringify(accountRole))

    if(apiRequireRole && accountRole) {
        if(apiRequireRole["level"] <= accountRole["level"]) {
            callbackFunc(true)
        }
        else {
            callbackFunc(false)
        }
    }
    else {
        callbackFunc(false)
    }
}