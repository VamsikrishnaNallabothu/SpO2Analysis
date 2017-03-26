'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('header', function($state) {
        return {
            templateUrl: 'scripts/directives/header/header.html',
            restrict: 'E',
            replace: true,
            scope: {},
            controller: function($scope) {
                if (typeof localStorage !== undefined) {
                    var loggedInUser = localStorage.getItem('userData');
                    $scope.loggedInUser = JSON.parse(loggedInUser);
                }
                $scope.logout = function() {
                    if (typeof localStorage !== undefined) {
                        localStorage.removeItem('userData');
                    }
                    $state.go('login');
                }
            }
        }
    });
