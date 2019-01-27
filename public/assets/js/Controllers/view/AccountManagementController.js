app.controller("AccountManagementController", function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, $mdDialog, KSAppService) {
    KSAppService.info("AccountManagementController", "AccountManagementController", "init");

    $scope.accountList = {}

    $scope.onLoad = function () {
        getAccountList()
    }

    $scope.edit = function (item) {

        KSAppService.debug("AccountManagementController", "AccountManagementController", "selected item: " + JSON.stringify(item))

        $mdDialog.show({
            controller: accountDetailDialogController,
            templateUrl: 'assets/view/dialog/accountDetail.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose:true,
            locals: {
                accountData: item
            }
        })
            .then(function(accountData) {
                KSAppService.debug("AccountManagementController", "edit", "user data: " + JSON.stringify(accountData))
            }, function() {
                KSAppService.info("AccountManagementController", "edit", "you just canceled dialog")
            });
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

    function accountDetailDialogController($scope, $mdDialog, accountData) {

        KSAppService.info("accountDetailDialogController", "accountDetailDialogController", "init")

        var data = accountData

        $scope.hide = function() {
            $mdDialog.cancel();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.submit = function() {
            KSAppService.debug("accountDetailDialogController", "submit", "user data: " + JSON.stringify(data))
            $mdDialog.hide(data);
        };
    }
})