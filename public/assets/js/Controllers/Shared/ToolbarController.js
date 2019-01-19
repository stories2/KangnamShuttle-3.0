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
    var uid = undefined

    $scope.onBtnSignInClicked = function () {
        $mdDialog.show({
            controller: signInDialogController,
            templateUrl: 'assets/view/dialog/signIn.html',
            parent: angular.element(document.body),
            // targetEvent: ev,
            clickOutsideToClose:true
        })
            .then(function(userData) {
                KSAppService.debug("ToolbarController", "onBtnSignInClicked", "user data: " + JSON.stringify(userData))
                if(userData["isSignIn"]) {
                    startSignIn(userData)
                }
                else {
                    startSignUp(userData)
                }
            }, function() {
                KSAppService.info("ToolbarController", "onBtnSignInClicked", "you just canceled sign in / up dialog")
            });
    }
    
    function startSignIn(userData) {

    }
    
    function startSignUp(userData) {
        var payload = {
            email: userData["email"],
            password: userData["password"],
            name: userData["name"]
        }
        KSAppService.postReq(
            API_AUTH_SIGN_UP,
            payload,
            function (data) {
                KSAppService.debug("ToolbarController", "startSignUp", "sign up result received: " + JSON.stringify(data))
                feedbackSignUpResult(data)
            },
            function (error) {
                KSAppService.debug("ToolbarController", "startSignUp", "sign up failed: " + JSON.stringify(error))
                feedbackSignUpResult({
                    "data": {
                        "success": false
                    }
                })
            }
        )
    }

    function feedbackSignUpResult(data) {
        if(data["data"]["success"]) {
            uid = data["data"]["uid"]
            KSAppService.showToast(FEEDBACK_SIGN_UP_SUCCESS, TOAST_SHOW_LONG)
        }
        else {
            KSAppService.showToast(FEEDBACK_SIGN_UP_FAILED, TOAST_SHOW_LONG)
        }
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