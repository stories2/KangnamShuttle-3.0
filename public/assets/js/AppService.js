app.service("KSAppService", function ($log, $http, $window, $mdToast) {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA8fpmwbu3MGmCAHVlYkUEQkDdtg6dS0Vc",
        authDomain: "kangnamshuttle3.firebaseapp.com",
        databaseURL: "https://kangnamshuttle3.firebaseio.com",
        projectId: "kangnamshuttle3",
        storageBucket: "kangnamshuttle3.appspot.com",
        messagingSenderId: "1098842159621"
    };
    firebase.initializeApp(config);

    var setToken = function (tokenVal) {
        $window.localStorage.setItem("token", tokenVal);
        printLogMessage("KSAppService", "setToken", "update token: " + tokenVal, LOG_LEVEL_DEBUG);
    };
    var getToken = function () {
        var token = $window.localStorage.getItem("token");
        printLogMessage("KSAppService", "getToken", "return token: " + token, LOG_LEVEL_DEBUG);
        return token == null || token === undefined ? undefined : token;
    };
    var removeToken = function () {
        $window.localStorage.removeItem("token");
        printLogMessage("KSAppService", "removeToken", "token removed", LOG_LEVEL_INFO);
    };
    var showToast = function (text, delay) {
        $mdToast.show($mdToast.simple()
            .textContent(text)
            .position("top right")
            .hideDelay(delay));
    };

    var printLogMessage = function (className, methodName, message, logLevel) {
        var logDateTime = new Date().toISOString();
        var logMsg = "" + logDateTime + " ";
        if (logLevel == LOG_LEVEL_VERBOSE) {
            logMsg = logMsg + "V: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.log(logMsg);
        }
        else if (logLevel == LOG_LEVEL_INFO) {
            logMsg = logMsg + "I: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.log(logMsg);
        }
        else if (logLevel == LOG_LEVEL_DEBUG) {
            logMsg = logMsg + "D: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.log(logMsg);
        }
        else if (logLevel == LOG_LEVEL_WARN) {
            logMsg = logMsg + "W: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.log(logMsg);
        }
        else if (logLevel == LOG_LEVEL_ERROR) {
            logMsg = logMsg + "E: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.warn(logMsg);
        }
        else {
            logMsg = logMsg + "W: ";
            logMsg = logMsg + "[" + className + "] {" + methodName + "} (" + message + ")";
            $log.error(logMsg);
        }
        return;
    };
    var postReq = function (url, data, successFunc, failFunc) {
        printLogMessage("KSAppService", "postReq", "send data to url: " + url, LOG_LEVEL_INFO);
        // data["seconds"] = this.PreventCache()
        var token = getToken()

        if(token !== undefined) {
            $http.defaults.headers.common['Authorization'] = token
            printLogMessage("KSAppService", "postReq", "request with token", LOG_LEVEL_INFO)
        }

        $http({
            method: "POST",
            dataType: 'json',
            url: url,
            cache: false,
            contentType: 'application/json',
            data: data,
            crossDomain: true,
            // headers: {
            //     "Authorization": token
            // },
            xhrFields: {
                withCredentials: false
            },
            beforeSend: function (xhr) {
                if (typeof token != 'undefined') {
                    printLogMessage("KSAppService", "postReq", "auth: " + token, LOG_LEVEL_DEBUG);
                    xhr.setRequestHeader("Authorization", token);
                }
                else {
                    printLogMessage("KSAppService", "postReq", "no token sending", LOG_LEVEL_WARN);
                }
            }
        })
            .then(function (receivedData) {
                printLogMessage("KSAppService", "postReq", "data received successfully", LOG_LEVEL_INFO);
                successFunc(receivedData);
            })
            .catch(function (xhr, textStatus, errorThrown) {
                printLogMessage("KSAppService", "postReq", "something has problem: " + textStatus, LOG_LEVEL_ERROR);
                failFunc(xhr.responseText, textStatus);
            });
    };
    var getReq = function (url, data, successFunc, failFunc) {
        printLogMessage("KSAppService", "getReq", "send data to url: " + url, LOG_LEVEL_INFO);
        // data["seconds"] = this.PreventCache()
        var token = getToken()

        if(token !== undefined) {
            $http.defaults.headers.common['Authorization'] = token
            printLogMessage("KSAppService", "getReq", "request with token", LOG_LEVEL_INFO)
        }

        $http({
            type: "GET",
            dataType: 'json',
            url: url,
            cache: false,
            contentType: 'application/json',
            params: data,
            async: false,
            crossDomain: true,
            data: '',
            headers: {
                "Content-Type": "application/json"
            },
            xhrFields: {
                withCredentials: false
            },
            beforeSend: function (xhr) {
                if (typeof token != 'undefined') {
                    printLogMessage("KSAppService", "getReq", "auth: " + token, LOG_LEVEL_DEBUG);
                    xhr.setRequestHeader("Authorization", token);
                }
                else {
                    printLogMessage("KSAppService", "getReq", "no token sending", LOG_LEVEL_WARN);
                }
            }
        })
            .then(function (receivedData) {
                printLogMessage("KSAppService", "getReq", "data received successfully", LOG_LEVEL_INFO);
                successFunc(receivedData);
            })
            .catch(function (xhr, textStatus, errorThrown) {
                printLogMessage("KSAppService", "getReq", "something has problem: " + textStatus, LOG_LEVEL_ERROR);
                failFunc(xhr.responseText, textStatus);
            });
    };
    return {
        'printLogMessage': printLogMessage,
        'postReq': postReq,
        'getReq': getReq,
        'setToken': setToken,
        'getToken': getToken,
        'removeToken': removeToken,
        'showToast': showToast,
    };
});