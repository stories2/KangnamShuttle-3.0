app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'assets/view/default.html',
      controller: 'DefaultPageController',
      cache: false,
      disableCache: true
    })
    .when('/home', {
      templateUrl: 'assets/view/default.html',
      controller: 'DefaultPageController',
      cache: false,
      disableCache: true
    })
    .when('/shuttleLocation', {
      templateUrl: 'assets/view/shuttleLocation.html',
      controller: 'ShuttleLocationController',
      cache: false,
      disableCache: true
    })
    .when('/transport/subway', {
      templateUrl: 'assets/view/publicTransportSubway.html',
      controller: 'PublicTransportSubwayController',
      cache: false,
      disableCache: true
    })
    .when('/transport/bus', {
      templateUrl: 'assets/view/publicTransportBus.html',
      controller: 'PublicTransportBusController',
      cache: false,
      disableCache: true
    })
    .when('/accounts', {
      templateUrl: 'assets/view/accountManagement.html',
      controller: 'AccountManagementController',
      cache: false,
      disableCache: true
    })
    .when('/shuttle', {
      templateUrl: 'assets/view/shuttleManagement.html',
      controller: 'ShuttleManagementController',
      cache: false,
      disableCache: true
    })
    .when('/api', {
      templateUrl: 'assets/view/apiManagement.html',
      controller: 'ApiManagementController',
      cache: false,
      disableCache: true
    })
      .when('/tts', {
          templateUrl: 'assets/view/ttsGenerate.html',
          controller: 'TtsGenerateController',
          cache: false,
          disableCache: true
      })
      .when('/tts/:tid', {
          templateUrl: 'assets/view/ttsRead.html',
          controller: 'TtsReadController',
          cache: false,
          disableCache: true
      })
      .when('/school/schedule', {
          templateUrl: 'assets/view/schoolSchedule.html',
          controller: 'SchoolScheduleController',
          cache: false,
          disableCache: true
      })
    .otherwise({
      redirectTo: '/',
      cache: false,
      disableCache: true
    })
})
