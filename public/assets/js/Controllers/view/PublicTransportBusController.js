app.controller('PublicTransportBusController', function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
  $scope.platformAndRoute = {}

  KSAppService.info('PublicTransportBusController', 'PublicTransportBusController', 'init')

  $scope.streamBus = function (platformAndRoute) {
    KSAppService.debug('PublicTransportBusController', 'streamBus', 'data: ' + JSON.stringify(platformAndRoute))
    $scope.platformAndRoute = platformAndRoute
  }
})
