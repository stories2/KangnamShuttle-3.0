app.controller("ToolbarController", function ($scope, $http, $mdToast, $mdSidenav, $window, KSAppService) {
    KSAppService.printLogMessage("ToolbarController", "ToolbarController", "init", LOG_LEVEL_INFO);

    $scope.title = APP_TITLE
    $scope.toggleLeft = buildToggler('left');

    function buildToggler(navID) {
        return function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    KSAppService.printLogMessage("ToolbarController", "buildToggler", "toggle " + navID + " is done", LOG_LEVEL_DEBUG);
                });
        };
    }
})