app.controller('SchoolScheduleController', function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
    KSAppService.info('SchoolScheduleController', 'SchoolScheduleController', 'init')

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
                    $scope.isUserSignedIn = true

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
                                    // const googleUser = gapi.auth2.getAuthInstance().signIn()
                                    if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                                        // startApp(user);
                                        KSAppService.debug('SchoolScheduleController', 'listenAuthStatusChanged', 'gapi user signed in')
                                    } else {
                                        // firebase.auth().signOut(); // Something went wrong, sign out
                                        KSAppService.warn('SchoolScheduleController', 'listenAuthStatusChanged', 'gapi user not signed in')
                                    }
                                });
                        }
                    })
                }
            } else {
                // User is signed out.
                // ...
                $scope.isUserSignedIn = false
                KSAppService.warn('SchoolScheduleController', 'listenAuthStatusChanged', 'user not signed in')
            }
        })
    }

    listenAuthStatusChanged()
})