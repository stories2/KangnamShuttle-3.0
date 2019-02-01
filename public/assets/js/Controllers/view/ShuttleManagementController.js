app.controller("ShuttleManagementController", function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, KSAppService) {
    KSAppService.info("ShuttleManagementController", "ShuttleManagementController", "init");

    $scope.routineList = []

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

    $scope.submitRoutine = function (routine, index) {
        KSAppService.debug("ShuttleManagementController", "submitRoutine", "selected routine: " + "#" + index + JSON.stringify(routine))
    }

    $scope.expandStation = function (routine, index) {
        KSAppService.debug("ShuttleManagementController", "expandStation", "selected routine: " + "#" + index  + JSON.stringify(routine))
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