app.controller('SchoolScheduleController', function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
    KSAppService.info('SchoolScheduleController', 'SchoolScheduleController', 'init')

    $scope.googleAuthStatus = "계정 확인 중"
    $scope.isUserSignedIn = false
    $scope.isSyncProcessWorking = false
    $scope.deleteCounter = ZERO
    $scope.deleteLength = ZERO
    $scope.insertCounter = ZERO
    $scope.insertLength = ZERO
    $scope.schoolScheduleList = []

    $scope.onLoad = function() {
        getLatestSchoolLifeSchedule()
    }

    $scope.syncCalendar = function() {
        if($scope.isSyncProcessWorking === false) {
            $scope.deleteCounter = ZERO
            $scope.deleteLength = ZERO
            $scope.insertCounter = ZERO
            $scope.insertLength = $scope.schoolScheduleList.length
            $scope.googleAuthStatus = "동기화가 시작됨"
            $scope.isSyncProcessWorking = true
            KSAppService.info("SchoolScheduleController", "syncCalendar", "sync started")
        }
    }
    
    $scope.testInsert = function () {
        var resource = {
            "summary": "Appointment",
            // "location": "Somewhere",
            "start": {
                "date": "2019-03-01",
                // "dateTime": "2019-03-01T10:00:00-07:00",
                "timeZone": "Asia/Seoul"
            },
            "end": {
                "date": "2019-03-02",
                // "dateTime": "2019-03-02T10:25:00-07:00",
                "timeZone": "Asia/Seoul"
            },
            "description": "Generated by KangnamShuttle-3.0"
        };
        var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': resource
        });
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {

                request.execute(function(resp) {
                    console.log(resp);
                });
            }).catch(function (error) {

        })
    }

    $scope.testDelete = function () {
        var resource = {
            calendarId: 'primary',
            eventId: '1pdpsb3q6mhj9qi139llahk3l8'
        }
        console.log("start delete with", resource)
        var request = gapi.client.calendar.events.delete(resource)
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {
                console.log("ok token generated")
                request.execute(function (resp) {
                    console.log(resp)
                })
            })
            .catch(function (error) {
                console.log("cannot generate token", error)
            })
    }
    
    function getAlreadyRegisteredMyCalendarList() {
        
    }
    
    function registerNewCalendarList() {
        
    }

    function getLatestSchoolLifeSchedule() {
        var payload = {}
        
        KSAppService.getReq(
            API_GET_PUBLIC_SCHOOL_LIFE_SCHEDULE,
            payload,
            function (data) {
                KSAppService.debug("SchoolScheduleController", "getLatestSchoolLifeSchedule", "result: " + JSON.stringify(data))
            },
            function (error) {
                KSAppService.error("SchoolScheduleController", "getLatestSchoolLifeSchedule", "cannot get schedule: " + JSON.stringify(error))
            }
        )
    }

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
                                            $scope.googleAuthStatus = "계정을 확인하는 중 문제가 발생하였습니다. 대부분 팝업 허용이 되지 않았을 경우 이 메시지가 출력됩니다."
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