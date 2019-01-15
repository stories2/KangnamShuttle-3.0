app.directive('map', function($window, KSAppService) {
    return {
        restrict: 'A',
        scope: {
            'shareObject': '=',
            'stream': '='
        },
        link: function (scope, element, attrs) {

            var map = undefined

            function init() {
                KSAppService.info("AppDirective-map", "init", "init")

                map = new google.maps.Map(element[0], {
                    zoom: 4,
                    center: {lat: -33, lng: 151}
                })

                var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
                var beachMarker = new google.maps.Marker({
                    position: {lat: -33.890, lng: 151.274},
                    map: map,
                    icon: image
                });

                beachMarker.setMap(null)
            }

            init()
        }
    }
})