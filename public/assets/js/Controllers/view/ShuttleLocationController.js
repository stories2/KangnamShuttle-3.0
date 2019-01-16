app.controller("ShuttleLocationController", function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, KSAppService) {
    KSAppService.printLogMessage("ShuttleLocationController", "ShuttleLocationController", "init", LOG_LEVEL_INFO);
    
    $scope.onLoad = function () {
    }
})