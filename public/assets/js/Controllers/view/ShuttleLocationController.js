app.controller("ShuttleLocationController", function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, KSAppService) {
    KSAppService.printLogMessage("ShuttleLocationController", "ShuttleLocationController", "init", LOG_LEVEL_INFO);
    
    $scope.onLoad = function () {
        shuttleLocationProcess()
    }

    function shuttleLocationProcess() {
        KSAppService.info("ShuttleLocationController", "shuttleLocationProcess", "run shuttle location process")
        getShuttleLocation()
        updateShuttleLocation()

        $timeout(shuttleLocationProcess, SHUTTLE_LOCATION_REFRESH_TIME)
    }

    function getShuttleLocation() {
        var payload = {}

        KSAppService.getReq(
            API_GET_SHUTTLE_LOCATION,
            payload,
            function (success) {
                KSAppService.debug("ShuttleLocationController", "getShuttleLocation", "shuttle location data received: " + JSON.stringify(success))
                passDataToMap(success)
            },
            function (error) {
                KSAppService.error("ShuttleLocationController", "getShuttleLocation", "cannot get location data: " + JSON.stringify(error))
            })
    }

    function passDataToMap(data) {
        KSAppService.info("ShuttleLocationController", "passDataToMap", "pass location data to map")
        $rootScope.$broadcast('locationChanged', data["data"])
    }

    function updateShuttleLocation() {
        var payload = {}

        KSAppService.patchReq(
            API_GET_SHUTTLE_LOCATION,
            payload,
            function (success) {
                KSAppService.debug("ShuttleLocationController", "updateShuttleLocation", "pending shuttle location update: " + JSON.stringify(success))
            },
            function (error) {
                KSAppService.error("ShuttleLocationController", "updateShuttleLocation", "cannot request update shuttle location: " + JSON.stringify(error))
            })
    }
})