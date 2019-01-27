exports.verifyAuthToken = function(request, response, next) {
    var responseManager = require('../Utils/ResponseManager')
    const admin = global.admin
    const checkAccountRole = this.checkAccountRole

    global.log.debug("AuthManager", "verifyAuthToken", "request header: " + JSON.stringify(request.headers))
    global.log.debug("AuthManager", "verifyAuthToken", "request url: " + request.url + " method: " + request.method)

    try {
        token = request.get('Authorization')
        admin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                global.log.debug("AuthManager", "verifyAuthToken", "token verified uid: " + decodedToken.uid)
                request.user = decodedToken
                admin.auth().getUser(decodedToken.uid)
                    .then(function (userRecord) {
                        global.log.info("AuthManager", "verifyAuthToken", "we found user info")
                        userRecordData = userRecord.toJSON()
                        userRecordDataStr = JSON.stringify(userRecordData)
                        request.userRecordData = userRecordData
                        global.log.debug("AuthManager", "verifyAuthToken", "user info decoded : " + userRecordDataStr)

                        checkAccountRole(responseManager, decodedToken.uid, request, function (grantted) {
                            if(grantted) {
                                return next();
                            }
                            else {
                                responseManager.forbidden(response, {})
                            }
                        })
                    })
                    .catch(function (error) {
                        global.log.error("AuthManager", "verifyAuthToken", "cannot verify user: " + JSON.stringify(error))

                        responseManager.unauthorized(response, {})
                    })
            })
            .catch(function (error) {
                global.log.error("AuthManager", "verifyAuthToken", "cannot verify token: " + JSON.stringify(error))

                responseManager.unauthorized(response, {})
            })
    }
    catch (exception) {
        global.log.error("AuthManager", "verifyAuthToken", "server crashed: " + JSON.stringify(exception))

        responseManager.internalServerError(response, {})
    }
}

exports.checkAccountRole = function (responseManager, uid, request, callbackFunc) {
    const admin = global.admin
    var url = request.url
    var method = request.method

    var roleRef = admin.database().ref(global.define.DB_PATH_ROLE)
    roleRef.once("value", function ( ) {

    })
}

exports.getUrlInfoFromDB = function (url, method, callbackFunc) {
    const admin = global.admin

    var apiRef = admin.database().ref(global.define.DB_PATH_API)
    apiRef.once("value", function (apiSnapshot) {

    })
}

exports.getRoleListFromDB = function (callbackFunc) {

}

exports.getAccountInfoFromDB = function (uid, callbackFunc) {

}

exports.getAuthToken = function (request, callbackFunc) {

}

exports.verifyToken = function (token, callbackFunc) {

}

exports.getUserInfoFromUID = function (uid, callbackFunc) {

}

exports.checkThisAccountHasPermission = function(accountInfo, roleList, api, callbackFunc) {

}

exports.authRoutine = function (request, response, next) {
    const responseManager = require('../Utils/ResponseManager')

    const requestUrl = request.url
    const requestMethod = request.method

    global.log.debug("AuthManager", "authRoutine", "request header: " + JSON.stringify(request.headers))
    global.log.debug("AuthManager", "authRoutine", "request url: " + requestUrl + " method: " + requestMethod)

    const getAuthToken = this.getAuthToken
    const verifyToken = this.verifyToken
    const getUserInfoFromUID = this.getUserInfoFromUID
    const getUrlInfoFromDB = this.getUrlInfoFromDB
    const getRoleListFromDB = this.getRoleListFromDB
    const getAccountInfoFromDB = this.getAccountInfoFromDB
    const checkThisAccountHasPermission = this.checkThisAccountHasPermission

    getAuthToken(request, function (token) {
        if(token) {
            //----------------------------
            global.log.debug("AuthManager", "authRoutine", "token: " + token)
            verifyToken(token, function (decodedToken) {
                if(decodedToken) {
                    //----------------------------
                    global.log.debug("AuthManager", "authRoutine", "decodedToken: " + JSON.stringify(decodedToken))
                    getUserInfoFromUID(decodedToken.uid, function (userInfo) {
                        if(userInfo) {
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
                                "message": "Undefined user"
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
            responseManager.unauthorized(response, {
                "message": "Empty token"
            })
        }
    })
}