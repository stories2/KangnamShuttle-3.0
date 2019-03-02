app.controller('SchoolScheduleController', function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
    KSAppService.info('SchoolScheduleController', 'SchoolScheduleController', 'init')

    $scope.googleAuthStatus = "계정 확인 중"
    $scope.isUserSignedIn = false

    function listenAuthStatusChanged () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var displayName = user.displayName
                var email = user.email
                var emailVerified = user.emailVerified
                var photoURL = user.photoURL
                var isAnonymous = user.isAnonymous
                var uid = user.uid
                var providerData = user.providerData
                // ...
                KSAppService.debug('SchoolScheduleController', 'listenAuthStatusChanged', 'signed in user info: ' + JSON.stringify(user))
                if (emailVerified) {

                    gapi.load('client', {
                        callback: function() {
                            KSAppService.info('SchoolScheduleController', 'listenAuthStatusChanged', 'gapi loaded start init')

                            const apiData = {
                                apiKey: KSAppService.config.apiKey,
                                clientId: KSAppService.config.clientId,
                                discoveryDocs: KSAppService.config.discoveryDocs,
                                scope: KSAppService.config.scopes.join(" ")
                            }

                            KSAppService.debug('SchoolScheduleController', 'listenAuthStatusChanged', 'api data: ' + JSON.stringify(apiData))

                            gapi.client
                                .init(apiData)
                                // Loading is finished, so start the app
                                .then(function() {
                                    // Make sure the Google API Client is properly signed in
                                    const authInstance = gapi.auth2.getAuthInstance()
                                    const googleUser = authInstance.signIn()
                                        .then(function () {
                                            if (authInstance.isSignedIn.get()) {
                                                $scope.isUserSignedIn = true
                                                $scope.googleAuthStatus = "계정이 확인되었습니다."
                                                KSAppService.debug('SchoolScheduleController', 'listenAuthStatusChanged', 'gapi user signed in')
                                            }
                                        })
                                        .catch(function (error) {

                                            $scope.isUserSignedIn = false
                                            // firebase.auth().signOut(); // Something went wrong, sign out
                                            $scope.googleAuthStatus = "계정을 확인하는 중 문제가 발생하였습니다."
                                            KSAppService.error('SchoolScheduleController', 'listenAuthStatusChanged', 'gapi auth error: ' + JSON.stringify(error))
                                        })
                                });
                        }
                    })
                }
            } else {
                // User is signed out.
                // ...
                $scope.isUserSignedIn = false
                $scope.googleAuthStatus = "로그인 되지 않았습니다."
                KSAppService.warn('SchoolScheduleController', 'listenAuthStatusChanged', 'user not signed in')
            }
        })
    }

    listenAuthStatusChanged()
})