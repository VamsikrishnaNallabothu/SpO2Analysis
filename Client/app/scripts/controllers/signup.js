'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:Signup Controller
 * @description
 * # Signup Ctrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('SignupCtrl', function($scope, ProfileService, Notification, $state) {
        $scope.user = { 'name': '', 'email': '', 'password': '', 'age': '' };
        $scope.createUser = function() {
            ProfileService.register($scope.user).then(function(response) {
                Notification.success('Registration Successful');
                var data = {
                    'userId': response.data.user,
                    'email': $scope.user.email,
                    'name': $scope.user.name,
                    'age': $scope.user.age
                };
                ProfileService.saveProfile(data).then(function(response) {
                    Notification.success('Profile update Successful');
                    if (typeof localStorage !== undefined) {
                    	localStorage.setItem('userData', JSON.stringify(data));
                    }
                    $state.go('dashboard.home');
                }, function(error) {
                    Notification.error({ message: 'Registration success, but profile update failed. Update in profile section' })
                })
            }, function(error) {
                Notification.error({ message: error.data.message, delay: 1000 });
            });
        }

    });
