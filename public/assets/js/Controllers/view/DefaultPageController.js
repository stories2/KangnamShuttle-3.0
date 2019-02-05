app.controller("DefaultPageController", function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
    KSAppService.info("DefaultPageController", "DefaultPageController", "init");
    
    $scope.onDonateBtnClicked = function () {
        KSAppService.info("DefaultPageController", "onDonateBtnClicked", "yea! donate!")


        $mdDialog.show({
            controller: donateDialogController,
            templateUrl: 'assets/view/dialog/donate.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose:true
        })
            .then(function() {
                KSAppService.debug("DefaultPageController", "onDonateBtnClicked", "donate ok")
            }, function() {
                KSAppService.info("DefaultPageController", "onDonateBtnClicked", "you just canceled donate dialog")
            });
    }

    function donateDialogController($scope, $mdDialog) {

        $scope.data = {}
        $scope.donateMoney = 5

        $scope.hide = function() {
            $mdDialog.cancel();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.submit = function() {
            // $scope.data["signIn"] = isSignIn
            // KSAppService.debug("ToolbarController", "signInDialogController-submit", "user data: " + JSON.stringify($scope.data))
            $mdDialog.hide();
        };
    }
})