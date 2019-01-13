app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "assets/view/default.html",
            controller : null,
            cache: false,
            disableCache: true,
        })
        .otherwise({
            redirectTo: '/',
            cache: false,
            disableCache: true,
        });
});