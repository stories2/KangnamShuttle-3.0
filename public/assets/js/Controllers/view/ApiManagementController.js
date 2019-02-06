app.controller("ApiManagementController", function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, KSAppService) {
    KSAppService.info("ApiManagementController", "ApiManagementController", "init");

    $scope.apiList = []
    $scope.roleList = {}

    $scope.onLoad = function () {
        getApiList()
        getRoleList()
    }

    function getRoleList() {
        var payload = {}

        KSAppService.getReq(
            API_GET_ROLE_LIST,
            payload,
            function (data) {
                KSAppService.debug("ApiManagementController", "getRoleList", "role list received: " + JSON.stringify(data))
                initRoleList(data)
            },
            function (error) {
                KSAppService.error("ApiManagementController", "getRoleList", "cannot get role list: " + JSON.stringify(error))
            })
    }

    function initRoleList(data) {
        $scope.roleList = data["data"]
    }

    function getApiList() {
        var payload = {}

        KSAppService.getReq(
            API_GET_API_LIST,
            payload,
            function (data) {
                KSAppService.debug("ApiManagementController", "getApiList", "api list received: " + JSON.stringify(data))
                initApiList(data)
            },
            function (error) {
                KSAppService.error("ApiManagementController", "getApiList", "cannot get api list: " + JSON.stringify(error))
            })
    }

    function initApiList(data) {
        $scope.apiList = data["data"]
    }
})