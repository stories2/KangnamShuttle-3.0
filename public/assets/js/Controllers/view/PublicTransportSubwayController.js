app.controller('PublicTransportSubwayController', function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
  KSAppService.info('PublicTransportSubwayController', 'PublicTransportSubwayController', 'init')

  $scope.platformAndRoute = {}

  $scope.streamSubway = function (platformAndRoute) {
    KSAppService.debug('PublicTransportSubwayController', 'streamSubway', 'data: ' + JSON.stringify(platformAndRoute))
    $scope.platformAndRoute = platformAndRoute
  }
})
