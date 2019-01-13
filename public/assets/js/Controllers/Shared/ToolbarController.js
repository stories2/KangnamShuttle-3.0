app.controller("ToolbarController", function ($scope, $http, $mdToast, $mdSidenav, $window, KSAppService) {
    KSAppService.printLogMessage("ToolbarController", "ToolbarController", "init", LOG_LEVEL_INFO);

    $scope.title = APP_TITLE
})