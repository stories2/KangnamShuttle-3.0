exports.createUserRoutine = function (request, response, callbackFunc) {

    const getSignInSession = this.getSignInSession
    const getUserBasicInfo = this.getUserBasicInfo
    const getUserProfilePic = this.getUserProfilePic
    const registerUser = this.registerUser

    var userData = {}
    var responseTemplate = {
        "success": false
    }

    global.log.info("accountManager", "createUserRoutine", "get sign in session process will start")
    getSignInSession(request.body, function (session) {
        if(session) {
            global.log.info("accountManager", "createUserRoutine", "get user's basic info process will start")
            getUserBasicInfo(session, function (userBasicData) {
                if(userBasicData) {

                    userData = {
                        "birthday": userBasicData["birthday"],
                        "nameKor": userBasicData["nameKor"],
                        "separate": userBasicData["separate"],
                        "sex": userBasicData["sex"],
                        "studentId": userBasicData["studentId"],
                        "pic": "",
                        "email": request.body["email"],
                        "uid": "",
                        "password": request.body["password"]
                    }
                    global.log.info("accountManager", "createUserRoutine", "get user's profile pic process will start")
                    getUserProfilePic(session, function (userProfilePic) {
                        if(userProfilePic) {
                            userData["pic"] = userProfilePic
                            global.log.info("accountManager", "createUserRoutine", "register user to server process will start")
                            registerUser(userData, function (uid) {
                                if(uid) {
                                    global.log.info("accountManager", "createUserRoutine", "ok, all process passed successfully")
                                    responseTemplate["success"] = true
                                    callbackFunc(responseTemplate)
                                }
                                else {
                                    global.log.warn("accountManager", "createUserRoutine", "cannot register user to server")
                                    callbackFunc(responseTemplate)
                                }
                            })
                        }
                        else {
                            global.log.warn("accountManager", "createUserRoutine", "cannot get user profile pic")
                            callbackFunc(responseTemplate)
                        }
                    })
                }
                else {
                    global.log.warn("accountManager", "createUserRoutine", "cannot get user basic info")
                    callbackFunc(responseTemplate)
                }
            })
        }
        else {
            global.log.warn("accountManager", "createUserRoutine", "wrong user sign in info detected")
            callbackFunc(responseTemplate)
        }
    })
}

exports.getSignInSession = function (accountData, callbackFunc) {
    const request = require('request')
    const util = require('util')
    var studentId = accountData["email"].split("@")[0]
    const authApiUrl = "https://" + global.define.API_KANGNAM_SHUTTLE_ADDONS_DOMAIN +
        util.format(global.define.API_AUTH_SIGN_IN, studentId)
    const payload = {
        "password": accountData["password"]
    }
    global.log.debug("accountManager", "getSignInSession", "#" + studentId + " full data: " + JSON.stringify(accountData))
    global.log.debug("accountManager", "getSignInSession", "url: " + authApiUrl + " payload: " + JSON.stringify(payload))

    request.post(
        authApiUrl,
        {
            json: payload
        },
        function (error, response, body) {
            if(!error && body["success"]) {
                var session = response.headers["set-cookie"][0]
                // global.log.debug("accountManager", "getSignInSession", "headers: " + JSON.stringify(response.headers))
                global.log.debug("accountManager", "getSignInSession", "ok signed in, session: " + session)
                callbackFunc(session)
            }
            else {
                global.log.error("accountManager", "getSignInSession", "cannot sign in, error: " + JSON.stringify(error) + " body: " + JSON.stringify(body))
                callbackFunc(undefined)
            }
        }
    )
}

exports.getUserBasicInfo = function (session, callbackFunc) {

}

exports.getUserProfilePic = function (session, callbackFunc) {

}

exports.registerUser = function (userData, callbackFunc) {

}