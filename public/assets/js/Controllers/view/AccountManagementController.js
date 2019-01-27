app.controller("AccountManagementController", function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, KSAppService) {
    KSAppService.info("AccountManagementController", "AccountManagementController", "init");

    $scope.accountList = {}

    $scope.onLoad = function () {
        getAccountList()
    }

    $scope.edit = function (item) {

    }

    $scope.delete = function (item) {

    }

    function getAccountList() {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
            // ...
            KSAppService.setToken(idToken)
            var payload = {}
            KSAppService.getReq(API_GET_ACCOUNTS_LIST,
                payload,
                function (data) {
                    KSAppService.debug("AccountManagementController", "getAccountList", "accounts list: " + JSON.stringify(data))
                    if(data["status"] == HTTP_STATUS_OK) {
                        initAccountList(data)
                    }
                },
                function (error) {
                    KSAppService.error("AccountManagementController", "getAccountList", "failed get accounts list: " + JSON.stringify(error))
                })
        }).catch(function(error) {
            // Handle error
            KSAppService.error("AccountManagementController", "getAccountList", "failed generate token: " + JSON.stringify(error))
        });
    }

    function initAccountList(data) {
        $scope.accountList = data["data"]
    }
})