exports.updateLocation = function (request, response, callbackFunc) {
    const functions = require('firebase-functions');
    var signInInfo = global.envManager.getUbikhanInfo(functions)
    const signInUbikhan = this.signInUbikhan
    const checkSignedIn = this.checkSignedIn
    const getBusLocation = this.getBusLocation
    const saveBusLocationData = this.saveBusLocationData
    /*
    Sign in process
     */
    signInUbikhan(signInInfo.loginInfo,
        function (responseResult, responseResultStr) {
            global.log.debug("ubikhanManager", "updateLocation-signInUbikhan", "sign in response received: " + responseResultStr)

            /*
            Checking sign in
             */
            var cookie = responseResult.headers["set-cookie"]
            checkSignedIn(cookie,
                function (checkResponse, checkResponseResultStr) {
                    global.log.debug("ubikhanManager", "updateLocation-checkSignedIn", "sign in result: " + checkResponseResultStr)

                    var signInResult = JSON.parse(checkResponseResultStr)
                    if(signInResult["Logged In"]) {
                        /*
                        Get bus location list
                        */
                        getBusLocation(signInInfo.apiParam, cookie,
                            function (busResponseResult, busResponseResultStr) {
                                global.log.debug("ubikhanManager", "updateLocation-getBusLocation", "bus list: " + busResponseResultStr)
                                saveBusLocationData(JSON.parse(busResponseResultStr))
                                callbackFunc(true)
                            },
                            function (error) {
                                global.log.error("ubikhanManager", "updateLocation-getBusLocation", "cannot get bus list: " + JSON.stringify(error))
                                callbackFunc(false)
                            })
                    }
                    else {
                        global.log.warn("ubikhanManager", "updateLocation-checkSignedIn", "not signed in")
                        callbackFunc(false)
                    }
                },
                function(error) {
                    global.log.error("ubikhanManager", "updateLocation-checkSignedIn", "sign in failed: " + JSON.stringify(error))
                    callbackFunc(false)
                })

        },
        function (error) {
            global.log.error("ubikhanManager", "updateLocation-signInUbikhan", "cannot sign in: " + JSON.stringify(error))

            callbackFunc(false)
        })
}

exports.saveBusLocationData = function(locationData) {
    var admin = global.admin
    const datetimeManager = require('../Utils/datetimeManager')
    locationData["updateDateTime"] = datetimeManager.getCurrentTime().toISOString()
    admin.database().ref(global.define.DB_PATH_SHUTTLE_LOCATION).set(locationData, function (error) {
        if(error) {
            global.log.error("ubikhanManager", "saveBusLocationData", "cannot save location data: " + JSON.stringify(error))
        }
        else {
            global.log.info("ubikhanManager", "saveBusLocationData", "bus location data saved")
        }
    })
}

exports.getBusLocation = function(apiParam, cookie, successFunc, errorFunc) {
    const httpRequestManager = require('../Utils/httpRequestManager')
    var fakeHeaderOptions = {
        hostname: 'new.ubikhan.com',
        path: '/my_ubikhan/car_status',
        port: '80',
        method: 'POST',
        // referer: "http://new.ubikhan.com/member/login?request_url=map",
        Referer: "http://new.ubikhan.com/map",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(apiParam,'utf8'),
            'Referer': "http://new.ubikhan.com/map",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
            "Cookie": cookie
        }
    }
    global.log.debug("ubikhanManager", "getBusLocation", "get bus list with param: " + JSON.stringify(apiParam))

    httpRequestManager.request(fakeHeaderOptions, successFunc, errorFunc, apiParam)
}

exports.checkSignedIn = function(cookie, successFunc, errorFunc) {
   const httpRequestManager = require('../Utils/httpRequestManager')
   var fakeHeaderOptions = {
        hostname: 'new.ubikhan.com',
        path: '/member/check_logged',
        port: '80',
        method: 'POST',
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded',
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
            "Cookie": cookie
        }
    }
    global.log.debug("ubikhanManager", "checkSignedIn", "check am i signed in")

    httpRequestManager.request(fakeHeaderOptions, successFunc, errorFunc, undefined)
}

exports.signInUbikhan = function(signInData, successFunc, errorFunc) {
    const httpRequestManager = require('../Utils/httpRequestManager')
    const fakeHeaderOptions = {
        hostname: 'new.ubikhan.com',
        path: '/member/login',
        port: '80',
        method: 'POST',
        // referer: "http://new.ubikhan.com/member/login?request_url=map",
        Referer: "http://new.ubikhan.com/member/login?request_url=map",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36",
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(signInData,'utf8'),
            'Referer': "http://new.ubikhan.com/member/login?request_url=map",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ko;q=0.8",
            // "Cookie": sessionId
        }
    }
    global.log.debug("ubikhanManager", "signInUbikhan", "sign in as: " + JSON.stringify(signInData))

    httpRequestManager.request(fakeHeaderOptions, successFunc, errorFunc, signInData)
}

exports.getLocation = function (request, response, callbackFunc) {
    var admin = global.admin
    var shuttleLocationRef = admin.database().ref(global.define.DB_PATH_SHUTTLE_LOCATION)
    shuttleLocationRef.once("value", function(locationSnapshot) {
        callbackFunc(locationSnapshot)
    })
}