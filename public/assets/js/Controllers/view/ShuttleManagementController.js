app.controller("ShuttleManagementController", function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, $mdDialog, KSAppService) {
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
        if($scope.routineList === undefined || $scope.routineList == null) {
            $scope.routineList = []
        }
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
        if($scope.stationList === undefined || $scope.stationList == null) {
            $scope.stationList = []
        }
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

    $scope.addSchedule = function() {
        if($scope.scheduleList === undefined || $scope.scheduleList == null) {
            $scope.scheduleList = []
        }
        $scope.scheduleList.push(
            ZERO
        )
        KSAppService.showToast("New schedule!", TOAST_SHOW_LONG)
    }

    $scope.deleteRoutine = function(routine, index) {
        KSAppService.debug("ShuttleManagementController", "deleteRoutine", "selected routine: " + "#" + index + ": " + JSON.stringify(routine))

        var confirm = $mdDialog.confirm()
            .title('Routine 삭제')
            .textContent("Routine" + routine["routineName"] + " #" + routine["routineKey"] + '를 삭제합니다')
            // .targetEvent(ev)
            .ok('확인')
            .cancel('취소');

        $mdDialog.show(confirm).then(function() {
            KSAppService.info("ShuttleManagementController", "delete", "delete routine confirmed")
            if(routine["routineKey"] != null) {
                delRoutine(routine)
            }
            $scope.routineList.splice(index, 1)
        }, function() {
            KSAppService.info("ShuttleManagementController", "delete", "delete routine canceled")
        });
    }

    $scope.deleteStation = function(station, index) {
        KSAppService.debug("ShuttleManagementController", "deleteStation", "selected station: " + "#" + index + ": " + JSON.stringify(station))

        var confirm = $mdDialog.confirm()
            .title('Station 삭제')
            .textContent("Station" + station["stationName"] + " #" + station["stationKey"] + '를 삭제합니다')
            // .targetEvent(ev)
            .ok('확인')
            .cancel('취소');

        $mdDialog.show(confirm).then(function() {
            KSAppService.info("ShuttleManagementController", "delete", "delete station confirmed")
            if($scope.routineKey != null && station["stationKey"]) {
                delStation($scope.routineKey, station["stationKey"])
            }
            $scope.stationList.splice(index, 1)
        }, function() {
            KSAppService.info("ShuttleManagementController", "delete", "delete station canceled")
        });
    }

    $scope.deleteSchedule = function(schedule, index) {
        KSAppService.debug("ShuttleManagementController", "deleteSchedule", "selected schedule: " + "#" + index + ": " + schedule)
        $scope.scheduleList.splice(index, 1)
    }

    $scope.submitRoutine = function (routine, index) {
        KSAppService.debug("ShuttleManagementController", "submitRoutine", "selected routine: " + "#" + index + JSON.stringify(routine))
        createOrUpdateRoutine(routine)
    }

    $scope.expandStation = function (routine, index) {
        $scope.routineKey = routine["routineKey"]
        KSAppService.debug("ShuttleManagementController", "expandStation", "selected routine: " + "#" + index  + JSON.stringify(routine))
        getStationList($scope.routineKey)
    }

    $scope.submitStation = function(station, index) {
        KSAppService.debug("ShuttleManagementController", "submitStation", "selected station: " + "#" + index  + JSON.stringify(station))
        createOrUpdateStation(station)
    }

    $scope.expandSchedule = function (station, index) {
        $scope.stationKey = station["stationKey"]
        KSAppService.debug("ShuttleManagementController", "expandSchedule", "selected station: " + "#" + index  + JSON.stringify(station))
        getScheduleList($scope.routineKey, station["stationKey"])
    }

    $scope.submitSchedule = function(scheduleList) {
        if($scope.routineKey != null && $scope.stationKey != null) {
            updateSchedule($scope.routineKey, $scope.stationKey, scheduleList)
        }
        else {
            KSAppService.warn("ShuttleManagementController", "expandSchedule", "routine key and station key must not null")
        }
    }

    $scope.secondToTime = function (second) {
        var sec_num = second
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }

    function updateSchedule(routineKey, stationKey, scheduleList) {
        var payload = {
            "routineKey": routineKey,
            "stationKey": stationKey,
            "schedule": scheduleList
        }

        KSAppService.patchReq(
            API_PATCH_ROUTINE_STATION_SCHEDULE,
            payload,
            function (data) {
                KSAppService.debug("ShuttleManagementController", "updateSchedule", "update schedule result received: " + JSON.stringify(data))
            },
            function (error) {
                KSAppService.error("ShuttleManagementController", "updateSchedule", "update schedule failed: " + JSON.stringify(error))
            })
    }

    function delStation(routineKey, stationKey) {
        var payload = {
            "routineKey": routineKey,
            "stationKey": stationKey
        }

        KSAppService.deleteReq(
            API_DELETE_ROUTINE_STATION,
            payload,
            function (data) {
                KSAppService.debug("ShuttleManagementController", "delStation", "delete station result received: " + JSON.stringify(data))
            },
            function (error) {
                KSAppService.error("ShuttleManagementController", "delStation", "delete station failed: " + JSON.stringify(error))
            }
        )
    }

    function createOrUpdateStation(station) {
        var payload = {
            "routineKey": $scope.routineKey,
            "name": station["stationName"]
        }
        if(station.hasOwnProperty("stationKey")) {//update
            payload["stationKey"] = station["stationKey"]

            KSAppService.patchReq(
                API_PATCH_ROUTINE_STATION,
                payload,
                function (data) {
                    KSAppService.debug("ShuttleManagementController", "createOrUpdateStation-update", "update result received: " + JSON.stringify(data))
                },
                function (error) {
                    KSAppService.error("ShuttleManagementController", "createOrUpdateStation-update", "update failed: " + JSON.stringify(error))
                })
        }
        else {//create
            KSAppService.postReq(
                API_POST_ROUTINE_STATION,
                payload,
                function (data) {
                    KSAppService.debug("ShuttleManagementController", "createOrUpdateStation-create", "create result received: " + JSON.stringify(data))
                },
                function (error) {
                    KSAppService.debug("ShuttleManagementController", "createOrUpdateStation-create", "create failed: " + JSON.stringify(error))
                })
        }
    }

    function createOrUpdateRoutine(routine) {
        var payload = {
            "name": routine["routineName"]
        }
        if(routine.hasOwnProperty("routineKey")) {//update
            payload["routineKey"] = routine["routineKey"]

            KSAppService.patchReq(
                API_PATCH_ROUTINE,
                payload,
                function (data) {
                    KSAppService.debug("ShuttleManagementController", "createOrUpdateRoutine-update", "update result received: " + JSON.stringify(data))
                },
                function (error) {
                    KSAppService.error("ShuttleManagementController", "createOrUpdateRoutine-update", "cannot update routine: " + JSON.stringify(error))
                })
        }
        else { //create
            KSAppService.postReq(
                API_POST_ROUTINE,
                payload,
                function (data) {
                    KSAppService.debug("ShuttleManagementController", "createOrUpdateRoutine-create", "create result received: " + JSON.stringify(data))
                },
                function (error) {
                    KSAppService.error("ShuttleManagementController", "createOrUpdateRoutine-create", "cannot create routine: " + JSON.stringify(error))
                })
        }
    }

    function delRoutine(routine) {
        var payload = {
            "routineKey": routine["routineKey"]
        }

        KSAppService.deleteReq(
            API_DELETE_ROUTINE,
            payload,
            function (data) {
                KSAppService.debug("ShuttleManagementController", "delRoutine", "delete result received: " + JSON.stringify(data))
            },
            function (error) {
                KSAppService.error("ShuttleManagementController", "delRoutine", "cannot delete routine: " + JSON.stringify(error))
            })
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