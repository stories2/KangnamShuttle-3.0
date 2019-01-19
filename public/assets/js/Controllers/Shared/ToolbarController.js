app.controller("ToolbarController", function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
    KSAppService.printLogMessage("ToolbarController", "ToolbarController", "init", LOG_LEVEL_INFO);

    $scope.title = APP_TITLE
    $scope.toggleLeft = buildToggler('left');
    $scope.menuList = [
        {
            "name": "홈",
            "url": "#!/home"
        },
        {
            "name": "실시간 달구지 위치",
            "url": "#!/shuttleLocation"
        }
    ]

    $scope.onBtnSignInClicked = function () {
        $mdDialog.show({
            controller: signInDialogController,
            templateUrl: 'assets/view/dialog/signIn.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose:true
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    }

    function buildToggler(navID) {
        return function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    KSAppService.printLogMessage("ToolbarController", "buildToggler", "toggle " + navID + " is done", LOG_LEVEL_DEBUG);
                });
        };
    }

    function signInDialogController($scope, $mdDialog) {

        $scope.data = {}

        $scope.hide = function() {
            $mdDialog.cancel();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.submit = function(isSignIn) {
            $scope.data["signIn"] = isSignIn
            KSAppService.debug("ToolbarController", "signInDialogController-submit", "user data: " + JSON.stringify($scope.data))
            $mdDialog.hide($scope.data);
        };
    }
})