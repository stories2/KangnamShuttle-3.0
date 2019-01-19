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
    $scope.isUserSignedIn = false
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
                if(userData["signIn"]) {
                    startSignIn(userData)
                }
                else {
                    startSignUp(userData)
                }
            }, function() {
                KSAppService.info("ToolbarController", "onBtnSignInClicked", "you just canceled sign in / up dialog")
            });
    }

    $scope.onBtnSignOutClicked = function () {
        firebase.auth().signOut().then(function() {
            KSAppService.info("ToolbarController", "onBtnSignOutClicked", "sign out successfully, bye bye")
        }, function(error) {
            KSAppService.error("ToolbarController", "onBtnSignOutClicked", "cannot sign out: " + error);
        });
    }
    
    function listenAuthStatusChanged() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;
                // ...
                KSAppService.debug("ToolbarController", "listenAuthStatusChanged", "signed in user info: " + JSON.stringify(user))
                if(emailVerified) {
                    $scope.isUserSignedIn = true
                    KSAppService.showToast(displayName + FEEDBACK_SIGN_IN_SUCCESS, TOAST_SHOW_LONG)
                }
                else {
                    $scope.isUserSignedIn = false
                    firebase.auth().currentUser.sendEmailVerification();
                    KSAppService.showToast(FEEDBACK_VERIFY_FIRST, TOAST_SHOW_LONG)
                    KSAppService.warn("ToolbarController", "listenAuthStatusChanged", "this user not verified, send register email")
                }
            } else {
                // User is signed out.
                // ...
                $scope.isUserSignedIn = false
                KSAppService.warn("ToolbarController", "listenAuthStatusChanged", "user not signed in")
            }
        });
    }
    
    function startSignIn(userData) {
        firebase.auth().signInWithEmailAndPassword(userData["email"], userData["password"]).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            $scope.isUserSignedIn = false
            KSAppService.error("ToolbarController", "startSignIn", "sign in failed: " + errorCode + ", " + errorMessage)
            KSAppService.showToast(FEEDBACK_SIGN_IN_FAILED + ", " + errorMessage, TOAST_SHOW_LONG)
        });
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

    listenAuthStatusChanged()
})