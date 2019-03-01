app.controller('TtsGenerateController', function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
    KSAppService.info('TtsGenerateController', 'TtsGenerateController', 'init')

    $scope.memeList = [
        {
            mid: "test",
            name: "name"
        }
    ]
})