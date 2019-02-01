app.controller("ShuttleManagementController", function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, KSAppService) {
    KSAppService.info("ShuttleManagementController", "ShuttleManagementController", "init");

    $scope.routineList = []
    $scope.stationList = []
    $scope.scheduleList = []
    $scope.routineKey = ""
    $scope.stationKey = ""

    $scope.onLoad = function() {
        getRoutineList()
    }

    $scope.addRoutine = function() {
        if($scope.routineList.length >= MAXIMUM_OF_ROUTINE_SIZE) {
            KSAppService.showToast("Routine limit = " + MAXIMUM_OF_ROUTINE_SIZE, TOAST_SHOW_LONG)
        }
        else {
            $scope.routineList.push({
                "routineName": ""
            })
            KSAppService.showToast("New routine!", TOAST_SHOW_LONG)
        }
    }

    $scope.addStation = function() {
        if($scope.stationList.length >= MAXIMUM_OF_STATION_SIZE) {
            KSAppService.showToast("Station limit = " + MAXIMUM_OF_STATION_SIZE, TOAST_SHOW_LONG)
        }
        else {
            $scope.stationList.push({
                "stationName": ""
            })
            KSAppService.showToast("New station!", TOAST_SHOW_LONG)
        }
    }

    $scope.submitRoutine = function (routine, index) {
        KSAppService.debug("ShuttleManagementController", "submitRoutine", "selected routine: " + "#" + index + JSON.stringify(routine))
    }

    $scope.expandStation = function (routine, index) {
        $scope.routineKey = routine["routineKey"]
        KSAppService.debug("ShuttleManagementController", "expandStation", "selected routine: " + "#" + index  + JSON.stringify(routine))
        getStationList($scope.routineKey)
    }

    $scope.submitStation = function(station, index) {
        KSAppService.debug("ShuttleManagementController", "submitStation", "selected routine: " + "#" + index  + JSON.stringify(station))
    }

    $scope.expandSchedule = function (station, index) {
        $scope.stationKey = station["stationKey"]
        KSAppService.debug("ShuttleManagementController", "expandSchedule", "selected routine: " + "#" + index  + JSON.stringify(station))
        getScheduleList($scope.routineKey, station["stationKey"])
    }

    function getScheduleList(routineKey, stationKey) {
        var payload = {
            "routineKey": routineKey,
            "stationKey": stationKey
        }
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            KSAppService.setToken(idToken)
            KSAppService.getReq(
                API_GET_ROUTINE_STATION_SCHEDULE_LIST,
                payload,
                function (data) {
                    KSAppService.debug("ShuttleManagementController", "getScheduleList", "data received: " + JSON.stringify(data))
                    initScheduleList(data)
                },
                function (error) {
                    KSAppService.error("ShuttleManagementController", "getScheduleList", "cannot get routine station's schedule list: " + JSON.stringify(error))
                    KSAppService.showToast("Failed to get shuttle routine station' schedule list", TOAST_SHOW_LONG)
                })
        }).catch(function(error) {
            // Handle error
            KSAppService.error("ShuttleManagementController", "getScheduleList", "failed generate token: " + JSON.stringify(error))
            KSAppService.showToast("Failed generate token", TOAST_SHOW_LONG)
        });
    }

    function initScheduleList(data) {
        $scope.scheduleList = data["data"]
    }
    
    function getStationList(routineKey) {
        var payload = {
            "routineKey": routineKey
        }
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            KSAppService.setToken(idToken)
            KSAppService.getReq(
                API_GET_ROUTINE_STATION_LIST,
                payload,
                function (data) {
                    KSAppService.debug("ShuttleManagementController", "getStationList", "data received: " + JSON.stringify(data))
                    initStationList(data)
                },
                function (error) {
                    KSAppService.error("ShuttleManagementController", "getStationList", "cannot get routine station list: " + JSON.stringify(error))
                    KSAppService.showToast("Failed to get shuttle routine station list", TOAST_SHOW_LONG)
                })
        }).catch(function(error) {
            // Handle error
            KSAppService.error("ShuttleManagementController", "getStationList", "failed generate token: " + JSON.stringify(error))
            KSAppService.showToast("Failed generate token", TOAST_SHOW_LONG)
        });
    }

    function initStationList(data) {
        $scope.stationList = data["data"]
    }

    function getRoutineList() {
        var payload = {}
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            KSAppService.setToken(idToken)
            KSAppService.getReq(
                API_GET_ROUTINE_LIST,
                payload,
                function (data) {
                    KSAppService.debug("ShuttleManagementController", "getRoutineList", "data received: " + JSON.stringify(data))
                    initRoutineList(data)
                },
                function (error) {
                    KSAppService.error("ShuttleManagementController", "getRoutineList", "cannot get routine: " + JSON.stringify(error))
                    KSAppService.showToast("Failed to get shuttle routine list", TOAST_SHOW_LONG)
                })
        }).catch(function(error) {
            // Handle error
            KSAppService.error("ShuttleManagementController", "getRoutineList", "failed generate token: " + JSON.stringify(error))
            KSAppService.showToast("Failed generate token", TOAST_SHOW_LONG)
        });
    }

    function initRoutineList(data) {
        $scope.routineList = data["data"]
    }
})