app.directive('map', function($window, $timeout, KSAppService) {
    return {
        restrict: 'A',
        scope: {
            'shareObject': '=',
            'stream': '='
        },
        link: function (scope, element, attrs) {
            var markStackList = []
            var map = undefined
            var isDestroy = false

            scope.$on('locationChanged', function (event, data) {
                KSAppService.debug("AppDirective-map", "locationChanged", "data: " + JSON.stringify(data))
                refreshMark(data["list"])
            })

            scope.$on('$destroy', function() {
                KSAppService.info("AppDirective-map", "$destroy", "element destroyed")
                isDestroy = true
            });

            function shuttleLocationProcess() {
                KSAppService.info("AppDirective-map", "shuttleLocationProcess", "run shuttle location process")
                if(!isDestroy) {
                    getShuttleLocation()
                    updateShuttleLocation()

                    $timeout(shuttleLocationProcess, SHUTTLE_LOCATION_REFRESH_TIME)
                }
            }

            function getShuttleLocation() {
                var payload = {}

                KSAppService.getReq(
                    API_GET_SHUTTLE_LOCATION,
                    payload,
                    function (success) {
                        KSAppService.debug("AppDirective-map", "getShuttleLocation", "shuttle location data received: " + JSON.stringify(success))
                        passDataToMap(success)
                        passDataToController(success)
                    },
                    function (error) {
                        KSAppService.error("AppDirective-map", "getShuttleLocation", "cannot get location data: " + JSON.stringify(error))
                    })
            }

            function passDataToController(success) {
                scope.stream(success)
            }

            function passDataToMap(data) {
                KSAppService.info("AppDirective-map", "passDataToMap", "pass location data to map")
                // $rootScope.$broadcast('locationChanged', data["data"])
                refreshMark(data["data"]["list"])
            }

            function updateShuttleLocation() {
                var payload = {}

                KSAppService.patchReq(
                    API_GET_SHUTTLE_LOCATION,
                    payload,
                    function (success) {
                        KSAppService.debug("AppDirective-map", "updateShuttleLocation", "pending shuttle location update: " + JSON.stringify(success))
                    },
                    function (error) {
                        KSAppService.error("AppDirective-map", "updateShuttleLocation", "cannot request update shuttle location: " + JSON.stringify(error))
                    })
            }

            function refreshMark(locationList) {
                resetMark()
                KSAppService.debug("AppDirective-map", "refreshMark", "location list: " + JSON.stringify(locationList))
                for(var key in locationList) {
                    var item = locationList[key]
                    pushMark({
                        lat: item["lat"],
                        lng: item["lon"],
                        icon: item["startstatus"] == "1" ? "https://firebasestorage.googleapis.com/v0/b/kangnamshuttle3.appspot.com/o/Map%2FbusEnable.png?alt=media&token=f62ed4b5-afe7-4a26-8fcd-ad160f1575e1" : "https://firebasestorage.googleapis.com/v0/b/kangnamshuttle3.appspot.com/o/Map%2FbusDisable.png?alt=media&token=517cc599-f14e-4f70-ab45-42f895c7eab2"
                        // icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                    })
                }
            }

            function init() {
                KSAppService.info("AppDirective-map", "init", "init")

                isDestroy = false

                map = new google.maps.Map(element[0], {
                    zoom: 14.2,
                    center: {lat: 37.274786, lng: 127.125394}
                })

                resetMark()
                shuttleLocationProcess()
                // pushMark({
                //     lat: -33.890,
                //     lng: 151.274,
                //     icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                // })
                // resetMark()
            }

            function pushMark(mark) {
                KSAppService.debug("AppDirective-map", "pushMark", "push new mark: " + JSON.stringify(mark))

                var marker = new google.maps.Marker({
                    position: {
                        lat: mark["lat"],
                        lng: mark["lng"]
                    },
                    map: map,
                    icon: mark["icon"]
                })

                markStackList.push(marker)
                KSAppService.debug("AppDirective-map", "pushMark", "now mark stack size: " + markStackList.length)
            }

            function popMark() {
                var stackPoint = markStackList.length - 1
                if(stackPoint < ZERO) {
                    KSAppService.warn("AppDirective-map", "popMark", "underflow detected: " + stackPoint)
                    return false
                }

                var currentMarker = markStackList[stackPoint]
                markStackList.pop()
                currentMarker.setMap(null)
                KSAppService.debug("AppDirective-map", "popMark", "#" + stackPoint + " item popped")
                return true
            }

            function resetMark() {
                while(popMark()) {

                }
                KSAppService.info("AppDirective-map", "resetMark", "mark stack resetted")
            }

            init()
        }
    }
})

app.directive('bus', function($window, $timeout, KSAppService) {
    return {
        restrict: 'A',
        scope: {
            'shareObject': '=',
            'stream': '='
        },
        link: function (scope, element, attrs) {

            var platformAndRoute = {
                "228000694": {
                    "name": "강남대역 정류소",
                    "routeList": {
                        "228000388": {
                            "name": "5000A용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000174": {
                            "name": "5000B용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000176": {
                            "name": "5001용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000389": {
                            "name": "5003A용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000182": {
                            "name": "5003B용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000175": {
                            "name": "5005용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000184": {
                            "name": "5600용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "241004890": {
                            "name": "8165고양",
                            "type": "공항",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        }
                    }
                },
                "228000684": {
                    "name": "강남대역 건너편 정류소",
                    "routeList": {
                        "228000388": {
                            "name": "5000A용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000174": {
                            "name": "5000B용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000176": {
                            "name": "5001용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000389": {
                            "name": "5003A용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000182": {
                            "name": "5003B용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000175": {
                            "name": "5005용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "228000184": {
                            "name": "5600용인",
                            "type": "직행",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        },
                        "241004890": {
                            "name": "8165고양",
                            "type": "공항",
                            "arriveInfo": "",
                            "lastUpdateDatetime": ""
                        }
                    }
                }
            }
            var isDestroy = false

            scope.$on('$destroy', function() {
                KSAppService.info("AppDirective-bus", "$destroy", "element destroyed")
                isDestroy = true
            });

            function patchLatestArriveInfo() {
                for(var platformID in platformAndRoute) {
                    var platformData = platformAndRoute[platformID]
                    for(var route in platformData["routeList"]) {

                        const payload = {
                            route: route,
                            platform: platformID
                        }

                        KSAppService.debug("AppDirective-bus", "patchLatestArriveInfo", "payload: " + JSON.stringify(payload))

                        KSAppService.patchReq(
                            API_PATCH_PUBLIC_BUS,
                            payload,
                            function (data) {
                                KSAppService.debug("AppDirective-bus", "patchLatestArriveInfo", "data: " + JSON.stringify(data))
                            },
                            function (error) {
                                KSAppService.error("AppDirective-bus", "patchLatestArriveInfo", "cannot patch bus data: " + JSON.stringify(error))
                            })
                    }
                }
            }

            function getLatestArriveInfo() {
                for(var platformID in platformAndRoute) {
                    var platformData = platformAndRoute[platformID]
                    for(var route in platformData["routeList"]) {

                        const payload = {
                            route: route,
                            platform: platformID
                        }

                        var setData = function(data) {
                            const payloadBak = payload
                            KSAppService.debug("AppDirective-bus", "getLatestArriveInfo", "payload bak: " + JSON.stringify(payloadBak) + " data: " + JSON.stringify(data))

                            var arriveInfo = "이번 " + data["data"]["arrmsg1"] + ", 다음 " + data["data"]["arrmsg2"]

                            platformAndRoute[payloadBak["platform"]]["routeList"][payloadBak["route"]]["arriveInfo"] = arriveInfo
                            platformAndRoute[payloadBak["platform"]]["routeList"][payloadBak["route"]]["lastUpdateDatetime"] = data["data"]["lastUpdateDatetime"]

                            scope.stream(platformAndRoute)
                        }

                        KSAppService.debug("AppDirective-bus", "getLatestArriveInfo", "payload: " + JSON.stringify(payload))

                        KSAppService.getReq(
                            API_GET_PUBLIC_BUS,
                            payload,
                            setData,
                            function (error) {
                                KSAppService.error("AppDirective-bus", "getLatestArriveInfo", "cannot get bus data: " + JSON.stringify(error))
                            })
                    }
                }
            }

            function init() {
                KSAppService.info("AppDirective-bus", "init", "init")
                publicBusRefreshRoutine()
            }

            function publicBusRefreshRoutine() {
                if(!isDestroy) {
                    getLatestArriveInfo()
                    patchLatestArriveInfo()
                    $timeout(publicBusRefreshRoutine, PUBLIC_TRANSPORT_BUS_REFRESH_TIME)
                }
            }

            init()
        }
    }
})

app.directive('subway', function($window, $timeout, KSAppService) {
    return {
        restrict: 'A',
        scope: {
            'shareObject': '=',
            'stream': '='
        },
        link: function (scope, element, attrs) {

            var isDestroy = false

            scope.$on('$destroy', function() {
                KSAppService.info("AppDirective-subway", "$destroy", "element destroyed")
                isDestroy = true
            });

            function init() {
                KSAppService.info("AppDirective-subway", "init", "init")
            }

            init()
        }
    }
})