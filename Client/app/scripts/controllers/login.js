'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('LoginCtrl', function($scope, $state, Notification, ProfileService) {

        $scope.user = { 'email': '', 'password': '' };

        $scope.login = function() {
            if (typeof localStorage !== undefined) {
                localStorage.removeItem('userData');
            }

            ProfileService.login($scope.user).then(function(response) {
                Notification.success('Login Successful');
                ProfileService.getUserProfile(response.data.user).then(function(response) {
                    var data = {
                        'userId': response.data.userId,
                        'email': response.data.email,
                        'name': response.data.name,
                        'age': response.data.age
                    };
                    if (typeof localStorage !== undefined) {
                        localStorage.setItem('userData', JSON.stringify(data));
                    }
                    $state.go('dashboard.home');
                }, function() {
                    Notification.error('Unable to get profile');
                    $state.go('dashboard.home');
                })

            }, function() {
                Notification.error('Login Failed');
            });

        };
    });
