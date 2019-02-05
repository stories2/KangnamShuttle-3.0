app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "assets/view/default.html",
            controller : "DefaultPageController",
            cache: false,
            disableCache: true,
        })
        .when("/home", {
            templateUrl : "assets/view/default.html",
            controller : "DefaultPageController",
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
        .when("/shuttle", {
            templateUrl : "assets/view/shuttleManagement.html",
            controller : "ShuttleManagementController",
            cache: false,
            disableCache: true,
        })
        .when("/api", {
            templateUrl : "assets/view/apiManagement.html",
            controller : "ApiManagementController",
            cache: false,
            disableCache: true,
        })
        .otherwise({
            redirectTo: '/',
            cache: false,
            disableCache: true,
        });
});