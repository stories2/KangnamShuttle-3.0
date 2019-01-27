app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "assets/view/default.html",
            controller : null,
            cache: false,
            disableCache: true,
        })
        .when("/home", {
            templateUrl : "assets/view/default.html",
            controller : null,
            cache: false,
            disableCache: true,
        })
        .when("/shuttleLocation", {
            templateUrl : "assets/view/shuttleLocation.html",
            controller : "ShuttleLocationController",
            cache: false,
            disableCache: true,
        })
        .when("/accounts", {
            templateUrl : "assets/view/accountManagement.html",
            controller : "AccountManagementController",
            cache: false,
            disableCache: true,
        })
        .otherwise({
            redirectTo: '/',
            cache: false,
            disableCache: true,
        });
});