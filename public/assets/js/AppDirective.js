app.directive('map', function($window, KSAppService) {
    return {
        restrict: 'A',
        scope: {
            'shareObject': '=',
            'stream': '='
        },
        link: function (scope, element, attrs) {
            var markStackList = []
            var map = undefined

            scope.$on('locationChanged', function (event, data) {
                KSAppService.debug("AppDirective-map", "locationChanged", "data: " + JSON.stringify(data))
                refreshMark(data["list"])
            })

            function refreshMark(locationList) {
                resetMark()
                for(var key in locationList) {
                    var item = locationList[key]
                    pushMark({
                        lat: item["lat"],
                        lng: item["lon"],
                        // icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                    })
                }
            }

            function init() {
                KSAppService.info("AppDirective-map", "init", "init")

                map = new google.maps.Map(element[0], {
                    zoom: 14.2,
                    center: {lat: 37.274786, lng: 127.125394}
                })

                resetMark()
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