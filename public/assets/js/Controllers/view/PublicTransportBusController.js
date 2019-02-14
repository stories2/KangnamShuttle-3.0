app.controller("PublicTransportBusController", function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
    KSAppService.info("PublicTransportBusController", "PublicTransportBusController", "init");

    $scope.streamBus = function (platformAndRoute) {
        KSAppService.debug("PublicTransportBusController", "streamBus", "data: " + JSON.stringify(platformAndRoute))
    }
})