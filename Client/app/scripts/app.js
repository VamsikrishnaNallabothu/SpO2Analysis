'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
    .module('sbAdminApp', [
        'oc.lazyLoad',
        'ui.router',
        'ui.bootstrap',
        'angular-loading-bar',
        'angularMoment',
        'chart.js',
        'ui-notification',
        'angular-oauth2',
        'elasticsearch',
        'ui.select'
    ])
    .constant('_', window._)
    // use in views, ng-repeat="x in _.range(3)"
    .run(function($rootScope) {
        $rootScope._ = window._;
    })
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', 'OAuthProvider',
        function($locationProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, OAuthProvider) {



            OAuthProvider.configure({
                baseUrl: 'https://www.fitbit.com/oauth2/authorize',
                clientId: ' ', // Perform Setup
                clientSecret: ' ' // Perform Setup
            });

            $ocLazyLoadProvider.config({
                debug: false,
                events: true,
            });
            $urlRouterProvider.otherwise('/dashboard/home');



            $stateProvider
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard/main.html',
                    resolve: {
                        loadMyDirectives: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                    name: 'sbAdminApp',
                                    files: [
                                        'scripts/directives/header/header.js',
                                        'scripts/directives/sidebar/sidebar.js'
                                    ]
                                }),
                                $ocLazyLoad.load({
                                    name: 'toggle-switch',
                                    files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                                        "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                                    ]
                                }),
                                $ocLazyLoad.load({
                                    name: 'ngAnimate',
                                    files: ['bower_components/angular-animate/angular-animate.js']
                                })
                            $ocLazyLoad.load({
                                name: 'ngCookies',
                                files: ['bower_components/angular-cookies/angular-cookies.js']
                            })
                            $ocLazyLoad.load({
                                name: 'ngResource',
                                files: ['bower_components/angular-resource/angular-resource.js']
                            })
                            $ocLazyLoad.load({
                                name: 'ngSanitize',
                                files: ['bower_components/angular-sanitize/angular-sanitize.js']
                            })
                            $ocLazyLoad.load({
                                name: 'ngTouch',
                                files: ['bower_components/angular-touch/angular-touch.js']
                            })
                        }
                    }
                })
                .state('dashboard.home', {
                    url: '/home',
                    controller: 'MainCtrl',
                    templateUrl: 'views/dashboard/home.html',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                        name: 'ngFileUpload',
                                        files: [
                                            'bower_components/ng-file-upload-shim/ng-file-upload-shim.min.js',
                                            'bower_components/ng-file-upload/ng-file-upload.min.js',
                                        ]
                                    }),
                                    $ocLazyLoad.load({
                                        name: 'aws-sdk',
                                        files: [
                                            'bower_components/aws-sdk/dist/aws-sdk.min.js'
                                        ]
                                    }),
                                    $ocLazyLoad.load({
                                        name: 'sbAdminApp',
                                        files: [
                                            'scripts/services/elasticSearchService.js',
                                            'scripts/controllers/main.js',
                                            'scripts/directives/fileDirective.js'
                                        ]
                                    })
                            }
                            /*
                                                userdata: function(httpService) {
                                                    if (typeof localStorage !== undefined) {
                                                        var loggedInUser = JSON.parse(localStorage.getItem('userData'));
                                                        var data = { 'userid': loggedInUser.userId };
                                                    }
                                                    return httpService.sendRequest('POST', data, 'uservitals', {});
                                                }*/
                    }
                })
                .state('dashboard.form', {
                    templateUrl: 'views/form.html',
                    url: '/form'
                })
                .state('dashboard.blank', {
                    templateUrl: 'views/pages/blank.html',
                    url: '/blank'
                })
                .state('login', {
                    templateUrl: 'views/pages/login.html',
                    controller: 'LoginCtrl',
                    url: '/login',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/controllers/login.js',
                                    'scripts/services/profileService.js'
                                ]
                            })
                        }
                    }
                })
                .state('signup', {
                    templateUrl: 'views/pages/signup.html',
                    controller: 'SignupCtrl',
                    url: '/signup',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/controllers/signup.js',
                                    'scripts/services/profileService.js'
                                ]
                            })
                        }
                    }
                })
                .state('profile', {
                    templateUrl: 'views/pages/profile.html',
                    controller: 'ProfileCtrl',
                    url: '/profile',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/controllers/profile.js',
                                    'scripts/services/profileService.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.chart', {
                    templateUrl: 'views/chart.html',
                    url: '/chart',
                    controller: 'ChartCtrl',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/services/sessionService.js',
                                    'scripts/services/fitbitService.js',
                                    'scripts/services/elasticSearchService.js',
                                    'scripts/controllers/chartContoller.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.analysis', {
                    templateUrl: 'views/analysis.html',
                    url: '/analysis',
                    controller: 'AnalysisCtrl',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/controllers/analysis.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.table', {
                    templateUrl: 'views/form.html',
                    url: '/table',
                    controller: 'PredictCtrl',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/services/predictService.js',
                                    'scripts/controllers/predict.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.panels-wells', {
                    templateUrl: 'views/ui-elements/panels-wells.html',
                    url: '/panels-wells'
                })
                .state('dashboard.buttons', {
                    templateUrl: 'views/ui-elements/buttons.html',
                    url: '/buttons'
                })
                .state('dashboard.notifications', {
                    templateUrl: 'views/ui-elements/notifications.html',
                    url: '/notifications'
                })
                .state('dashboard.typography', {
                    templateUrl: 'views/ui-elements/typography.html',
                    url: '/typography'
                })
                .state('dashboard.icons', {
                    templateUrl: 'views/ui-elements/icons.html',
                    url: '/icons'
                })
                .state('dashboard.grid', {
                    templateUrl: 'views/ui-elements/grid.html',
                    url: '/grid'
                })
        }
    ]);
