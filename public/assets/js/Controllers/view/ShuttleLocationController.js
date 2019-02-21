app.controller('ShuttleLocationController', function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, KSAppService) {
  KSAppService.printLogMessage('ShuttleLocationController', 'ShuttleLocationController', 'init', LOG_LEVEL_INFO)

  $scope.busLocationData = {}
  $scope.refreshTime = 0

  $scope.onLoad = function () {
    $scope.refreshTime = SHUTTLE_LOCATION_REFRESH_TIME
  }

  $scope.stream = function (busLocationData) {
    KSAppService.info('ShuttleLocationController', 'stream', 'location data accepted')

    $scope.busLocationData = busLocationData
  }
})
