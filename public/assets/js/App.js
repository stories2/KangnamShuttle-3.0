var app = angular.module('KSApp', ['ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngFileUpload',
    'cleave.js']);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($q, $rootScope) {
        return {
            'request': function (config) {
                // intercepts the request
                $('#spinnerView').show();
                return config;
            },
            'response': function (response) {
                // intercepts the response. you can examine things like status codes
                $('#spinnerView').hide();
                return response;
            },
            'responseError': function (response) {
                // intercepts the response when the response was an error
                $('#spinnerView').hide();
                return response;
            }
        };
    });
});

app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function() {
        $templateCache.removeAll();
    });
});

app.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeFunc);
        }
    };
});