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